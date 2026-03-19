export const calculateTotalAmount = (
    hours,
    hourlyRate,
    rule,
    date,
    isPublicHoliday = false
) => {
    if (!hours || !hourlyRate) return 0;
    if (!rule) return hours * hourlyRate;

    const logDate = new Date(date);
    const day = logDate.getDay();
    const isWeekend = day === 0 || day === 6;

    const baseHours = Math.min(hours, rule.maxHours);

    let total = baseHours * hourlyRate;

    if (hours > rule.maxHours) {
        const extra8to10 = Math.min(hours - rule.maxHours, 2);
        total += extra8to10 * hourlyRate * rule.rate8to10;
    }

    if (hours > rule.maxHours + 2) {
        const extra10to12 = Math.min(hours - (rule.maxHours + 2), 2);
        total += extra10to12 * hourlyRate * rule.rate10to12;
    }

    if (hours > rule.maxHours + 4) {
        total += (hours - (rule.maxHours + 4)) * hourlyRate;
    }

    // ✅ Apply double ONLY ONCE
    if (isWeekend || isPublicHoliday) {
        total = total * 2;
    }

    return isNaN(total) ? 0 : total;
};
