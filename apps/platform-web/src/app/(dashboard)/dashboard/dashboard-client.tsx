/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { DateRangePicker } from "@/ui/components/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/tabs";
import { useMockSessions } from "@/lib/hooks/use-mock-sessions";
import { useMockCredits } from "@/lib/hooks/use-mock-credits";
import { SessionsTable } from "./components/sessions-table";
import { MentorsDropdown } from "./components/mentors-dropdown";
import { InfoTooltip } from "@/ui/ui-components/tooltip";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import { CalendarDays, CreditCard, Users, Calendar } from "lucide-react";
import { SquareChart } from "@/ui/ui-components/icons/nucleo/square-chart";

export function DashboardClient() {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  
  const [selectedMentorId, setSelectedMentorId] = useState<string | undefined>(
    undefined
  );

  const { sessions, sessionsMetrics } = useMockSessions({
    dateRange,
    mentorId: selectedMentorId,
  });
  
  const { credits } = useMockCredits();

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <h1 className="text-2xl font-bold">Mentor-Entrepreneur Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <MentorsDropdown 
            selectedMentorId={selectedMentorId}
            onSelectMentor={setSelectedMentorId}
          />
          <DateRangePicker
            value={dateRange}
            onChange={(date) => setDateRange({ from: date?.from || new Date(), to: date?.to })}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsMetrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {sessionsMetrics.trend >= 0 ? '+' : ''}{sessionsMetrics.trend}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Credits Available
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits.available}</div>
            <p className="text-xs text-muted-foreground">
              {credits.used} credits used this quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Mentors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsMetrics.uniqueMentors}</div>
            <p className="text-xs text-muted-foreground">
              Across all sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <SquareChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsMetrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {sessionsMetrics.totalCompleted} completed sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="pt-4">
              <SessionsTable sessions={sessions.filter(s => new Date(s.startTime) > new Date())} />
            </TabsContent>
            <TabsContent value="past" className="pt-4">
              <SessionsTable sessions={sessions.filter(s => new Date(s.startTime) <= new Date())} />
            </TabsContent>
            <TabsContent value="all" className="pt-4">
              <SessionsTable sessions={sessions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
