// Checks whether the request carries a valid "site_auth" cookie matching
// our password. Used to protect the write endpoints (create/delete tests)
// without gating the whole site.
export function isAuthenticated(request) {
  const cookie = request.cookies.get("site_auth");
  return Boolean(process.env.SITE_PASSWORD) && cookie?.value === process.env.SITE_PASSWORD;
}
