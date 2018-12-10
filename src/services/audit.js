import request from "@/utils/request";

export async function queryAudit() {
  return request("/api/services/app/AuditLog/GetAuditLogs");
}
