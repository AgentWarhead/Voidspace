/**
 * Uptime Monitoring Helper for Voidspace API
 * 
 * Tracks API calls in memory for performance monitoring and analytics.
 * Stores the last 1000 API calls in a circular buffer for efficient memory usage.
 */

interface ApiCall {
  route: string;
  method: string;
  status: number;
  durationMs: number;
  ip: string;
  timestamp: number;
}

interface ApiStats {
  totalCalls: number;
  averageResponseTime: number;
  errorRate: number;
  callsByRoute: Record<string, number>;
  callsByMethod: Record<string, number>;
  callsByStatus: Record<number, number>;
  recentCalls: ApiCall[];
  uptime: number;
  timeRange: {
    start: number;
    end: number;
  };
}

// Circular buffer for storing API calls
class CircularBuffer<T> {
  private buffer: (T | undefined)[];
  private head: number = 0;
  private size: number = 0;
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.size < this.capacity) {
      this.size++;
    }
  }

  toArray(): T[] {
    if (this.size === 0) return [];
    
    const result: T[] = [];
    let index = this.size < this.capacity ? 0 : this.head;
    
    for (let i = 0; i < this.size; i++) {
      const item = this.buffer[index];
      if (item !== undefined) {
        result.push(item);
      }
      index = (index + 1) % this.capacity;
    }
    
    return result;
  }

  getSize(): number {
    return this.size;
  }
}

// Global buffer to store API calls (last 1000 calls)
const apiCallBuffer = new CircularBuffer<ApiCall>(1000);
const startTime = Date.now();

/**
 * Log an API call for monitoring purposes
 * 
 * @param route - API route path (e.g., '/api/health', '/api/opportunities')
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param status - HTTP status code (200, 400, 500, etc.)
 * @param durationMs - Request duration in milliseconds
 * @param ip - Client IP address
 */
export function logApiCall(
  route: string,
  method: string,
  status: number,
  durationMs: number,
  ip: string = 'unknown'
): void {
  const apiCall: ApiCall = {
    route: route.replace(/\/[0-9]+/g, '/:id'), // Normalize dynamic routes
    method: method.toUpperCase(),
    status,
    durationMs,
    ip,
    timestamp: Date.now()
  };

  apiCallBuffer.push(apiCall);
}

/**
 * Get comprehensive API statistics
 * 
 * @param timeWindowMs - Optional time window in milliseconds (default: all data)
 * @returns API statistics object
 */
export function getApiStats(timeWindowMs?: number): ApiStats {
  const allCalls = apiCallBuffer.toArray();
  const now = Date.now();
  
  // Filter calls within time window if specified
  const calls = timeWindowMs 
    ? allCalls.filter(call => now - call.timestamp <= timeWindowMs)
    : allCalls;

  if (calls.length === 0) {
    return {
      totalCalls: 0,
      averageResponseTime: 0,
      errorRate: 0,
      callsByRoute: {},
      callsByMethod: {},
      callsByStatus: {},
      recentCalls: [],
      uptime: Math.floor((now - startTime) / 1000),
      timeRange: { start: now, end: now }
    };
  }

  // Sort calls by timestamp (most recent first)
  const sortedCalls = calls.sort((a, b) => b.timestamp - a.timestamp);
  
  // Calculate statistics
  const totalCalls = calls.length;
  const totalDuration = calls.reduce((sum, call) => sum + call.durationMs, 0);
  const averageResponseTime = Math.round(totalDuration / totalCalls);
  
  const errorCalls = calls.filter(call => call.status >= 400).length;
  const errorRate = Math.round((errorCalls / totalCalls) * 100) / 100;

  // Group by different dimensions
  const callsByRoute: Record<string, number> = {};
  const callsByMethod: Record<string, number> = {};
  const callsByStatus: Record<number, number> = {};

  calls.forEach(call => {
    // Count by route
    callsByRoute[call.route] = (callsByRoute[call.route] || 0) + 1;
    
    // Count by method
    callsByMethod[call.method] = (callsByMethod[call.method] || 0) + 1;
    
    // Count by status
    callsByStatus[call.status] = (callsByStatus[call.status] || 0) + 1;
  });

  const timeRange = {
    start: Math.min(...calls.map(call => call.timestamp)),
    end: Math.max(...calls.map(call => call.timestamp))
  };

  return {
    totalCalls,
    averageResponseTime,
    errorRate,
    callsByRoute,
    callsByMethod,
    callsByStatus,
    recentCalls: sortedCalls.slice(0, 10), // Last 10 calls
    uptime: Math.floor((now - startTime) / 1000),
    timeRange
  };
}

/**
 * Get quick health metrics for dashboard/monitoring
 */
export function getHealthMetrics(): {
  status: 'healthy' | 'warning' | 'critical';
  averageResponseTime: number;
  errorRate: number;
  requestVolume: number;
  uptime: number;
} {
  const stats = getApiStats(5 * 60 * 1000); // Last 5 minutes
  
  // Determine health status based on metrics
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (stats.errorRate > 10 || stats.averageResponseTime > 5000) {
    status = 'critical';
  } else if (stats.errorRate > 5 || stats.averageResponseTime > 2000) {
    status = 'warning';
  }

  return {
    status,
    averageResponseTime: stats.averageResponseTime,
    errorRate: stats.errorRate,
    requestVolume: stats.totalCalls,
    uptime: stats.uptime
  };
}

/**
 * Middleware helper to automatically log API calls
 * Usage: Add to your API routes for automatic monitoring
 * 
 * @param request - Next.js request object
 * @param handler - Your API handler function
 * @returns Response with automatic call logging
 */
export async function withMonitoring<T>(
  request: Request,
  handler: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  const url = new URL(request.url);
  const route = url.pathname;
  const method = request.method;
  
  // Extract IP (basic implementation)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip') 
    || 'unknown';

  try {
    const result = await handler();
    const durationMs = Date.now() - startTime;
    
    // Log successful call
    logApiCall(route, method, 200, durationMs, ip);
    
    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    
    // Determine status code from error
    const status = error instanceof Error && 'status' in error 
      ? (error as Error & { status: number }).status 
      : 500;
    
    logApiCall(route, method, status, durationMs, ip);
    
    throw error;
  }
}

// Export types for external usage
export type { ApiStats, ApiCall };