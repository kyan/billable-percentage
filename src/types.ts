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

// export type Department = {
//   id: number;
//   name: string;
//   users: User[];
// };

// export type Role = {
//   id: number;
//   name: string;
//   users: User[];
// };

export type Holiday = {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
};

// export type Holidays = {
//   [key: string]: {
//     division: string;
//     events: Holiday[];
//   };
// };
