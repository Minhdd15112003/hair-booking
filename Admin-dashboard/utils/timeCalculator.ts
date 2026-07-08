export function Calculate(startTime: Date, minutes: number): Date {
    const endTime = new Date(startTime.toISOString());

    endTime.setMinutes(startTime.getMinutes() + minutes);
    return endTime;
}

export function localDate(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }
    const localHours = date.getUTCHours() + 7;
    if (localHours === date.getHours()) {
        return date;
    }
    return new Date(date.getTime() + 7 * 60 * 60 * 1000);
}

export function utcDate(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }

    const utcHours = date.getUTCHours();
    if (utcHours === date.getHours()) {
        return date;
    }

    return new Date(date.getTime() - 7 * 60 * 60 * 1000);
}
