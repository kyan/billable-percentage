// types.ts

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  timezone: string;
  has_access_to_all_future_projects: boolean;
  is_contractor: boolean;
  is_admin: boolean;
  is_project_manager: boolean;
  can_see_rates: boolean;
  can_create_projects: boolean;
  can_create_invoices: boolean;
  is_active: boolean;
  weekly_capacity: number;
  default_hourly_rate: number;
  cost_rate: number;
  roles: string[];
  avatar_url: string;
  billableHours?: number; // Add this line
};

export type DepartmentMap = {
  [department: string]: User[];
};

export type Holiday = {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
};

export type TimeEntry = {
  rounded_hours: number;
  billable: boolean;
};

export type Report = {
  user_id: number;
  billable_hours: number;
  total_hours: number;
  weekly_capacity: number;
}

export type DepartmentData = {
  department: string;
  billability: number;
  totalBillableHours: number;
  totalPossibleBillableHours: number;
}

export type DepartmentHolidays = {
  [department: string]: number;
};

export interface WorkingDay {
  dayOfWeek: string;
  workingAm: boolean;
  workingPm: boolean;
}

export interface TTHoliday {
  startDate: string;
  endDate: string;
  leaveType: string;
  duration: number;
  userId: number;
}
