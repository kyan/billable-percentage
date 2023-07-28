import axios from 'axios';
import dotenv from 'dotenv';
import { DepartmentMap, User, Report } from './types';
import { getWorkingDaysInMonth } from './dateUtils';
import { saveDepartmentData } from './firestore';

dotenv.config();

const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;

export const getBillability = async (departments: DepartmentMap, firstDayOfMonth: Date) => {
  const year = firstDayOfMonth.getFullYear();
  const month = firstDayOfMonth.getMonth() + 1; // JavaScript months are 0-indexed

  // Format the date strings
  const fromDate = `${year}-${month < 10 ? '0' + month : month}-01`;

  // Get the last day of the month
  const lastDayOfMonth = new Date(year, month, 0);
  const toDate = `${year}-${month < 10 ? '0' + month : month}-${lastDayOfMonth.getDate()}`;

  const workingDaysInMonth = await getWorkingDaysInMonth(firstDayOfMonth);

  const response = await axios.get(`https://api.harvestapp.com/v2/reports/time/team?from=${fromDate}&to=${toDate}`, {
    headers: {
      'Authorization': `Bearer ${HARVEST_ACCESS_TOKEN}`,
      'Harvest-Account-ID': HARVEST_ACCOUNT_ID,
      'User-Agent': 'Harvest API Example',
    },
  });

  const reports = response.data.results;

  for (const department in departments) {
    let totalBillableHours = 0;
    let totalPossibleBillableHours = 0;

    for (const user of departments[department]) {
      const userWorkingHoursPerDay = user.weekly_capacity / 3600 / 5; // Convert from seconds to hours, then divide by 5 working days per week
      const userWorkingHoursInMonth = userWorkingHoursPerDay * workingDaysInMonth;

      totalPossibleBillableHours += userWorkingHoursInMonth;

      const userReport = reports.find((report: Report) => report.user_id === user.id);
      if (userReport) {
        totalBillableHours += userReport.billable_hours;
      }
    }
    const billability = Math.round((totalBillableHours / totalPossibleBillableHours) * 100);


    const departmentData = {
      billability: billability,
      totalBillableHours: totalBillableHours,
      totalPossibleBillableHours: totalPossibleBillableHours
    };

    await saveDepartmentData(department, departmentData);
  }
};
