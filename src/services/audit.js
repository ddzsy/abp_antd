import { stringify } from "qs";
import request from "@/utils/request";

export async function queryAudit(params) {
  return request(
    `/api/services/app/AuditLog/GetAuditLogs?${stringify(params)}`
  );
}
