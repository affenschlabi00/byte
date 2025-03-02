import { headers } from 'next/headers';

// use REDIS in future!!!

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

export async function rateLimit() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  if (store[ip] && store[ip].resetTime < now) {
    delete store[ip];
  }

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
  } else {
    store[ip].count++;
  }

  if (store[ip].count > MAX_REQUESTS) {
    return {
      limited: true,
      message: 'Rate limit exceeded',
      resetTime: store[ip].resetTime
    };
  }

  return {
    limited: false,
    remaining: MAX_REQUESTS - store[ip].count,
    resetTime: store[ip].resetTime
  };
}