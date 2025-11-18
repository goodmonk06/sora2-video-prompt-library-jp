/**
 * Storage adapter interface
 * Provides file/image storage capabilities for future use
 */

export interface StorageUploadOptions {
  key: string;
  content: Buffer | string;
  contentType?: string;
  metadata?: Record<string, any>;
}

export interface StorageFile {
  key: string;
  url: string;
  size: number;
  contentType?: string;
  metadata?: Record<string, any>;
}

export interface IStorageAdapter {
  upload(options: StorageUploadOptions): Promise<StorageFile>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
  list(prefix?: string): Promise<StorageFile[]>;
}

/**
 * Local Storage Adapter (stub implementation)
 */
export class LocalStorageAdapter implements IStorageAdapter {
  private storage: Map<string, { content: Buffer; contentType?: string; metadata?: Record<string, any> }> = new Map();

  async upload(options: StorageUploadOptions): Promise<StorageFile> {
    const { key, content, contentType, metadata } = options;
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);

    this.storage.set(key, {
      content: buffer,
      contentType,
      metadata,
    });

    return {
      key,
      url: `/storage/${key}`,
      size: buffer.length,
      contentType,
      metadata,
    };
  }

  async download(key: string): Promise<Buffer> {
    const file = this.storage.get(key);
    if (!file) {
      throw new Error(`File not found: ${key}`);
    }
    return file.content;
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async getUrl(key: string): Promise<string> {
    if (!this.storage.has(key)) {
      throw new Error(`File not found: ${key}`);
    }
    return `/storage/${key}`;
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const files: StorageFile[] = [];

    for (const [key, value] of this.storage.entries()) {
      if (!prefix || key.startsWith(prefix)) {
        files.push({
          key,
          url: `/storage/${key}`,
          size: value.content.length,
          contentType: value.contentType,
          metadata: value.metadata,
        });
      }
    }

    return files;
  }
}

// Default adapter
export const storageAdapter: IStorageAdapter = new LocalStorageAdapter();
