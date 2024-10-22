export function setStatusColor(status) {
  if (status == "ANSWERED") return "text-success bg-success-subtle";
  if (status == "DRAFT") return "text-info bg-info-subtle";
  if (status == "IN_TERM") return "text-warning bg-warning-subtle";
  return "text-danger bg-danger-subtle";
}
