import request, { createHeaders } from "@/lib/api/client.js";

export async function getSection({ id, cb } = {}) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function createSection({ id, body, cb } = {}) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "POST", headers, body, cb });
}

export async function updateSection({ id, body, cb } = {}) {
  const url = `/sections/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}