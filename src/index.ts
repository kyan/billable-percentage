import { populateDepartments } from "./lib/departments";
import { workingDatesInMonth } from "./dateUtils";
import { holidaysForUser } from "./lib/timetastic";
import { fetchTimeReports } from "./lib/harvest";
import { Department, WorkingDate } from "./types";
import moment from "moment";

const month = process.argv[2];
const year = process.argv[3];

if (!month || !year) {
  console.error("Please provide a month and year as arguments.");
  process.exit(1);
}

calcBillability(month, year);

async function calcBillability(month: string, year: string) {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Calculate start and end dates
  const fromDate = moment(`${year}-${month}-01`, "YYYY-MM-DD").format("YYYY-MM-DD");
  const toDate = moment(fromDate).endOf("month").format("YYYY-MM-DD");

  try {
    const working_dates: WorkingDate[] = await workingDatesInMonth(
      fromDate,
      toDate
    );

    const departments: Department = await populateDepartments();
    const timeReports = await fetchTimeReports(fromDate, toDate);

    console.log(`Calculating billability for ${month}/${year}:\n`);

    for (const department in departments) {
      console.log(`Department: ${department}`);
      console.log(`----------------`);

      const deptUserBillableHours = [];

      for (const user of departments[department]) {
        await delay(400); // pause for 400ms to avoid rate limiting

        const holidays = await holidaysForUser(user.timetastic_id, fromDate, toDate);
        const user_working_dates = working_dates.filter((date: WorkingDate) => {
          return user.working_days[date.day] === true;
        });
        const user_report = timeReports.filter((report: any) => {
          return report.user_id === user.harvest_id;
        });

        if (user_report.length > 0) {
          const actual_working_hours = (user_working_dates.length - holidays) * 8;
          const billable_hours = user_report[0].billable_hours;
          const billable_percentage = (billable_hours / actual_working_hours) * 100;

          deptUserBillableHours.push({ email: user.email, billable_percentage: billable_percentage });
          console.log(`  User: ${user.email}`);
          // console.log(`    Harvest user ID: ${user.harvest_id}`);
          // console.log(`    Timetastic user ID: ${user.timetastic_id}`);
          // console.log(`    Working days in month: ${working_dates.length}`);
          // console.log(`    Possible working days: ${user_working_dates.length}`);
          // console.log(`    Holidays: ${holidays}`);
          // console.log(`    Actual working days: ${user_working_dates.length - holidays}`);
          // console.log(`    Actual working hours: ${actual_working_hours}`);
          // console.log(`    Billable hours: ${billable_hours}`);
          console.log(`    Billable percentage: ${billable_percentage.toFixed(2)}%\n`);
        }
      }

      const deptBillableHours = (
        deptUserBillableHours.reduce(
          (acc, user) => acc + user.billable_percentage, 0
        ) / deptUserBillableHours.length
      ).toFixed(0);
      console.log(`  Billability: ${deptBillableHours}%\n`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
