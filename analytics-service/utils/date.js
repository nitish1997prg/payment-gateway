// utils/date.js

export function getCurrentAnalyticsDate() {
    return new Date().toISOString().split("T")[0];
}