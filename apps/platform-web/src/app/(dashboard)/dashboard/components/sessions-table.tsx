"use client";

import { format } from "date-fns";
import { Session } from "@/lib/types/session";
import { 
  Table, 
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption 
} from "@/ui/components/table";
import { Badge } from "@/ui/components/badge";

interface SessionsTableProps {
  sessions: Session[];
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  if (!sessions.length) {
    return <p className="text-center text-muted-foreground py-4">No sessions found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Mentor</TableHead>
          <TableHead>Entrepreneur</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Credits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>{format(new Date(session.startTime), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
            </TableCell>
            <TableCell>{session.mentor.name}</TableCell>
            <TableCell>{session.entrepreneur.name}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  session.status === "COMPLETED" 
                    ? "outline" 
                    : session.status === "CANCELLED" 
                      ? "secondary" 
                      : "default"
                }
              >
                {session.status}
              </Badge>
            </TableCell>
            <TableCell>{session.creditCost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {sessions.length > 0 && (
        <TableCaption>A list of your recent sessions.</TableCaption>
      )}
    </Table>
  );
}
