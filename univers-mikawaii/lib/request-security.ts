function normalizeOrigin(value: string) {
  const url = new URL(value);
  return url.origin;
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    const ip = first?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  return "unknown";
}

function parseAllowedOrigins(raw: string | undefined) {
  if (!raw) return [];

  const origins: string[] = [];

  for (const origin of raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)) {
    try {
      origins.push(normalizeOrigin(origin));
    } catch {
      continue;
    }
  }

  return origins;
}

function getCheckoutAllowedOrigins() {
  const configured = parseAllowedOrigins(process.env.CHECKOUT_ALLOWED_ORIGINS);
  if (configured.length > 0) {
    return configured;
  }

  const fallback = process.env.NEXT_PUBLIC_APP_URL;
  if (!fallback) {
    return [];
  }

  try {
    return [normalizeOrigin(fallback)];
  } catch {
    return [];
  }
}

export function resolveTrustedCheckoutOrigin(request: Request) {
  const allowedOrigins = getCheckoutAllowedOrigins();

  if (allowedOrigins.length === 0) {
    return {
      ok: false as const,
      status: 500,
      error: "Configuration d'origine autorisee manquante.",
      allowedOrigins,
    };
  }

  const originHeader = request.headers.get("origin");

  if (!originHeader) {
    return {
      ok: true as const,
      origin: allowedOrigins[0],
      allowedOrigins,
    };
  }

  let normalizedOrigin: string;
  try {
    normalizedOrigin = normalizeOrigin(originHeader);
  } catch {
    return {
      ok: false as const,
      status: 400,
      error: "Origin invalide.",
      allowedOrigins,
    };
  }

  if (!allowedOrigins.includes(normalizedOrigin)) {
    return {
      ok: false as const,
      status: 403,
      error: "Origin non autorise.",
      allowedOrigins,
    };
  }

  return {
    ok: true as const,
    origin: normalizedOrigin,
    allowedOrigins,
  };
}


