import axios from 'axios';
import dotenv from 'dotenv';
import { WorkingDay, DepartmentHolidays } from './types';

dotenv.config();

const TIMETASTIC_API_TOKEN = process.env.TIMETASTIC_API_TOKEN;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDepartmentHolidays = async (currentDate: Date) => {
  const departmentHolidays: DepartmentHolidays = {};
  const departmentMappings = {
    'Engineering': 62525,
    'Design': 62524,
    'PM': 147318,
    'Client Partner': 150113,
    'Strategy': 129121,
    'QA': 190345,
    'UX': 190344,
  }

  const { start, end } = calculateStartAndEndDates(currentDate);
  const currentMonth = currentDate.getMonth();


  for (const [department, value] of Object.entries(departmentMappings)) {
    let departmentHolidayDays = 0;

    const response = await axios.get(
      `https://app.timetastic.co.uk/api/holidays?departmentId=${value}&start=${start}&end=${end}`,
      {
        headers: {
          Authorization: `Bearer ${TIMETASTIC_API_TOKEN}`,
        },
      },
    );
    const holidays = response.data.holidays;

    for (const holiday of holidays) {
      // Skip holidays with leaveType "Working in Office" or "Maternity"
      if (holiday.leaveType === "Working in Office" || holiday.leaveType === "Maternity") continue;

      await delay(200)

      const workingDays = await getWorkingDaysForUser(holiday.userId);

      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);

      // If the start date is before the current month, set it to the first day of the current month
      if (startDate.getMonth() < currentMonth) {
        startDate.setDate(1);
        startDate.setMonth(currentMonth);
      }

      // If the end date is after the current month, set it to the last day of the current month
      if (endDate.getMonth() > currentMonth) {
        endDate.setMonth(currentMonth + 1, 0);
      }

      // Calculate the duration excluding weekends and only considering the current month
      let duration = 0;
      for (const d = new Date(startDate); d <= endDate && d.getMonth() === currentMonth; d.setDate(d.getDate() + 1)) {
          // Include only working days and skip weekends
          if (workingDays.includes(d.getDay()) && d.getDay() !== 0 && d.getDay() !== 6) {
            duration += 1;
          }
      }

      // If the holiday is a part day (morning or afternoon), adjust the duration
      if (holiday.duration && holiday.duration < 1) {
        duration *= holiday.duration; // Assumes duration is a fractional value representing the part of the day
      }

      departmentHolidayDays += duration;
    }

    departmentHolidays[department] = departmentHolidayDays;
    await delay(200);
  }
  // console.log(departmentHolidays);
  return departmentHolidays;
};

const getWorkingDaysForUser = async (userId: number) => {
  const response = await axios.get(`https://app.timetastic.co.uk/api/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${TIMETASTIC_API_TOKEN}`,
      },
    },
  );

  const workingDaysData: WorkingDay[] = response.data.workingDays;


  const daysMapping: { [key: string]: number } = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 0,
  };

  return workingDaysData
    .filter(day => day.workingAm || day.workingPm)
    .map(day => daysMapping[day.dayOfWeek]);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStartAndEndDates = (currentDate: Date) => {
  // Getting the first day of the current month
  const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Getting the first day of the next month
  const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  // Setting the end date to the previous day, which is the last day of the current month
  end.setDate(end.getDate() - 1);

  return { start: formatDate(start), end: formatDate(end) };
};
