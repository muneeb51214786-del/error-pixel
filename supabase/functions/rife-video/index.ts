const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") {
    return Response.json({ error: "POST required" }, { status: 405, headers: cors });
  }

  const workerUrl = Deno.env.get("RIFE_WORKER_URL");
  const workerToken = Deno.env.get("RIFE_WORKER_API_TOKEN");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const suppliedKey = request.headers.get("apikey");
  const authorization = request.headers.get("authorization");

  if (!workerUrl || !workerToken || !supabaseAnonKey) {
    return Response.json({ error: "RIFE gateway secrets are not configured." }, { status: 503, headers: cors });
  }
  if (!suppliedKey || suppliedKey !== supabaseAnonKey || !authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "A valid signed-in user session is required." }, { status: 401, headers: cors });
  }
  const authCheck = await fetch(new URL("/auth/v1/user", Deno.env.get("SUPABASE_URL")!), {
    headers: { apikey: supabaseAnonKey, Authorization: authorization },
  });
  if (!authCheck.ok) {
    return Response.json({ error: "Your session is invalid or expired. Sign in again." }, { status: 401, headers: cors });
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return Response.json({ error: "Expected multipart video upload." }, { status: 400, headers: cors });
  }
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Missing video file field named file." }, { status: 400, headers: cors });
  }
  if (file.size <= 0 || file.size > 250 * 1024 * 1024) {
    return Response.json({ error: "Video must be between 1 byte and 250 MB." }, { status: 413, headers: cors });
  }

  const outgoing = new FormData();
  outgoing.set("file", file, file.name || "source.mp4");
  let upstream: Response;
  try {
    upstream = await fetch(new URL("/v1/video/rife/2x", workerUrl), {
      method: "POST",
      headers: { "X-API-Key": workerToken },
      body: outgoing,
      signal: AbortSignal.timeout(12 * 60 * 1000),
    });
  } catch {
    return Response.json({ error: "RIFE GPU worker is unreachable or timed out." }, { status: 502, headers: cors });
  }

  if (!upstream.ok) {
    const detail = await upstream.text();
    return Response.json(
      { error: "RIFE processing failed.", detail: detail.slice(0, 2000) },
      { status: upstream.status, headers: cors },
    );
  }

  const headers = new Headers(cors);
  headers.set("Content-Type", "video/mp4");
  headers.set("Content-Disposition", 'attachment; filename="EnhanceError_RIFE_2x.mp4"');
  headers.set("Cache-Control", "no-store");
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);
  return new Response(upstream.body, { status: 200, headers });
});
