import request, { createHeaders } from "@/lib/api/client.js";


export async function getBlogs({ cb } = {}) {
  const url = "/blogs";
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function getBlog({ id, cb } = {}) {
  const url = `/blogs/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function createBlog({ id, body, cb } = {}) {
  const url = `/blogs/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "POST", headers, body, cb });
}

export async function updateBlog({ id, body, cb } = {}) {
  const url = `/blogs/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}

export async function deleteBlog({ id, cb } = {}) {
  const url = `/blogs/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "DELETE", headers, cb });
}