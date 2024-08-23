export function dateDiffYears(date1, date2) {
    // Extract year, month, and day from both dates
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Calculate the difference in years
    let yearsDifference = year2 - year1;

    // Adjust for months and days
    if (month2 < month1 || (month2 === month1 && day2 < day1)) {
        yearsDifference--;
    }

    return yearsDifference;
}

export function dateDiffDays(date1, date2) {
    // Calculate the time difference in milliseconds
    let differenceInTime = date2.getTime() - date1.getTime();

    // Convert the time difference to days
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
}

export function parseCustomDateString(dateStr) {
    const regexymd = /(\d{4})-(\d{2})-(\d{2})/gm;
    let [matches] = [...dateStr.matchAll(regexymd)];
    if (matches?.length === 4) {
        const year = parseInt(matches[1]);
        const month = parseInt(matches[2]) - 1;
        const day = parseInt(matches[3]);

        // Create a new Date object
        return new Date(year, month, day);
    }

    const regexmdy = /(\d{2})\/(\d{2})\/(\d{2})/gm;
    [matches] = [...dateStr.matchAll(regexmdy)];
    if (matches?.length === 4) {
        const year = 2000 + parseInt(matches[3]);
        const month = parseInt(matches[1]) - 1;
        const day = parseInt(matches[2]);

        // Create a new Date object
        return new Date(year, month, day);
    }

    return null;
}

export function getTodaysDate() {
    const today = new Date(); // Gets the current date and time

    const year = today.getFullYear(); // Extracts the year
    const month = today.getMonth(); // Extracts the month (note: months are 0-indexed)
    const day = today.getDate(); // Extracts the day

    return new Date(year, month, day);
}
