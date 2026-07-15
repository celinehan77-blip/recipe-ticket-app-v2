import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyAuthSendError,
  getAuthSendErrorMessage,
} from "../../src/lib/auth/session";
import {
  canSendLoginEmail,
  createLoginSendController,
  getLoginCooldownMessage,
  getLoginSendButtonLabel,
  LOGIN_EMAIL_COOLDOWN_SECONDS,
} from "../../src/lib/auth/loginRateLimit";

test("classifies Supabase email send rate limit safely", () => {
  const code = classifyAuthSendError({
    message: "email rate limit exceeded",
    status: 429,
  });

  assert.equal(code, "over_email_send_rate_limit");
  assert.equal(
    getAuthSendErrorMessage(code),
    "登录邮件发送过于频繁，请稍后再试。",
  );
});

test("classifies generic request rate limit safely", () => {
  const code = classifyAuthSendError({
    message: "too many requests",
    status: 429,
  });

  assert.equal(code, "over_request_rate_limit");
  assert.equal(
    getAuthSendErrorMessage(code),
    "登录邮件发送过于频繁，请稍后再试。",
  );
});

test("single click starts one login email send", () => {
  let now = 1_000;
  const controller = createLoginSendController({ now: () => now });
  let attempts = 0;

  if (controller.beginSend()) {
    attempts += 1;
  }

  controller.finishSend(true);
  now += LOGIN_EMAIL_COOLDOWN_SECONDS * 1000;

  assert.equal(attempts, 1);
  assert.equal(canSendLoginEmail(controller.getState()), true);
});

test("continuous double click starts only one login email send", () => {
  const controller = createLoginSendController({ now: () => 1_000 });
  let attempts = 0;

  if (controller.beginSend()) attempts += 1;
  if (controller.beginSend()) attempts += 1;

  assert.equal(attempts, 1);
  assert.equal(controller.getState().isSending, true);
  assert.equal(canSendLoginEmail(controller.getState()), false);
});

test("sending state disables the button and shows sending label", () => {
  const controller = createLoginSendController({ now: () => 1_000 });

  controller.beginSend();

  assert.equal(canSendLoginEmail(controller.getState()), false);
  assert.equal(getLoginSendButtonLabel(controller.getState()), "发送中");
});

test("successful send enters cooldown with countdown copy", () => {
  const controller = createLoginSendController({ now: () => 1_000 });

  controller.beginSend();
  controller.finishSend(true);

  assert.equal(controller.getState().cooldownSeconds, 60);
  assert.equal(canSendLoginEmail(controller.getState()), false);
  assert.match(getLoginSendButtonLabel(controller.getState()), /秒后重试/);
  assert.match(getLoginCooldownMessage(60), /60 秒后可再次发送/);
});

test("cooldown allows another send after 60 seconds", () => {
  let now = 1_000;
  const controller = createLoginSendController({ now: () => now });

  controller.beginSend();
  controller.finishSend(true);
  now += 59_000;

  assert.equal(canSendLoginEmail(controller.getState()), false);

  now += 1_000;

  assert.equal(canSendLoginEmail(controller.getState()), true);
  assert.equal(getLoginSendButtonLabel(controller.getState()), "发送登录链接");
});

test("rerender-like state reads do not auto send", () => {
  const controller = createLoginSendController({ now: () => 1_000 });

  controller.getState();
  controller.getState();
  controller.getState();

  assert.equal(canSendLoginEmail(controller.getState()), true);
});

test("page load creates no hidden login email send", () => {
  const controller = createLoginSendController({ now: () => 1_000 });

  assert.deepEqual(controller.getState(), {
    isSending: false,
    cooldownSeconds: 0,
  });
});

test("network failure does not retry without another user action", async () => {
  const controller = createLoginSendController({ now: () => 1_000 });
  let attempts = 0;

  async function sendOnce() {
    if (!controller.beginSend()) return;

    attempts += 1;
    controller.finishSend(false);
  }

  await sendOnce();

  assert.equal(attempts, 1);
  assert.equal(canSendLoginEmail(controller.getState()), true);
});
