"use strict";
// import { getUsers } from './userUtils';
// import { getBillability } from './teamReport';
// import { User } from './types';
//
// getUsers().then((departmentsMap: { [key: string]: User[] }) => {
//   const dateArg = process.argv[2];
//   let date;
//   if (dateArg) {
//     date = new Date(dateArg);
//   } else {
//     date = new Date();
//     date.setMonth(date.getMonth() - 1);
//     date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
//   }
//
//   getBillability(departmentsMap, date).catch((error: string) => {
//     console.error(`Error: ${error}`);
//   });
//   // getBillability(departmentsMap, date, false).catch((error: string) => {
//   //   console.error(`Error: ${error}`);
//   // });
// }).catch((error: string) => {
//   console.error(`Error: ${error}`);
// });
Object.defineProperty(exports, "__esModule", { value: true });
const harvest_1 = require("./lib/harvest");
console.log("Fetching users from Harvest...");
const users = (0, harvest_1.fetchUsers)();
for (const user in users) {
    console.log(user);
}
