// billabilityUtils.ts
import axios from 'axios';
import dotenv from 'dotenv';
import { User } from './types';
import { getWorkingDaysInMonth } from './dateUtils';

dotenv.config();

const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;

export const calculateBillability = async (departmentsMap: { [key: string]: User[] }, month: number, year: number) => {
  const startDate = `${year}-${(month < 10 ? '0' : '') + month}-01`;
  const endDate = `${year}-${(month < 10 ? '0' : '') + month}-${new Date(year, month, 0).getDate()}`;

  for (const department in departmentsMap) {
    for (const user of departmentsMap[department]) {
      const response = await axios.get(`https://api.harvestapp.com/v2/time_entries`, {
        params: {
          user_id: user.id,
          from: startDate,
          to: endDate,
        },
        headers: {
          'Authorization': `Bearer ${HARVEST_ACCESS_TOKEN}`,
          'Harvest-Account-ID': HARVEST_ACCOUNT_ID,
          'User-Agent': 'Harvest API Example',
        },
      });

      let totalBillableHours = 0;
      for (const entry of response.data.time_entries) {
        if (entry.billable) {
          totalBillableHours += entry.hours;
        }
      }

      user.billableHours = totalBillableHours;
    }
  }

  const workingHoursPerDay = 8;
  const workingDaysInMonth = await getWorkingDaysInMonth(year, month);
  const totalPossibleHours = workingHoursPerDay * workingDaysInMonth;

  for (const department in departmentsMap) {
    let totalBillableHours = 0;
    for (const user of departmentsMap[department]) {
      totalBillableHours += user.billableHours || 0;
    }

    const maximumBillableHours = totalPossibleHours * departmentsMap[department].length;
    const billabilityPercentage = (totalBillableHours / maximumBillableHours) * 100;

    console.log(`Department: ${department}`);
    console.log(`Billability: ${billabilityPercentage.toFixed(2)}%`);
  }
};
