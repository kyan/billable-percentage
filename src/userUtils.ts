import axios from 'axios';
import dotenv from 'dotenv';
import { User } from './types';

dotenv.config();

const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;

export const getUsers = async () => {
  const response = await axios.get('https://api.harvestapp.com/v2/users', {
    headers: {
      'Authorization': `Bearer ${HARVEST_ACCESS_TOKEN}`,
      'Harvest-Account-ID': HARVEST_ACCOUNT_ID,
      'User-Agent': 'Harvest API Example',
    },
  });

  const users = response.data.users;
  const departmentsMap: { [key: string]: User[] } = {};
  const validRoles = ['Engineering', 'Design', 'PM', 'Client Partner', 'Strategy', 'QA', 'UX'];

  users.forEach((user: User) => {
    if (user.is_active) {
      user.roles.forEach((role: string) => {
        if (validRoles.includes(role)) {
          if (!departmentsMap[role]) {
            departmentsMap[role] = [];
          }
          // Add the user to the department if they're not already in it
          if (!departmentsMap[role].some((u: User) => u.id === user.id)) {
            departmentsMap[role].push(user);
          }
        }
      });
    }
  });

  return departmentsMap;
};
