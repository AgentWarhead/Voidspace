export class RequestSizeError extends Error {
  constructor(message: string, public status: number = 413) {
    super(message);
    this.name = 'RequestSizeError';
  }
}

export class JsonParseError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = 'JsonParseError';
  }
}

/**
 * Parse JSON body with size limit
 * @param request The Request object
 * @param maxBytes Maximum allowed body size in bytes (default: 100KB)
 * @returns Parsed JSON object
 * @throws RequestSizeError if body exceeds maxBytes
 * @throws JsonParseError if JSON parsing fails
 */
export async function parseJsonBody<T = unknown>(
  request: Request, 
  maxBytes: number = 102400 // 100KB default
): Promise<T> {
  try {
    // Read the body as text first to check size
    const bodyText = await request.text();
    
    // Check size limit
    const bodySize = new TextEncoder().encode(bodyText).length;
    if (bodySize > maxBytes) {
      throw new RequestSizeError(
        `Request body too large: ${bodySize} bytes exceeds limit of ${maxBytes} bytes`
      );
    }

    // Parse JSON
    if (!bodyText.trim()) {
      throw new JsonParseError('Request body is empty');
    }

    try {
      const parsed = JSON.parse(bodyText) as T;
      return parsed;
    } catch (parseError) {
      throw new JsonParseError(
        `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
      );
    }
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof RequestSizeError || error instanceof JsonParseError) {
      throw error;
    }
    
    // Handle other errors (e.g., body already consumed)
    if (error instanceof Error) {
      throw new JsonParseError(`Failed to read request body: ${error.message}`);
    }
    
    throw new JsonParseError('Unknown error reading request body');
  }
}

/**
 * Get the size of a request body without consuming it
 * @param request The Request object
 * @returns Promise<number> Size in bytes
 */
export async function getRequestBodySize(request: Request): Promise<number> {
  const cloned = request.clone();
  const text = await cloned.text();
  return new TextEncoder().encode(text).length;
}

/**
 * Check if request body size is within limit
 * @param request The Request object
 * @param maxBytes Maximum allowed size
 * @returns Promise<boolean>
 */
export async function isRequestSizeValid(
  request: Request, 
  maxBytes: number = 102400
): Promise<boolean> {
  try {
    const size = await getRequestBodySize(request);
    return size <= maxBytes;
  } catch {
    return false;
  }
}

// Types are already exported with their class declarations