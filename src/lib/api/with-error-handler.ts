import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  error: string;
  requestId: string;
  timestamp: string;
}

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();
    
    try {
      return await handler(req);
    } catch (error) {
      // Log the full error with stack trace for debugging
      console.error(`[${requestId}] API Error:`, {
        url: req.url,
        method: req.method,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });

      // Determine status code
      let status = 500;
      let message = 'Internal Server Error';

      if (error instanceof Error) {
        const customError = error as CustomError;
        
        // Handle known error types
        if (customError.status) {
          status = customError.status;
        } else if (customError.name === 'ValidationError') {
          status = 400;
        } else if (customError.name === 'UnauthorizedError') {
          status = 401;
        } else if (customError.name === 'ForbiddenError') {
          status = 403;
        } else if (customError.name === 'NotFoundError') {
          status = 404;
        }

        // Only expose error message for client errors (4xx)
        if (status >= 400 && status < 500) {
          message = error.message;
        }
      }

      // Return sanitized error response (never leak stack traces)
      const errorResponse: ErrorResponse = {
        error: message,
        requestId,
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(errorResponse, { 
        status,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId
        }
      });
    }
  };
}

export type { ErrorResponse, CustomError };