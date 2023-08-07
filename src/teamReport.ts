import axios from 'axios';
import dotenv from 'dotenv';
import { DepartmentMap, Report } from './types';
import { getWorkingDaysInMonth } from './dateUtils';
import { saveDepartmentData } from './firestore';
import { getDepartmentHolidays } from './userHolidays';

dotenv.config();

const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;

export const getBillability = async (departments: DepartmentMap, currentDate: Date = new Date()) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Format the date strings
  const fromDate = `${year}-${month < 10 ? '0' + month : month}-01`;
  const toDate = `${year}-${month < 10 ? '0' + month : month}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;

  const workingDaysInMonth = await getWorkingDaysInMonth(new Date(fromDate));
  const departmentHolidays = await getDepartmentHolidays(currentDate);

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
    totalPossibleBillableHours -= departmentHolidays[department] * 8;
    const billability = Math.round((totalBillableHours / totalPossibleBillableHours) * 100);

    const departmentData = {
      department: department,
      billability: billability,
      totalBillableHours: totalBillableHours,
      totalPossibleBillableHours: totalPossibleBillableHours
    };

    // console.log(`${departmentData['department']}: ${departmentData['billability']}%`);

    await saveDepartmentData(department, currentDate, workingDaysInMonth, departmentData);
  }
};
