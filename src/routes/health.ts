/** GET /api/health — simple health check. */
export function healthHandler(): Response {
    return Response.json({ status: "ok" });
}
