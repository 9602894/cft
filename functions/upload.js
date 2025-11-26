export async function onRequest(context) {
    const env = context.env;
    const req = await context.request.json();

    const { filename, password, content } = req;

    if (!filename || !password || !content) {
        return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    const KV_KEY = `file:${filename}`;

    await env.FILES.put(KV_KEY, JSON.stringify({
        password,
        content,
        updated: Date.now()
    }));

    return new Response(JSON.stringify({
        success: true,
        fileLink: `${context.request.url.replace("/api/upload", "")}api/read?filename=${encodeURIComponent(filename)}&password=${encodeURIComponent(password)}`
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
