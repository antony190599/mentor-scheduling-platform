import { Session, WeeklySessionData } from "../types/session";
import { addDays, addHours, subDays, subWeeks } from "date-fns";

// Generate mock sessions
export const mockSessions: Session[] = [
  {
    id: "1",
    mentor: {
      id: "m1",
      name: "Dr. Jane Smith",
      email: "jane.smith@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addHours(addDays(new Date(), 2), 1).toISOString(),
    status: "BOOKED",
    creditCost: 1,
  },
  {
    id: "2",
    mentor: {
      id: "m2",
      name: "Prof. Michael Chen",
      email: "michael.chen@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: addDays(new Date(), 4).toISOString(),
    endTime: addHours(addDays(new Date(), 4), 1).toISOString(),
    status: "BOOKED",
    creditCost: 2,
  },
  {
    id: "3",
    mentor: {
      id: "m3",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: subDays(new Date(), 3).toISOString(),
    endTime: addHours(subDays(new Date(), 3), 1).toISOString(),
    status: "COMPLETED",
    creditCost: 1,
  },
  {
    id: "4",
    mentor: {
      id: "m1",
      name: "Dr. Jane Smith",
      email: "jane.smith@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: subDays(new Date(), 7).toISOString(),
    endTime: addHours(subDays(new Date(), 7), 1).toISOString(),
    status: "COMPLETED",
    creditCost: 1,
  },
  {
    id: "5",
    mentor: {
      id: "m4",
      name: "David Thompson",
      email: "david.thompson@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: subDays(new Date(), 10).toISOString(),
    endTime: addHours(subDays(new Date(), 10), 1).toISOString(),
    status: "CANCELLED",
    creditCost: 1,
  },
  {
    id: "6",
    mentor: {
      id: "m2",
      name: "Prof. Michael Chen",
      email: "michael.chen@example.com",
    },
    entrepreneur: {
      id: "e1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    },
    startTime: addDays(new Date(), 7).toISOString(),
    endTime: addHours(addDays(new Date(), 7), 1).toISOString(),
    status: "BOOKED",
    creditCost: 2,
  },
];

// Generate weekly session data for the chart
export const mockWeeklySessions: WeeklySessionData[] = [
  {
    weekOf: subWeeks(new Date(), 4).toISOString().split('T')[0],
    sessions: 2,
  },
  {
    weekOf: subWeeks(new Date(), 3).toISOString().split('T')[0],
    sessions: 4,
  },
  {
    weekOf: subWeeks(new Date(), 2).toISOString().split('T')[0],
    sessions: 3,
  },
  {
    weekOf: subWeeks(new Date(), 1).toISOString().split('T')[0],
    sessions: 5,
  },
  {
    weekOf: new Date().toISOString().split('T')[0],
    sessions: 7,
  },
];
