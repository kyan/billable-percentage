"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;
const fetchUsers = async () => {
    const response = await axios_1.default.get("https://api.harvestapp.com/v2/users?is_active=true", {
        headers: {
            Authorization: `Bearer ${HARVEST_ACCESS_TOKEN}`,
            "Harvest-Account-ID": HARVEST_ACCOUNT_ID,
            "User-Agent": "Harvest API Example",
        },
    });
    // Filter out users in the operations role
    const users = response.data.users.filter((user) => {
        !user.roles.includes("Operations");
    });
    // Extract user data
    users.map((user) => {
        return {
            email: user.email,
            id: user.id,
            roles: user.roles,
        };
    });
};
exports.fetchUsers = fetchUsers;
