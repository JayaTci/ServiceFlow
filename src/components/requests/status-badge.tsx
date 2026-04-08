import { Badge } from "@/components/ui/badge";
import { cn, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/utils";
import type { Status, Priority } from "@/lib/db/schema";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border", STATUS_COLORS[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border", PRIORITY_COLORS[priority])}
    >
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
