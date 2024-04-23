"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkingDaysInMonth = exports.getBankHolidays = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const getBankHolidays = async () => {
    const response = await axios_1.default.get('https://www.gov.uk/bank-holidays.json');
    const bankHolidays = response.data['england-and-wales'].events;
    return bankHolidays.map((holiday) => holiday.date);
};
exports.getBankHolidays = getBankHolidays;
const getWorkingDaysInMonth = async (date) => {
    const startDate = (0, moment_1.default)(date).startOf('month');
    const endDate = (0, moment_1.default)(date).endOf('month');
    let currentDay = (0, moment_1.default)(startDate);
    let workingDays = 0;
    const bankHolidays = await (0, exports.getBankHolidays)();
    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
        if (currentDay.isoWeekday() < 6 && !bankHolidays.includes(currentDay.format('YYYY-MM-DD'))) { // isoWeekday() returns 6 for Saturday and 7 for Sunday
            workingDays++;
        }
        currentDay = currentDay.add(1, 'days');
    }
    return workingDays;
};
exports.getWorkingDaysInMonth = getWorkingDaysInMonth;
