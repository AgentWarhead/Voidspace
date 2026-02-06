interface AbuseEvent {
  type: 'auth_failure' | 'rate_limit' | 'csrf_failure' | 'oversized_request' | 'suspicious_ua';
  ip: string;
  path: string;
  timestamp: number;
}

const abuseLog: AbuseEvent[] = [];
const ALERT_THRESHOLD = 20; // events per window
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
let lastAlertTime = 0;
const ALERT_COOLDOWN = 15 * 60 * 1000; // 15 min between alerts

export function logAbuseEvent(event: Omit<AbuseEvent, 'timestamp'>): void {
  const now = Date.now();
  abuseLog.push({ ...event, timestamp: now });
  
  // Trim old events
  const cutoff = now - WINDOW_MS;
  while (abuseLog.length > 0 && abuseLog[0].timestamp < cutoff) {
    abuseLog.shift();
  }
  
  // Check if we should alert
  if (abuseLog.length >= ALERT_THRESHOLD && now - lastAlertTime > ALERT_COOLDOWN) {
    lastAlertTime = now;
    const summary = getAbuseSummary();
    console.error(`🚨 ABUSE ALERT: ${summary}`);
    // Alert will be picked up by Vercel logs / monitoring
    // For webhook alerting, could POST to a Telegram bot webhook here
  }
}

function getAbuseSummary(): string {
  const byType: Record<string, number> = {};
  const byIp: Record<string, number> = {};
  
  for (const event of abuseLog) {
    byType[event.type] = (byType[event.type] || 0) + 1;
    byIp[event.ip] = (byIp[event.ip] || 0) + 1;
  }
  
  const topIp = Object.entries(byIp).sort((a, b) => b[1] - a[1])[0];
  const types = Object.entries(byType).map(([k, v]) => `${k}:${v}`).join(', ');
  
  return `${abuseLog.length} events in 5min | Types: ${types} | Top IP: ${topIp?.[0]} (${topIp?.[1]} events)`;
}

export function getAbuseStats() {
  return {
    recentEvents: abuseLog.length,
    windowMs: WINDOW_MS,
    threshold: ALERT_THRESHOLD,
  };
}