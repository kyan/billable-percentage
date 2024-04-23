import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FORECAST_ACCOUNT_ID = process.env.FORECAST_ACCOUNT_ID;
const FORECAST_ACCESS_TOKEN = process.env.FORECAST_ACCESS_TOKEN;
const FORECAST_BASE_URL = "https://api.forecastapp.com";
const headers = {
  Authorization: `Bearer ${FORECAST_ACCESS_TOKEN}`,
  "Forecast-Account-ID": FORECAST_ACCOUNT_ID,
};

export const fetchPeople = async () => {
  const response = await axios.get(`${FORECAST_BASE_URL}/people`, {
    headers: headers,
  });
  return response.data.people;
};
