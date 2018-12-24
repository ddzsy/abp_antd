import { stringify } from "qs";
import request from "@/utils/request";

export async function queryRole(params) {
  return request(`/api/services/app/Role/GetRoles?${stringify(params)}`);
}

export async function queryRoleForEdit(params) {
  return request(`/api/services/app/Role/GetRoleForEdit?${stringify(params)}`);
}