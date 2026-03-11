import request, { createHeaders } from "@/lib/api/client.js";

export async function getBanners({ userId, cb } = {}) {
  let url = "/banners";
  if(userId) url += `?userId=${userId}`
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function getBanner({ id, cb } = {}) {
  const url = `/banners/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function createBanner({  body, cb } = {}) {
  const url = `/banners`;
  const headers = createHeaders();
  return await request({ url, method: "POST", headers, body, cb });
}

export async function updateBanner({ id, body, cb } = {}) {
  const url = `/banners/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}

export async function upsertBanner({ id, body, cb } = {}) {
  const url = `/banners/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}