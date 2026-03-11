import request, { createHeaders } from "@/lib/api/client.js";

export async function getPage({ id, cb } = {}) {
  const url = `/pages/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function createPage({ id, body, cb } = {}) {
  const url = `/pages/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "POST", headers, body, cb });
}

export async function updatePage({ id, body, cb } = {}) {
  const url = `/pages/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}