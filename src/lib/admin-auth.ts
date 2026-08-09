export function getAdminPin() {
  return process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || "1962";
}

export function isAuthorizedAdmin(request: Request) {
  const pin = request.headers.get("x-admin-pin")?.trim();
  return Boolean(pin) && pin === getAdminPin();
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
