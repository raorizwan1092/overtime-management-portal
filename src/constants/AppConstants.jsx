import { FiUsers } from 'react-icons/fi'
export const USER_ROLES = {
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  HR: "HR",
};
export const navLinks = [
  {
    id: 1,
    name: "Users",
    icon: <FiUsers size={20} />,
    path: "/users",
    roles: [USER_ROLES.HR, USER_ROLES.MANAGER],
  },
  {
    id: 1,
    name: "Log Time",
    icon: <FiUsers size={20} />,
    path: "/time-log",
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER],
  },
];


export const ROLE_OPTIONS = [
  { label: "Manager", value: USER_ROLES.MANAGER },
  { label: "Employee", value: USER_ROLES.EMPLOYEE },
  { label: "HR", value: USER_ROLES.HR },
];
export const NAVIGATION_URLS = {
  BASE_URL: "/",
  AUTH_URLS: {
    SIGNIN: "/signin"
  },
  USERS: "/users",
  TIME_LOG: "/time-log",
};