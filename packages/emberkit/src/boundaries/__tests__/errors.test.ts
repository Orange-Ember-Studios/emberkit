import { describe, it, expect } from 'vitest';
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InternalError,
  isEmberKitError,
  toLoaderError,
} from '../index.js';

describe('Sentinel Errors', () => {
  describe('NotFoundError', () => {
    it('should have correct code and status', () => {
      const error = new NotFoundError('User not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.status).toBe(404);
      expect(error.message).toBe('User not found');
    });

    it('should use default message', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Resource not found');
    });

    it('should be an EmberKitError', () => {
      expect(isEmberKitError(new NotFoundError())).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should have correct code and status', () => {
      const error = new ValidationError('Invalid input', { email: 'Invalid format' });
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.status).toBe(422);
      expect(error.fields).toEqual({ email: 'Invalid format' });
    });

    it('should use default message', () => {
      const error = new ValidationError();
      expect(error.message).toBe('Validation failed');
    });

    it('should track field errors', () => {
      const error = new ValidationError('Fields invalid', {
        name: 'Required',
        email: 'Invalid format',
      });
      expect(error.fields.name).toBe('Required');
      expect(error.fields.email).toBe('Invalid format');
    });
  });

  describe('UnauthorizedError', () => {
    it('should have correct code and status', () => {
      const error = new UnauthorizedError();
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.status).toBe(401);
    });
  });

  describe('ForbiddenError', () => {
    it('should have correct code and status', () => {
      const error = new ForbiddenError();
      expect(error.code).toBe('FORBIDDEN');
      expect(error.status).toBe(403);
    });
  });

  describe('InternalError', () => {
    it('should have correct code and status', () => {
      const error = new InternalError();
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.status).toBe(500);
    });
  });
});

describe('toLoaderError', () => {
  it('should convert EmberKitError to loader format', () => {
    const notFound = new NotFoundError('User not found');
    const result = toLoaderError(notFound);

    expect(result).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
        status: 404,
      },
    });
  });

  it('should convert ValidationError with fields', () => {
    const validation = new ValidationError('Invalid', { email: 'Required' });
    const result = toLoaderError(validation);

    expect(result.error.code).toBe('VALIDATION_ERROR');
  });

  it('should convert plain Error', () => {
    const error = new Error('Something broke');
    const result = toLoaderError(error);

    expect(result).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something broke',
        status: 500,
      },
    });
  });

  it('should handle unknown errors', () => {
    const result = toLoaderError('string error');
    expect(result).toEqual({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'string error',
        status: 500,
      },
    });
  });
});
