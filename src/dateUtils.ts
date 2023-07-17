import axios from 'axios';
import moment from 'moment';
import { Holiday } from './types';

export const getBankHolidays = async () => {
  const response = await axios.get('https://www.gov.uk/bank-holidays.json');
  const bankHolidays = response.data['england-and-wales'].events;
  return bankHolidays.map((holiday: Holiday) => holiday.date);
};

export const getWorkingDaysInMonth = async (date: Date) => {
  const startDate = moment(date).startOf('month');
  const endDate = moment(date).endOf('month');

  let currentDay = moment(startDate);
  let workingDays = 0;

  const bankHolidays = await getBankHolidays();

  while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
    if (currentDay.isoWeekday() < 6 && !bankHolidays.includes(currentDay.format('YYYY-MM-DD'))) { // isoWeekday() returns 6 for Saturday and 7 for Sunday
      workingDays++;
    }
    currentDay = currentDay.add(1, 'days');
  }

  return workingDays;
};
