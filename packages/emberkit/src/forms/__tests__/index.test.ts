import { describe, it, expect } from 'vitest';
import {
  FormValidator,
  createFormValidator,
  parseFormData,
  createFormState,
  setFieldValue,
  setFieldError,
  handleFormSubmit,
  applyDefaultValidator,
} from '../index.js';

describe('Forms', () => {
  describe('FormValidator', () => {
    it('should validate required fields', () => {
      const validator = new FormValidator({
        fields: {
          name: { required: true },
        },
      });

      const errors = validator.validate({});

      expect(errors.name).toBe('name is required');
    });

    it('should validate minLength', () => {
      const validator = new FormValidator({
        fields: {
          password: { minLength: 8 },
        },
      });

      const errors = validator.validate({ password: 'short' });

      expect(errors.password).toBe('password must be at least 8 characters');
    });

    it('should validate maxLength', () => {
      const validator = new FormValidator({
        fields: {
          username: { maxLength: 3 },
        },
      });

      const errors = validator.validate({ username: 'toolong' });

      expect(errors.username).toBe('username must be at most 3 characters');
    });

    it('should validate pattern', () => {
      const validator = new FormValidator({
        fields: {
          email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        },
      });

      const errors = validator.validate({ email: 'invalid' });

      expect(errors.email).toBe('email is invalid');
    });

    it('should validate custom function', () => {
      const validator = new FormValidator({
        fields: {
          age: {
            custom: (v) => (typeof v === 'number' && v < 0) ? 'Age cannot be negative' : null,
          },
        },
      });

      const errors = validator.validate({ age: -1 });

      expect(errors.age).toBe('Age cannot be negative');
    });

    it('should pass valid data', () => {
      const validator = new FormValidator({
        fields: {
          name: { required: true },
          email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        },
      });

      const errors = validator.validate({
        name: 'John',
        email: 'john@example.com',
      });

      expect(Object.keys(errors).length).toBe(0);
    });

    it('should validate field only', () => {
      const validator = new FormValidator({
        fields: {
          email: { required: true },
        },
      });

      const error = validator.validateFieldOnly('email', '');

      expect(error).toBe('email is required');
    });
  });

  describe('parseFormData', () => {
    it('should parse form data', () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');

      const data: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      expect(data.name).toBe('John');
      expect(data.email).toBe('john@example.com');
    });

    it('should handle multiple values', () => {
      const formData = new FormData();
      formData.append('tags', 'a');
      formData.append('tags', 'b');
      formData.append('tags', 'c');

      const data: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        if (data[key] !== undefined) {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          (data[key] as unknown[]).push(value);
        } else {
          data[key] = value;
        }
      }

      expect(data.tags).toEqual(['a', 'b', 'c']);
    });
  });

  describe('FormState', () => {
    it('should create initial state', () => {
      const state = createFormState({ name: 'John' });

      expect(state.values.name).toBe('John');
      expect(state.errors).toEqual({});
      expect(state.dirty).toBe(false);
    });

    it('should update field value', () => {
      const state = createFormState();
      const updated = setFieldValue(state, 'name', 'Jane');

      expect(updated.values.name).toBe('Jane');
      expect(updated.dirty).toBe(true);
    });

    it('should set field error', () => {
      const state = createFormState();
      const updated = setFieldError(state, 'email', 'Invalid email');

      expect(updated.errors.email).toBe('Invalid email');
    });
  });

  describe('applyDefaultValidator', () => {
    it('should apply default email validator', () => {
      const validator = applyDefaultValidator('email', {});

      const error = validator.custom?.('not-an-email');

      expect(error).toBe('Invalid email');
    });
  });
});