import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../core/components";
import { Bell, Users, Calendar, FileText } from "lucide-react";
import {
  mockEmployees,
  mockAppointments,
  mockDashboardStats,
} from "../../../core/mocks/data";

const HomePage: React.FC = () => {
  const displayEmployees = mockEmployees.slice(0, 3);
  const displayAppointments = mockAppointments.slice(0, 6);

  return (
      <div className="">
        <div className="container mx-auto px-5 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Employees
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {mockDashboardStats.totalEmployees}
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-[10px]">
                    <Users className="size-6 text-ring" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Appointments</p>
                    <p className="text-3xl font-bold text-primary">
                      {mockDashboardStats.totalAppointments}
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-[10px]">
                    <Calendar className="size-6 text-ring" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Active Patients
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {mockDashboardStats.activePatients}
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-[10px]">
                    <FileText className="size-6 text-ring" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pending Tasks
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {mockDashboardStats.pendingTasks}
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-[10px]">
                    <Bell className="size-6 text-ring" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Employees Table */}
            <div className="col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Active Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>EMPLOYEE</TableHead>
                        <TableHead>FUNCTION</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>EMPLOYED</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayEmployees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-accent flex items-center justify-center text-ring font-medium">
                                {emp.firstname[0]}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {emp.firstname} {emp.lastname}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {emp.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">
                                {emp.speciality}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {emp.department}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge status={emp.status}>
                              {emp.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{emp.start_date}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Badge status="available">
                      {mockDashboardStats.totalAppointments}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-3 p-3 bg-accent rounded-[10px]"
                      >
                        <Users className="size-5 text-ring" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {apt.patientId} - {apt.doctorId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-gradient-to-br from-primary to-ring text-primary-foreground border-none">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-primary-foreground/10 rounded-full">
                      <Bell className="size-8" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm">
                        {mockDashboardStats.vacationRequests} vacation requests
                        pending approval
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm">
                        {mockDashboardStats.employeesOnVacationToday} employees
                        start vacation tomorrow
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm">
                        {mockDashboardStats.returningNextWeek} employee
                        returning next week
                      </p>
                    </div>
                  </div>
                  <Button variant="light" className="w-full mt-6">
                    SEE MORE
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HomePage;