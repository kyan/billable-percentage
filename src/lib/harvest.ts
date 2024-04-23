import axios from "axios";
import dotenv from "dotenv";
import { HarvestUser } from "../types";

dotenv.config();

const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;
const HARVEST_BASE_URL = "https://api.harvestapp.com/v2";
const headers = {
  Authorization: `Bearer ${HARVEST_ACCESS_TOKEN}`,
  "Harvest-Account-ID": HARVEST_ACCOUNT_ID,
};

export const fetchUsers = async () => {
  const response = await axios.get(`${HARVEST_BASE_URL}/users?is_active=true`, {
    headers: headers,
  });

  // Filter out users when the role is empty
  return response.data.users.filter((user: HarvestUser) => {
    return user.roles.length > 0;
  });
};

export const fetchTimeReports = async (
  fromDate: string,
  toDate: string
) => {
  const response = await axios.get(
    `${HARVEST_BASE_URL}/reports/time/team?from=${fromDate}&to=${toDate}`,
    {
      headers: headers,
    },
  );
  return response.data.results;
}
