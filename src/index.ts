import { getUsers } from './userUtils';
import { getBillability } from './teamReport';
import { User } from './types';

getUsers().then((departmentsMap: { [key: string]: User[] }) => {
  const dateArg = process.argv[2];
  const date = dateArg ? new Date(dateArg) : new Date();

  getBillability(departmentsMap, date).catch((error: string) => {
    console.error(`Error: ${error}`);
  });
}).catch((error: string) => {
  console.error(`Error: ${error}`);
});
