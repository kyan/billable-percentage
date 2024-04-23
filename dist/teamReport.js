"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillability = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const dateUtils_1 = require("./dateUtils");
const firestore_1 = require("./firestore");
const userHolidays_1 = require("./userHolidays");
dotenv_1.default.config();
const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;
const getBillability = async (departments, currentDate = new Date(), includeHolidays = true) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    // Format the date strings
    const fromDate = `${year}-${month < 10 ? '0' + month : month}-01`;
    const toDate = `${year}-${month < 10 ? '0' + month : month}-${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}`;
    const workingDaysInMonth = await (0, dateUtils_1.getWorkingDaysInMonth)(new Date(fromDate));
    const departmentHolidays = await (0, userHolidays_1.getDepartmentHolidays)(currentDate);
    const response = await axios_1.default.get(`https://api.harvestapp.com/v2/reports/time/team?from=${fromDate}&to=${toDate}`, {
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
            const userReport = reports.find((report) => report.user_id === user.id);
            if (userReport) {
                totalBillableHours += userReport.billable_hours;
            }
        }
        if (includeHolidays) {
            totalPossibleBillableHours -= departmentHolidays[department] * 8;
        }
        const billability = Math.round((totalBillableHours / totalPossibleBillableHours) * 100);
        const departmentData = {
            department: department,
            billability: billability,
            totalBillableHours: totalBillableHours,
            totalPossibleBillableHours: totalPossibleBillableHours
        };
        console.log(`${departmentData['department']}: ${departmentData['billability']}%`);
        if (includeHolidays) {
            await (0, firestore_1.saveDepartmentData)('billablePercentage', department, currentDate, workingDaysInMonth, departmentData);
        }
        else {
            await (0, firestore_1.saveDepartmentData)('billablePercentageExcludingHolidays', department, currentDate, workingDaysInMonth, departmentData);
        }
    }
};
exports.getBillability = getBillability;
