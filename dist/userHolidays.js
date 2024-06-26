"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentHolidays = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TIMETASTIC_API_TOKEN = process.env.TIMETASTIC_API_TOKEN;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getDepartmentHolidays = async (currentDate) => {
    const departmentHolidays = {};
    const departmentMappings = {
        Engineering: 62525,
        Design: 62524,
        PM: 147318,
        "Client Partner": 150113,
        Strategy: 129121,
        QA: 190345,
        UX: 190344,
    };
    const { start, end } = calculateStartAndEndDates(currentDate);
    const currentMonth = currentDate.getMonth();
    for (const [department, value] of Object.entries(departmentMappings)) {
        let departmentHolidayDays = 0;
        const response = await axios_1.default.get(`https://app.timetastic.co.uk/api/holidays?departmentId=${value}&start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${TIMETASTIC_API_TOKEN}`,
            },
        });
        const holidays = response.data.holidays;
        for (const holiday of holidays) {
            // Extracting start and end dates
            const startDate = new Date(holiday.startDate);
            const endDate = new Date(holiday.endDate);
            await delay(400);
            const workingDays = await getWorkingDaysForUser(holiday.userId);
            // Checking if the leave is in current month and not of the types "Working in Office" or "Maternity"
            if ((startDate.getMonth() === currentMonth ||
                endDate.getMonth() === currentMonth) &&
                holiday.leaveType !== "Working in Office" &&
                holiday.leaveType !== "Maternity") {
                // Extracting the duration
                let duration = holiday.duration;
                // Iterating through the date range and adjusting the duration for work days and dates outside July
                const currentDate = startDate;
                while (currentDate <= endDate) {
                    if (currentDate.getMonth() !== currentMonth ||
                        !workingDays.includes(currentDate.getDay())) {
                        duration -= 1;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                departmentHolidayDays += duration;
            }
        }
        departmentHolidays[department] = departmentHolidayDays;
        await delay(400);
    }
    // console.log(departmentHolidays);
    return departmentHolidays;
};
exports.getDepartmentHolidays = getDepartmentHolidays;
const getWorkingDaysForUser = async (userId) => {
    const response = await axios_1.default.get(`https://app.timetastic.co.uk/api/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${TIMETASTIC_API_TOKEN}`,
        },
    });
    const workingDaysData = response.data.workingDays;
    const daysMapping = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
    };
    return workingDaysData
        .filter((day) => day.workingAm || day.workingPm)
        .map((day) => daysMapping[day.dayOfWeek]);
};
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const calculateStartAndEndDates = (currentDate) => {
    // Getting the first day of the current month
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // Getting the first day of the next month
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    // Setting the end date to the previous day, which is the last day of the current month
    end.setDate(end.getDate() - 1);
    return { start: formatDate(start), end: formatDate(end) };
};
