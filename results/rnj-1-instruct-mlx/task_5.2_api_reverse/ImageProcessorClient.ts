/**
 * API Client for ImageProcessor service
 * Based on examples from TASK.md
 */

// Types for API responses
export type ImageId = string;
export type UnixTimestamp = number;

export interface BaseImageResponse {
  id: ImageId;
  created: UnixTimestamp;
}

export interface ProcessingOptions {
  resize?: string; // e.g., "800x600"
  format?: string; // e.g., "webp"
  quality?: number; // e.g., 85
}

export interface UploadResult {
  id: ImageId;
  status: "queued" | "processing";
  created: UnixTimestamp;
  meta: null;
  options?: {
    resize?: { width: number; height: number } | null;
    format?: string | null;
    quality?: number | null;
  };
}

export interface ProcessingStatus {
  id: ImageId;
  status: "processing";
  progress: number;
  created: UnixTimestamp;
  meta: null;
}

export interface CompletedImage {
  id: ImageId;
  status: "completed";
  progress: 100;
  created: UnixTimestamp;
  completed: UnixTimestamp;
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

export interface FailedImage {
  id: ImageId;
  status: "failed";
  progress: number;
  created: UnixTimestamp;
  error: {
    code: string;
    message: string;
  };
}

export type ImageStatus = UploadResult | ProcessingStatus | CompletedImage | FailedImage;

// Error classes
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Client class
export class ImageProcessorClient {
  private apiKey: string;
  private baseUrl = "https://api.imageprocessor.example.com/api/v2/images";
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    
    if (options.body instanceof FormData) {
      // For multipart/form-data, don't set Content-Type header
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "multipart/form-data");
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
  
  private async handleResponse(response: Response): Promise<any> {
    if (response.status === 401) {
      throw new AuthError("API key required");
    }
    
    if (response.status === 429) {
      const data = await response.json();
      throw new RateLimitError(data.message, data.retry_after || 30);
    }
    
    if (response.status === 404) {
      throw new NotFoundError("Image not found");
    }
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
  }
  
  private async uploadWithRetry(file: File, options?: ProcessingOptions): Promise<ImageStatus> {
    const formData = new FormData();
    formData.append("file", file);
    
    const queryParams = new URLSearchParams();
    if (options?.resize) queryParams.append("resize", options.resize);
    if (options?.format) queryParams.append("format", options.format);
    if (options?.quality) queryParams.append("quality", options.quality.toString());
    
    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    
    try {
      const response = await this.fetchWithAuth(url, {
        method: "POST",
        body: formData,
      });
      
      const data = await this.handleResponse(response);
      return data;
    } catch (error) {
      if (error instanceof RateLimitError) {
        // Exponential backoff for rate limiting
        await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
        return this.uploadWithRetry(file, options);
      }
      throw error;
    }
  }
  
  async upload(file: File, options?: ProcessingOptions): Promise<ImageStatus> {
    return this.uploadWithRetry(file, options);
  }
  
  async getStatus(id: string): Promise<ImageStatus> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`);
    return this.handleResponse(response);
  }
  
  async waitForCompletion(id: string, timeoutMs: number = 300000): Promise<CompletedImage> {
    const startTime = Date.now();
    
    while (true) {
      const status = await this.getStatus(id);
      
      if (status.status === "completed") {
        return status as CompletedImage;
      }
      
      if (status.status === "failed") {
        throw new Error(`Image processing failed: ${status.error?.message}`);
      }
      
      if (Date.now() - startTime > timeoutMs) {
        throw new Error("Timeout waiting for image processing to complete");
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}
