const { TIMELOG_STATUS } = require("@/constants/AppConstants");

export const getStatusClass = (status) => {
    switch (status) {
        case TIMELOG_STATUS.APPROVED:
            return "text-success";
        case TIMELOG_STATUS.REJECTED:
            return "text-danger";
        default:
            return "text-warning";
    }
};