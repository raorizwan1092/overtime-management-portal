import {
  FiUsers,
  FiClock,
  FiSettings,
  FiFileText
} from "react-icons/fi";

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
    roles: [USER_ROLES.HR],
  },
  {
    id: 2,
    name: "Rules",
    icon: <FiFileText size={20} />,
    path: "/rules",
    roles: [USER_ROLES.HR],
  },
  {
    id: 3,
    name: "Log Time",
    icon: <FiClock size={20} />,
    path: "/time-log",
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER],
  },
  {
    id: 4,
    name: "Settings",
    icon: <FiSettings size={20} />,
    path: "/settings",
    roles: [
      USER_ROLES.HR,
      USER_ROLES.EMPLOYEE,
      USER_ROLES.MANAGER,
    ],
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

export const TIMELOG_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};