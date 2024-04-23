"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HARVEST_ACCESS_TOKEN = process.env.HARVEST_ACCESS_TOKEN;
const HARVEST_ACCOUNT_ID = process.env.HARVEST_ACCOUNT_ID;
const getUsers = async () => {
    const response = await axios_1.default.get('https://api.harvestapp.com/v2/users', {
        headers: {
            'Authorization': `Bearer ${HARVEST_ACCESS_TOKEN}`,
            'Harvest-Account-ID': HARVEST_ACCOUNT_ID,
            'User-Agent': 'Harvest API Example',
        },
    });
    const users = response.data.users;
    const departmentsMap = {};
    const validRoles = ['Engineering', 'Design', 'PM', 'Client Partner', 'Strategy', 'QA', 'UX'];
    users.forEach((user) => {
        if (user.is_active) {
            user.roles.forEach((role) => {
                if (validRoles.includes(role)) {
                    if (!departmentsMap[role]) {
                        departmentsMap[role] = [];
                    }
                    // Add the user to the department if they're not already in it
                    if (!departmentsMap[role].some((u) => u.id === user.id)) {
                        departmentsMap[role].push(user);
                    }
                }
            });
        }
    });
    return departmentsMap;
};
exports.getUsers = getUsers;
