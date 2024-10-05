import { describe, expect, it, vi } from 'vitest';
import { ReactiveSwal } from "../../src/components";
import { uploadImage } from '../../src/utils/uploadImage';

vi.mock(import('../../src/components/ui/ReactiveSwal'), async (importOriginal) => {
  const { ReactiveSwal } = await importOriginal();
  Object.assign(ReactiveSwal, { fire: vi.fn() });
  return { ReactiveSwal };
});

describe('uploadImage', () => {
  const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });

  it('should upload image and return secure_url', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ secure_url: 'https://example.com/image.png' }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);
    const result = await uploadImage(mockFile);
    expect(result).toBe('https://example.com/image.png');
    expect(global.fetch).toHaveBeenCalledWith('https://api.cloudinary.com/v1_1/m1dxr7hw/image/upload', expect.any(Object));
  });

  it('should handle error and show alert', async () => {
    const mockErrorResponse = {
      ok: false,
      json: async () => ({ message: 'Upload failed' }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockErrorResponse);
    const result = await uploadImage(mockFile);
    expect(result).toBeUndefined();
    expect(ReactiveSwal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Upload failed',
    });
  });

  it('should handle network error and show alert', async () => {
    const mockError = new Error('Network error');
    global.fetch = vi.fn().mockRejectedValue(mockError);
    const result = await uploadImage(mockFile);
    expect(result).toBeUndefined();
    expect(ReactiveSwal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Network error',
    });
  });

  it('should handle invalid file and show alert', async () => {
    const invalidFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    const mockErrorResponse = {
      ok: false,
      json: async () => ({ message: 'Invalid file type' }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockErrorResponse);
    const result = await uploadImage(invalidFile);
    expect(result).toBeUndefined();
    expect(ReactiveSwal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Invalid file type',
    });
  });

  it('should handle invalid JSON response and show alert', async () => {
    const mockErrorResponse = {
      ok: false,
      json: async () => { throw new Error('Invalid JSON'); },
    };
    global.fetch = vi.fn().mockResolvedValue(mockErrorResponse);
    const result = await uploadImage(mockFile);
    expect(result).toBeUndefined();
    expect(ReactiveSwal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Invalid JSON',
    });
  });

  it('should handle undefined error message and show default alert', async () => {
    const mockErrorResponse = {
      ok: false,
      json: async () => ({}),
    };
    global.fetch = vi.fn().mockResolvedValue(mockErrorResponse);
    const result = await uploadImage(mockFile);
    expect(result).toBeUndefined();
    expect(ReactiveSwal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while uploading the image',
    });
  });
});