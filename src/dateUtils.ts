import axios from 'axios';
import moment from 'moment';
import { Holiday } from './types';

export const getBankHolidays = async () => {
  const response = await axios.get('https://www.gov.uk/bank-holidays.json');
  const bankHolidays = response.data['england-and-wales'].events;
  return bankHolidays.map((holiday: Holiday) => holiday.date);
};

export const workingDatesInMonth = async (startDate: string, endDate: string) => {
  const bankHolidays = await getBankHolidays();

  let currentDay = moment(startDate);
  let workingDates = [];

  while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
    if (
      currentDay.isoWeekday() < 6 &&
      !bankHolidays.includes(currentDay.format('YYYY-MM-DD'))
    ) {
      workingDates.push({ date: currentDay.format('YYYY-MM-DD'), day: currentDay.format("dddd").toLowerCase() })
    }
    currentDay = currentDay.add(1, 'days');
  }

  return workingDates;
};
