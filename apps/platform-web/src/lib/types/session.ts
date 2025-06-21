export type SessionStatus = "BOOKED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Session {
  id: string;
  mentor: User;
  entrepreneur: User;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  creditCost: number;
}

export interface SessionsMetrics {
  totalSessions: number;
  trend: number;
  uniqueMentors: number;
  totalCompleted: number;
  completionRate: number;
}

export interface WeeklySessionData {
  weekOf: string;
  sessions: number;
}
