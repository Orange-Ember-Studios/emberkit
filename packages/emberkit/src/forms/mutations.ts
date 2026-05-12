export interface MutationOptions<TData, TVariables> {
  onMutate?: (variables: TVariables) => TData | Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data?: TData, error?: Error) => void;
}

export interface MutationResult<TData> {
  data: TData | null;
  error: Error | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface ActionContext {
  request: Request;
  params: Record<string, string>;
  query: URLSearchParams;
}

export type ActionHandler<TData = unknown, TVariables = Record<string, unknown>> = (
  variables: TVariables,
  context: ActionContext,
) => TData | Promise<TData>;

export interface ActionResult<TData> {
  data: TData | null;
  error: string | null;
  status: number;
  headers?: Record<string, string>;
}

export function createAction<TData, TVariables>(
  handler: ActionHandler<TData, TVariables>,
  options?: MutationOptions<TData, TVariables>,
) {
  return async (
    variables: TVariables,
    context?: Partial<ActionContext>,
  ): Promise<ActionResult<TData>> => {
    let optimisticData: TData | undefined;
    
    try {
      if (options?.onMutate) {
        optimisticData = await options.onMutate(variables);
      }

      const data = await handler(variables, {
        request: context?.request ?? new Request('http://localhost'),
        params: context?.params ?? {},
        query: context?.query ?? new URLSearchParams(),
      } as ActionContext);

      options?.onSuccess?.(data, variables);

      return {
        data,
        error: null,
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      options?.onError?.(error, variables);

      return {
        data: null,
        error: error.message,
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      };
    } finally {
      options?.onSettled?.(optimisticData as TData | undefined);
    }
  };
}

export function createMutation<TData, TVariables>(
  handler: ActionHandler<TData, TVariables>,
  options?: MutationOptions<TData, TVariables>,
) {
  let state: MutationResult<TData> = {
    data: null,
    error: null,
    status: 'idle',
    isPending: false,
    isSuccess: false,
    isError: false,
  };

  const listeners = new Set<(state: MutationResult<TData>) => void>();

  const notify = () => {
    listeners.forEach((fn) => fn(state));
  };

  const mutate = async (variables: TVariables): Promise<ActionResult<TData>> => {
    state = {
      data: null,
      error: null,
      status: 'pending',
      isPending: true,
      isSuccess: false,
      isError: false,
    };
    notify();

    try {
      let optimisticData: TData | undefined;

      if (options?.onMutate) {
        optimisticData = await options.onMutate(variables);
      }

      const data = await handler(variables, {
        request: new Request('http://localhost'),
        params: {},
        query: new URLSearchParams(),
      });

      state = {
        data,
        error: null,
        status: 'success',
        isPending: false,
        isSuccess: true,
        isError: false,
      };
      notify();

      options?.onSuccess?.(data, variables);
      options?.onSettled?.(data);

      return { data, error: null, status: 200 };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      state = {
        data: null,
        error,
        status: 'error',
        isPending: false,
        isSuccess: false,
        isError: true,
      };
      notify();

      options?.onError?.(error, variables);
      options?.onSettled?.(undefined, error);

      return { data: null, error: error.message, status: 500 };
    }
  };

  const subscribe = (listener: (state: MutationResult<TData>) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = () => state;

  const reset = () => {
    state = {
      data: null,
      error: null,
      status: 'idle',
      isPending: false,
      isSuccess: false,
      isError: false,
    };
    notify();
  };

  return { mutate, subscribe, getState, reset };
}

export async function handleAction(
  handler: ActionHandler,
  request: Request,
): Promise<Response> {
  let variables: Record<string, unknown> = {};

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    const contentType = request.headers.get('Content-Type') ?? '';

    if (contentType.includes('application/json')) {
      variables = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        variables[key] = value;
      }
    } else {
      variables = await request.text().then((t) => JSON.parse(t)).catch(() => ({}));
    }
  } else if (request.method === 'GET') {
    const url = new URL(request.url);
    for (const [key, value] of url.searchParams.entries()) {
      variables[key] = value;
    }
  }

  const url = new URL(request.url);
  const params: Record<string, string> = {};
  const segments = url.pathname.split('/').filter(Boolean);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.startsWith(':') || segment.startsWith('[')) {
      const paramName = segment.replace(/^[:[\]]+/g, '');
      params[paramName] = segments[i + 1] ?? '';
    }
  }

  const context: ActionContext = {
    request,
    params,
    query: url.searchParams,
  };

  try {
    const data = await handler(variables as Record<string, unknown>, context);

    return Response.json({ data }, {
      status: 200,
      headers: { 'X-Action': 'success' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Action failed';

    return Response.json({ error: message }, {
      status: 500,
      headers: { 'X-Action': 'error' },
    });
  }
}

export function createActionHandler(
  handler: ActionHandler,
) {
  return async (request: Request): Promise<Response> => {
    return handleAction(handler, request);
  };
}

export type MutationKey = string;

export const mutationCache = new Map<MutationKey, MutationResult<unknown>>();

export function getCachedMutation(key: MutationKey): MutationResult<unknown> | undefined {
  return mutationCache.get(key);
}

export function setCachedMutation<T>(key: MutationKey, result: MutationResult<T>): void {
  mutationCache.set(key, result as MutationResult<unknown>);
}

export function invalidateMutation(key: MutationKey): void {
  mutationCache.delete(key);
}

export function clearMutationCache(): void {
  mutationCache.clear();
}

export interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<ActionResult<TData>>;
  state: MutationResult<TData>;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  action: ActionHandler<TData, TVariables>,
  options?: MutationOptions<TData, TVariables>,
): UseMutationReturn<TData, TVariables> {
  let state: MutationResult<TData> = {
    data: null,
    error: null,
    status: 'idle',
    isPending: false,
    isSuccess: false,
    isError: false,
  };

  const listeners = new Set<(s: MutationResult<TData>) => void>();

  const notify = () => listeners.forEach((fn) => fn(state));

  const mutate = async (variables: TVariables): Promise<ActionResult<TData>> => {
    state = {
      data: null,
      error: null,
      status: 'pending',
      isPending: true,
      isSuccess: false,
      isError: false,
    };
    notify();

    try {
      if (options?.onMutate) {
        await options.onMutate(variables);
      }

      const data = await action(variables, {
        request: new Request('http://localhost'),
        params: {},
        query: new URLSearchParams(),
      });

      state = {
        data,
        error: null,
        status: 'success',
        isPending: false,
        isSuccess: true,
        isError: false,
      };
      notify();

      options?.onSuccess?.(data, variables);
      options?.onSettled?.(data);

      return { data, error: null, status: 200 };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      state = {
        data: null,
        error,
        status: 'error',
        isPending: false,
        isSuccess: false,
        isError: true,
      };
      notify();

      options?.onError?.(error, variables);
      options?.onSettled?.(undefined, error);

      return { data: null, error: error.message, status: 500 };
    }
  };

  const reset = () => {
    state = {
      data: null,
      error: null,
      status: 'idle',
      isPending: false,
      isSuccess: false,
      isError: false,
    };
    notify();
  };

  return { mutate, state, reset };
}