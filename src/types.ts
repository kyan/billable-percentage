// types.ts

export type HarvestUser = {
  id: number;
  email: string;
  roles: string[];
};

export type ForecastUser = {
  email: string;
  roles: string[];
  working_days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
  };
};

export type TimetasticUser = {
  timetastic_id: number;
  email: string;
};

export type Department = {
  [department: string]: User[];
};

export type User = {
  harvest_id: number;
  timetastic_id: number;
  email: string;
  working_days: {
    [key: string]: boolean;
  };
};

export type WorkingDate = {
  date: string;
  day: string;
};

export type Holiday = {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
};
