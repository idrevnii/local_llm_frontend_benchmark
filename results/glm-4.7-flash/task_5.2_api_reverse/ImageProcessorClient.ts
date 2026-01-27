// Types for ImageProcessor API responses
export interface ImageMeta {
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface ProcessingOptions {
  resize?: { width: number; height: number };
  format?: string;
  quality?: number;
}

export interface ImageError {
  code: string;
  message: string;
}

export interface UploadResult {
  id: string;
  status: "queued" | "processing";
  created: number;
  meta: ImageMeta | null;
  options?: ProcessingOptions;
}

export interface ProcessingImage {
  id: string;
  status: "processing";
  progress: number;
  created: number;
  meta: ImageMeta | null;
}

export interface CompletedImage {
  id: string;
  status: "completed";
  progress: 100;
  created: number;
  completed: number;
  meta: ImageMeta;
  result: {
    original: string;
    processed: string;
    thumbnail: string;
  };
}

export interface FailedImage {
  id: string;
  status: "failed";
  progress: number;
  created: number;
  error: ImageError;
}

export type ImageStatus = ProcessingImage | CompletedImage | FailedImage;

// Custom error classes
export class ImageProcessorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessorError";
  }
}

export class AuthError extends ImageProcessorError {
  constructor(message: string = "API key required") {
    super(message);
    this.name = "AuthError";
  }
}

export class RateLimitError extends ImageProcessorError {
  constructor(message: string = "Too many requests", public retryAfter?: number) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class NotFoundError extends ImageProcessorError {
  constructor(message: string = "Image not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ProcessingError extends ImageProcessorError {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ProcessingError";
  }
}

// ImageProcessorClient class
export class ImageProcessorClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.imageprocessor.example.com";
  }

  private getHeaders(): HeadersInit {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "multipart/form-data"
    };
  }

  private async handleResponse(response: Response): Promise<any> {
    if (response.status === 401) {
      throw new AuthError();
    }
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "30");
      throw new RateLimitError("Too many requests", retryAfter);
    }
    if (response.status === 404) {
      throw new NotFoundError();
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "unknown", message: "Unknown error" }));
      throw new ProcessingError(error.message || "Unknown error", error.code);
    }
    return response.json();
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (error instanceof RateLimitError && error.retryAfter) {
          const delay = Math.min(1000 * Math.pow(2, i), error.retryAfter * 1000);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError || new Error("Retry failed");
  }

  async upload(file: File, options?: ProcessingOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams();
    if (options?.resize) {
      queryParams.append("resize", `${options.resize.width}x${options.resize.height}`);
    }
    if (options?.format) {
      queryParams.append("format", options.format);
    }
    if (options?.quality) {
      queryParams.append("quality", options.quality.toString());
    }

    const url = `${this.baseUrl}/api/v2/images${queryParams.toString() ? `?${queryParams}` : ""}`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: formData
    });

    const data = await this.handleResponse(response);
    
    return {
      id: data.id,
      status: data.status,
      created: data.created,
      meta: data.meta,
      options: data.options
    };
  }

  async getStatus(id: string): Promise<ImageStatus> {
    const response = await fetch(`${this.baseUrl}/api/v2/images/${id}`, {
      method: "GET",
      headers: this.getHeaders()
    });

    const data = await this.handleResponse(response);
    
    return {
      id: data.id,
      status: data.status,
      progress: data.progress,
      created: data.created,
      meta: data.meta,
      ...(data.completed && { completed: data.completed }),
      ...(data.error && { error: data.error }),
      ...(data.result && { result: data.result })
    };
  }

  async waitForCompletion(
    id: string,
    timeoutMs: number = 5 * 60 * 1000
  ): Promise<CompletedImage> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (true) {
      const elapsed = Date.now() - startTime;
      
      if (elapsed > timeoutMs) {
        throw new ProcessingError("Timeout waiting for image processing");
      }

      const status = await this.getStatus(id);

      if (status.status === "completed") {
        return status as CompletedImage;
      }

      if (status.status === "failed") {
        throw new ProcessingError(
          status.error?.message || "Image processing failed",
          status.error?.code
        );
      }

      console.log(`Processing progress: ${status.progress}%`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
}
