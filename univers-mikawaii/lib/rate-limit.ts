type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitConfig = {
  namespace: string;
  max: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

const globalStore = globalThis as typeof globalThis & {
  __mikawaiiRateLimitStore?: RateLimitStore;
};

const store = globalStore.__mikawaiiRateLimitStore ?? new Map<string, RateLimitEntry>();
globalStore.__mikawaiiRateLimitStore = store;

function cleanupExpiredEntries(now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function takeRateLimitToken(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();

  if (store.size > 10_000) {
    cleanupExpiredEntries(now);
  }

  const key = `${config.namespace}:${identifier}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return {
      ok: true,
      limit: config.max,
      remaining: Math.max(config.max - 1, 0),
      resetAt: now + config.windowMs,
    };
  }

  if (current.count >= config.max) {
    return {
      ok: false,
      limit: config.max,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    ok: true,
    limit: config.max,
    remaining: Math.max(config.max - current.count, 0),
    resetAt: current.resetAt,
  };
}

