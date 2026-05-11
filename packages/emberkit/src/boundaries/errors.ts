export class NotFoundError extends Error {
  readonly code = 'NOT_FOUND';
  readonly status = 404;

  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  readonly code = 'VALIDATION_ERROR';
  readonly fields: Record<string, string>;
  readonly status = 422;

  constructor(message = 'Validation failed', fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class UnauthorizedError extends Error {
  readonly code = 'UNAUTHORIZED';
  readonly status = 401;

  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  readonly code = 'FORBIDDEN';
  readonly status = 403;

  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class InternalError extends Error {
  readonly code = 'INTERNAL_ERROR';
  readonly status = 500;

  constructor(message = 'Internal server error') {
    super(message);
    this.name = 'InternalError';
  }
}

export function isEmberKitError(error: unknown): error is EmberKitError {
  return error instanceof Error && 'code' in error && 'status' in error;
}

export interface EmberKitError extends Error {
  code: string;
  status: number;
}

export function toLoaderError(error: unknown): {
  error: { code: string; message: string; status: number };
} {
  if (isEmberKitError(error)) {
    return {
      error: {
        code: error.code,
        message: error.message,
        status: error.status,
      },
    };
  }

  if (error instanceof Error) {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
        status: 500,
      },
    };
  }

  return {
    error: {
      code: 'UNKNOWN_ERROR',
      message: String(error),
      status: 500,
    },
  };
}
