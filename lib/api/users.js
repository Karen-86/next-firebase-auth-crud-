import request, { createHeaders } from "@/lib/api/client.js";

export async function getUsers({ cb } = {}) {
  const url = "/users";
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function getUser({ id, cb } = {}) {
  const url = `/users/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "GET", headers, cb });
}

export async function updateUser({ id, body, cb } = {}) {
  const url = `/users/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}

export async function updateUserRoles({ id, body, cb } = {}) {
  const url = `/users/${id}/roles`;
  const headers = createHeaders();
  return await request({ url, method: "PATCH", headers, body, cb });
}

export async function deleteUser({ id, cb } = {}) {
  const url = `/users/${id}`;
  const headers = createHeaders();
  return await request({ url, method: "DELETE", headers, cb });
}