import request, { createHeaders } from "@/lib/api/client.js";

export async function getProfile({ cb } = {}) {
  const url = `/auth/me`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function createUser({  body, cb } = {}) {
  const url = `/auth`;
  const headers = createHeaders();
  return await request({ url, method: "POST", headers, body, cb });
}

export async function updateUserEmail({   cb } = {}) {
  const url = `/auth/email`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, cb });
}