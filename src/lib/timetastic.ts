import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import { Holiday } from "../types";
import { getBankHolidays } from "../dateUtils";

dotenv.config();

const TIMETASTIC_API_TOKEN = process.env.TIMETASTIC_API_TOKEN;
const TIMETASTIC_BASE_URL = "https://app.timetastic.co.uk/api";
const headers = { Authorization: `Bearer ${TIMETASTIC_API_TOKEN}` };

export const fetchTimetasticUsers = async () => {
  const response = await axios.get(`${TIMETASTIC_BASE_URL}/users`, {
    headers: headers,
  });

  return response.data;
};

export const holidaysForUser = async (
  userId: number,
  fromDate: string,
  toDate: string,
) => {
  const response = await axios.get(
    `${TIMETASTIC_BASE_URL}/holidays?UserIds=${userId}&start=${fromDate}&end=${toDate}`,
    { headers: headers },
  );

  const holidays = response.data.holidays.filter(
    (holiday: { leaveType: string }) =>
      holiday.leaveType !== "Working in Office" &&
      holiday.leaveType !== "Maternity",
  );

  const bankHolidays = await getBankHolidays();

  let total_duration = 0;

  for (const holiday of holidays) {
    const startDate = moment(holiday.startDate);
    const endDate = moment(holiday.endDate);
    let duration = 0;
    let currentDate = startDate;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      if (
        currentDate.isoWeekday() < 6 &&
        currentDate.month() === moment(fromDate).month() &&
        !bankHolidays.includes(currentDate.format("YYYY-MM-DD"))
      ) {
        if (holiday.duration >= 1) {
          duration += 1;
        } else {
          duration += 0.5;
        }
      }
      currentDate = currentDate.add(1, "days");
    }

    total_duration += duration;
  }

  return total_duration;
};
