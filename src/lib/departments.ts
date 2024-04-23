import { fetchUsers } from "./harvest";
import { fetchPeople } from "./forecast";
import { fetchTimetasticUsers } from "./timetastic";
import { Department, ForecastUser, TimetasticUser, User } from "../types";

const roles = ["Engineering", "Design", "Delivery", "QA"];

export const populateDepartments = async () => {
  const harvestUsers = await fetchUsers();
  const forecastUsers = await fetchPeople();
  const timetasticUsers = await fetchTimetasticUsers();
  const departments: Department = {};

  roles.forEach((role) => {
    departments[role] = [];
  });

  for (const user of harvestUsers) {
    for (const role of user.roles) {
      if (roles.includes(role)) {
        const forecastUser = forecastUsers.find(
          (fu: ForecastUser) => fu.email === user.email,
        );
        const timetasticUser = timetasticUsers.find(
          (tu: TimetasticUser) => tu.email === user.email,
        );

        if (forecastUser && departments[role]) {
          const newUser: User = {
            harvest_id: user.id,
            timetastic_id: timetasticUser.id,
            email: user.email,
            working_days: forecastUser.working_days,
          };
          departments[role].push(newUser);
        }
      }
    }
  }

  return departments;
};
