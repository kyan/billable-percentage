import axios from 'axios';
import moment from 'moment';
import { Holiday } from './types';

export const getBankHolidays = async () => {
  const response = await axios.get('https://www.gov.uk/bank-holidays.json');
  const bankHolidays = response.data['england-and-wales'].events;
  return bankHolidays.map((holiday: Holiday) => holiday.date);
};

export const getWorkingDaysInMonth = async (year: number, month: number) => {
  const startDate = moment([year, month]);
  const endDate = moment(startDate).endOf('month');

  let date = moment(startDate);
  let workingDays = 0;

  const bankHolidays = await getBankHolidays();

  while (date.isBefore(endDate) || date.isSame(endDate)) {
    if (date.isoWeekday() < 6 && !bankHolidays.includes(date.format('YYYY-MM-DD'))) { // isoWeekday() returns 6 for Saturday and 7 for Sunday
      workingDays++;
    }
    date = date.add(1, 'days');
  }

  return workingDays;
};
