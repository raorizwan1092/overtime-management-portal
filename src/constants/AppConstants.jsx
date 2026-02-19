import { FiUsers } from 'react-icons/fi'

export const navLinks = [
    { id: 1, name: 'Users', icon: <FiUsers size={20} />, path: '/users' },
]
export const USER_ROLES = {
    MANAGER: "MANAGER",
    EMPLOYEE: "EMPLOYEE",
    HR: "HR",
  };
  
  export const ROLE_OPTIONS = [
    { label: "Manager", value: USER_ROLES.MANAGER },
    { label: "Employee", value: USER_ROLES.EMPLOYEE },
    { label: "HR", value: USER_ROLES.HR },
  ];