import { describe, it, expect, vi } from 'vitest';
import {
  getPasswordStrength,
  validateImage,
  fileToBase64,
  formSchema,
} from '../utils/validation';

describe('utils', () => {
  describe('password strength', () => {
    it('returns 0 for empty password', () => {
      expect(getPasswordStrength('')).toBe(0);
    });

    it('returns 1 for password with only lowercase', () => {
      expect(getPasswordStrength('abc')).toBe(1);
    });

    it('returns 2 for password with lowercase and uppercase', () => {
      expect(getPasswordStrength('abcA')).toBe(2);
    });

    it('returns 3 for password with lowercase, uppercase and number', () => {
      expect(getPasswordStrength('abcA1')).toBe(3);
    });

    it('returns 4 for password with all character types', () => {
      expect(getPasswordStrength('abcA1!')).toBe(4);
    });

    it('handles different special characters', () => {
      expect(getPasswordStrength('abcA1@')).toBe(4);
      expect(getPasswordStrength('abcA1#')).toBe(4);
      expect(getPasswordStrength('abcA1$')).toBe(4);
    });

    it('handles multiple occurrences of character types', () => {
      expect(getPasswordStrength('AAaaa111!!!')).toBe(4);
    });
  });

  describe('image validation', () => {
    it('accepts valid PNG file', () => {
      const file = new File(['x'.repeat(10)], 'test.png', {
        type: 'image/png',
      });
      Object.defineProperty(file, 'size', { value: 10 });
      expect(validateImage(file)).toBeNull();
    });

    it('accepts valid JPEG file', () => {
      const file = new File(['x'.repeat(10)], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(file, 'size', { value: 10 });
      expect(validateImage(file)).toBeNull();
    });

    it('rejects unsupported file type', () => {
      const badFile = new File(['x'.repeat(10)], 'test.gif', {
        type: 'image/gif',
      });
      Object.defineProperty(badFile, 'size', { value: 10 });
      expect(validateImage(badFile)).toContain('Only PNG or JPEG');
    });

    it('rejects file that is too large', () => {
      const largeFile = new File(['x'], 'test.png', { type: 'image/png' });
      Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      expect(validateImage(largeFile)).toContain('File size must be <= 2MB');
    });

    it('accepts file at size limit', () => {
      const file = new File(['x'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // exactly 2MB
      expect(validateImage(file)).toBeNull();
    });
  });

  describe('fileToBase64', () => {
    it('converts file to base64', async () => {
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      const mockFileReader: Partial<FileReader> & {
        readAsDataURL: (file: File) => void;
        result: string | null;
        onload:
          | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
          | null;
      } = {
        readAsDataURL: vi.fn(),
        result: 'data:text/plain;base64,dGVzdCBjb250ZW50',
        onload: null,
      };

      global.FileReader = vi.fn(
        () => mockFileReader as FileReader
      ) as unknown as typeof FileReader;

      const promise = fileToBase64(file);

      setTimeout(() => {
        mockFileReader.onload?.call(
          mockFileReader as FileReader,
          new ProgressEvent('load') as unknown as ProgressEvent<FileReader>
        );
      }, 0);

      const result = await promise;
      expect(result).toBe('data:text/plain;base64,dGVzdCBjb250ZW50');
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    });

    it('handles file reading error', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const mockFileReader: Partial<FileReader> & {
        readAsDataURL: (file: File) => void;
        onerror:
          | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
          | null;
      } = {
        readAsDataURL: vi.fn(),
        onerror: null,
      };

      global.FileReader = vi.fn(
        () => mockFileReader as FileReader
      ) as unknown as typeof FileReader;

      const promise = fileToBase64(file);

      const errorEvent = new ProgressEvent(
        'error'
      ) as unknown as ProgressEvent<FileReader>;
      setTimeout(() => {
        mockFileReader.onerror?.call(mockFileReader as FileReader, errorEvent);
      }, 0);

      await expect(promise).rejects.toBe(errorEvent);
    });
  });

  describe('form schema validation', () => {
    it('validates valid form data', () => {
      const validData = {
        name: 'John Doe',
        age: '25',
        email: 'john@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        gender: 'male' as const,
        acceptTos: true,
        country: 'United States',
        imageBase64: 'data:image/png;base64,test',
      };

      const result = formSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates required fields', () => {
      const invalidData = {
        name: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
      };

      const result = formSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('validates name format', () => {
      const invalidName = {
        name: 'john',
        age: '25',
        email: 'john@example.com',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        gender: 'male' as const,
        acceptTos: true,
        country: 'United States',
      };

      const result = formSchema.safeParse(invalidName);
      expect(result.success).toBe(false);
    });
  });
});
