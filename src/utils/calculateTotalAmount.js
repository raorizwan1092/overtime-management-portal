export const calculateTotalAmount = (hours, hourlyRate, rule) => {
    if (!hours || !hourlyRate) return 0;
    if (!rule) return hours * hourlyRate;

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

    return isNaN(total) ? 0 : total;
};