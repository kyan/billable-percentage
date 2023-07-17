import { getUsers } from './userUtils';
import { getBillability } from './teamReport';
import { User } from './types';

getUsers().then((departmentsMap: { [key: string]: User[] }) => {
  const firstDayOfMonth = new Date(2023, 5, 1);
  getBillability(departmentsMap, firstDayOfMonth).catch((error: string) => {
    console.error(`Error: ${error}`);
  });
}).catch((error: string) => {
  console.error(`Error: ${error}`);
});
