/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import { mockSessions, mockWeeklySessions } from "../mock-data/sessions";
import { Session, SessionsMetrics } from "../types/session";
import { DateRange } from "react-day-picker";

interface UseMockSessionsOptions {
  dateRange?: DateRange;
  mentorId?: string;
}

export function useMockSessions(options: UseMockSessionsOptions = {}) {
  const { dateRange, mentorId } = options;
  
  // Filter sessions based on dateRange and mentorId
  const sessions = useMemo(() => {
    let filtered = [...mockSessions];
    
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(session => new Date(session.startTime) >= fromDate);
    }
    
    if (dateRange?.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(session => new Date(session.startTime) <= toDate);
    }
    
    if (mentorId) {
      filtered = filtered.filter(session => session.mentor.id === mentorId);
    }
    
    return filtered;
  }, [dateRange, mentorId]);
  
  // Calculate metrics
  const sessionsMetrics = useMemo<SessionsMetrics>(() => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === "COMPLETED").length;
    const uniqueMentorIds = new Set(sessions.map(s => s.mentor.id));
    
    return {
      totalSessions,
      trend: 15, // Mocked trend percentage
      uniqueMentors: uniqueMentorIds.size,
      totalCompleted: completedSessions,
      completionRate: totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0,
    };
  }, [sessions]);
  
  return { sessions, sessionsMetrics };
}

export function useMockSessionsWeekly() {
  const weeklyData = useMemo(() => {
    return mockWeeklySessions;
  }, []);
  
  return { weeklyData };
}
