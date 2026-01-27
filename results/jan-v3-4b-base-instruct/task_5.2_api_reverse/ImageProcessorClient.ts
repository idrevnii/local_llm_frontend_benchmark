// ImageProcessorClient.ts

interface ProcessingOptions {
  resize?: { width: number; height: number };
  format?: string;
  quality?: number;
}

interface UploadResult {
  id: string;
  status: 'queued';
  created: number;
  meta?: null;
  options?: ProcessingOptions;
}

interface ImageStatusBase {
  id: string;
  created: number;
  progress: number;
  status: 'processing' | 'completed' | 'failed';
}

interface ImageStatusProcessing extends ImageStatusBase {
  status: 'processing';
  progress: number;
}

interface ImageStatusCompleted extends ImageStatusBase {
  status: 'completed';
  completed: number;
  meta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  result: {
    original: string;
    processed: string;
    thumbnail: string;
  };
}

interface ImageStatusFailed extends ImageStatusBase {
  status: 'failed';
  error: {
    code: string;
    message: string;
  };
}

type ImageStatus = ImageStatusProcessing | ImageStatusCompleted | ImageStatusFailed;

class AuthError extends Error {
  constructor(message: string) {
    super(`AuthError: ${message}`);
    this.name = 'AuthError';
  }
}

class RateLimitError extends Error {
  constructor(message: string, retryAfter?: number) {
    super(`RateLimitError: ${message} (retry after: ${retryAfter}s)`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
  retryAfter?: number;
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(`NotFoundError: ${message}`);
    this.name = 'NotFoundError';
  }
}

class ImageProcessorClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.imageprocessor.example.com';
  }

  async upload(file: File, options?: ProcessingOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.resize) {
      formData.append('resize', `${options.resize.width}x${options.resize.height}`);
    }
    if (options?.format) {
      formData.append('format', options.format);
    }
    if (options?.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }

    const response = await fetch(`${this.baseUrl}/api/v2/images?resize=${options?.resize?.width}x${options?.height}&format=${options?.format}&quality=${options?.quality}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new AuthError(errorData.error?.message || 'API key required');
      } else if (response.status === 429) {
        const retryAfter = errorData.retry_after;
        throw new RateLimitError(errorData.message, retryAfter);
      } else if (response.status === 404) {
        throw new NotFoundError(errorData.error?.message || 'Image not found');
      } else {
        throw new Error(`Upload failed: ${errorData.message}`);
      }
    }

    const result = await response.json();
    return {
      id: result.id,
      status: 'queued',
      created: result.created,
      meta: null,
      options
    };
  }

  async getStatus(id: string): Promise<ImageStatus> {
    const response = await fetch(`${this.baseUrl}/api/v2/images/${id}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new NotFoundError(errorData.error?.message || 'Image not found');
      } else {
        throw new Error(`Status request failed: ${errorData.message}`);
      }
    }

    const data = await response.json();

    if (data.status === 'processing') {
      return {
        id: data.id,
        created: data.created,
        progress: data.progress,
        status: 'processing'
      } as ImageStatusProcessing;
    } else if (data.status === 'completed') {
      return {
        id: data.id,
        created: data.created,
        completed: data.completed,
        meta: data.meta,
        result: data.result,
        status: 'completed'
      } as ImageStatusCompleted;
    } else if (data.status === 'failed') {
      return {
        id: data.id,
        created: data.created,
        progress: data.progress,
        error: data.error,
        status: 'failed'
      } as ImageStatusFailed;
    }

    throw new Error(`Unknown status: ${data.status}`);
  }

  async waitForCompletion(id: string, timeoutMs = 300_000): Promise<CompletedImage> {
    const startTime = Date.now();
    const interval = 2000; // poll every 2 seconds

    while (true) {
      try {
        const status = await this.getStatus(id);
        
        if (status.status === 'completed') {
          return status as CompletedImage;
        } else if (status.status === 'failed') {
          throw new Error(`Processing failed: ${status.error?.message}`);
        }

        // Check for timeout
        if (Date.now() - startTime > timeoutMs) {
          throw new Error('Timeout waiting for completion');
        }

        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        if (error instanceof RateLimitError && error.retryAfter) {
          const retryDelay = Math.min(error.retryAfter * 1000, 30_000); // max 30s
          console.log(`Rate limit hit. Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          throw error;
        }
      }
    }
  }
}

// Type alias for completed image (same as ImageStatusCompleted)
type CompletedImage = ImageStatusCompleted;

export { ImageProcessorClient, AuthError, RateLimitError, NotFoundError };
