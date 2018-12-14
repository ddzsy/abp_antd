import { stringify } from "qs";
import request from "@/utils/request";

export async function query() {
  return request("/api/users");
}

export async function queryCurrent() {
  return request("/api/currentUser");
}

export async function test() {
  return request("/AbpUserConfiguration/GetAll");
}

export async function getAll() {
  return request("/AbpUserConfiguration/GetAll");
}

export async function queryUsers(params) {
  return request(`/api/services/app/User/GetUsers?${stringify(params)}`);
}
