import assert from "node:assert/strict";
import test from "node:test";
import {
  checkRateLimit,
  resetRateLimitForTests,
} from "../../src/lib/security/rateLimit";

test.beforeEach(() => {
  resetRateLimitForTests();
});

test("allows requests until the configured limit", () => {
  const first = checkRateLimit("client-a", {
    limit: 2,
    now: 1_000,
    windowMs: 60_000,
  });
  const second = checkRateLimit("client-a", {
    limit: 2,
    now: 2_000,
    windowMs: 60_000,
  });

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(second.remaining, 0);
});

test("rejects excess requests and reports retry time", () => {
  checkRateLimit("client-a", { limit: 1, now: 1_000, windowMs: 60_000 });
  const blocked = checkRateLimit("client-a", {
    limit: 1,
    now: 11_000,
    windowMs: 60_000,
  });

  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 50);
});

test("starts a fresh window after expiry", () => {
  checkRateLimit("client-a", { limit: 1, now: 1_000, windowMs: 60_000 });
  const nextWindow = checkRateLimit("client-a", {
    limit: 1,
    now: 61_000,
    windowMs: 60_000,
  });

  assert.equal(nextWindow.allowed, true);
});
