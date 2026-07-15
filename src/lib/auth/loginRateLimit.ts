export const LOGIN_EMAIL_COOLDOWN_SECONDS = 60;

export type LoginSendState = {
  isSending: boolean;
  cooldownSeconds: number;
};

export function canSendLoginEmail(state: LoginSendState) {
  return !state.isSending && state.cooldownSeconds <= 0;
}

export function getLoginSendButtonLabel(state: LoginSendState) {
  if (state.isSending) {
    return "发送中";
  }

  if (state.cooldownSeconds > 0) {
    return `${state.cooldownSeconds} 秒后重试`;
  }

  return "发送登录链接";
}

export function getLoginCooldownMessage(cooldownSeconds: number) {
  if (cooldownSeconds <= 0) {
    return "";
  }

  return `登录链接已发送，请检查邮箱。${cooldownSeconds} 秒后可再次发送。`;
}

type LoginSendControllerOptions = {
  cooldownSeconds?: number;
  now?: () => number;
};

export function createLoginSendController(
  options: LoginSendControllerOptions = {},
) {
  const cooldownMs =
    (options.cooldownSeconds ?? LOGIN_EMAIL_COOLDOWN_SECONDS) * 1000;
  const now = options.now ?? Date.now;
  let isSending = false;
  let cooldownUntil = 0;

  return {
    getState(): LoginSendState {
      const remainingMs = Math.max(0, cooldownUntil - now());

      return {
        isSending,
        cooldownSeconds: Math.ceil(remainingMs / 1000),
      };
    },
    beginSend() {
      if (isSending || cooldownUntil > now()) {
        return false;
      }

      isSending = true;
      return true;
    },
    finishSend(ok: boolean) {
      isSending = false;

      if (ok) {
        cooldownUntil = now() + cooldownMs;
      }
    },
    resetCooldown() {
      cooldownUntil = 0;
    },
  };
}
