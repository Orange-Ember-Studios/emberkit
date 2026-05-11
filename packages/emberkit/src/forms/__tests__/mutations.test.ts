import { describe, it, expect } from 'vitest';
import {
  createAction,
  createMutation,
  createActionHandler,
  handleAction,
  useMutation,
  getCachedMutation,
  setCachedMutation,
  invalidateMutation,
  type ActionHandler,
} from '../mutations.js';

describe('Mutations', () => {
  describe('createAction', () => {
    it('should execute action successfully', async () => {
      const action = createAction(async (vars: { name: string }) => {
        return { greeting: `Hello, ${vars.name}` };
      });

      const result = await action({ name: 'World' });

      expect(result.data).toEqual({ greeting: 'Hello, World' });
      expect(result.error).toBeNull();
      expect(result.status).toBe(200);
    });

    it('should handle errors', async () => {
      const action = createAction(async (_vars: unknown) => {
        throw new Error('Action failed');
      });

      const result = await action({});

      expect(result.data).toBeNull();
      expect(result.error).toBe('Action failed');
      expect(result.status).toBe(500);
    });

    it('should call onMutate', async () => {
      const onMutate = vi.fn().mockResolvedValue({ temp: true });

      const action = createAction(
        async (vars: { value: number }) => ({ result: vars.value * 2 }),
        { onMutate },
      );

      await action({ value: 5 });

      expect(onMutate).toHaveBeenCalledWith({ value: 5 });
    });

    it('should call onSuccess', async () => {
      const onSuccess = vi.fn();

      const action = createAction(
        async (vars: { name: string }) => ({ message: `Hi ${vars.name}` }),
        { onSuccess },
      );

      await action({ name: 'John' });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should call onError', async () => {
      const onError = vi.fn();

      const action = createAction(async (_vars: unknown) => {
        throw new Error('Test error');
      }, { onError });

      await action({});

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        {},
      );
    });
  });

  describe('createMutation', () => {
    it('should track state changes', async () => {
      const mutation = createMutation(async (vars: { id: number }) => ({
        id: vars.id,
      }));

      let capturedState: unknown;

      mutation.subscribe((state) => {
        capturedState = state;
      });

      await mutation.mutate({ id: 1 });

      expect(capturedState).toMatchObject({
        status: 'success',
        isSuccess: true,
      });
    });

    it('should handle errors', async () => {
      const mutation = createMutation(async (_vars: unknown) => {
        throw new Error('Failed');
      });

      await mutation.mutate({});

      const state = mutation.getState();

      expect(state.status).toBe('error');
      expect(state.isError).toBe(true);
    });

    it('should reset state', async () => {
      const mutation = createMutation(async (_vars: unknown) => ({ success: true }));

      await mutation.mutate({});
      mutation.reset();

      const state = mutation.getState();

      expect(state.status).toBe('idle');
    });
  });

  describe('handleAction', () => {
    it('should handle POST with JSON', async () => {
      const action: ActionHandler<{ created: boolean; name: string }, { name: string }> = async (vars) => ({
        created: true,
        name: vars.name,
      });

      const request = new Request('http://localhost/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      });

      const response = await handleAction(action, request);
      const json = await response.json();

      expect(json.data.created).toBe(true);
    });

    it('should handle GET with query params', async () => {
      const action: ActionHandler<{ found: boolean; id: string }, { id: string }> = async (vars) => ({
        found: true,
        id: vars.id,
      });

      const request = new Request('http://localhost/action?id=123', {
        method: 'GET',
      });

      const response = await handleAction(action, request);
      const json = await response.json();

      expect(json.data.id).toBe('123');
    });

    it('should return error on exception', async () => {
      const action: ActionHandler<unknown, unknown> = async () => {
        throw new Error('Action error');
      };

      const request = new Request('http://localhost/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await handleAction(action, request);
      const json = await response.json();

      expect(json.error).toBe('Action error');
    });
  });

  describe('useMutation', () => {
    it('should execute mutation', async () => {
      let resultData: unknown = null;

      const action = async (vars: { value: number }) => {
        resultData = vars.value * 3;
        return { result: resultData };
      };

      const { mutate } = useMutation(action);
      const response = await mutate({ value: 4 });

      expect(response.data).toEqual({ result: 12 });
    });
  });

  describe('mutation cache', () => {
    it('should cache results', () => {
      const result = {
        data: { id: 1 },
        error: null,
        status: 'success' as const,
        isPending: false,
        isSuccess: true,
        isError: false,
      };

      setCachedMutation('test-key', result);

      const cached = getCachedMutation('test-key');

      expect(cached?.data).toEqual({ id: 1 });
    });

    it('should invalidate cache', () => {
      setCachedMutation('key1', { data: 1, error: null, status: 'success', isPending: false, isSuccess: true, isError: false } as any);

      invalidateMutation('key1');

      expect(getCachedMutation('key1')).toBeUndefined();
    });
  });
});