import { getUsers } from './userUtils';
import { calculateBillability } from './billabilityUtils';

getUsers().then(departmentsMap => {
  const month = new Date().getMonth() + 1; // get current month
  const year = new Date().getFullYear(); // get current year
  calculateBillability(departmentsMap, month, year);
  // calculateBillability(departmentsMap, 6, 2023);
}).catch((error: string) => {
  console.error(`Error: ${error}`);
});
