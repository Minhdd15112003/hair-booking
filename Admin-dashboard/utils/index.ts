export function convertVietnamTimeToUTC(vnDate: string) {
    const date = new Date(vnDate);

    // Trừ đi 7 giờ (7 * 60 * 60 * 1000 milliseconds)
    return new Date(date.getTime() - 7 * 60 * 60 * 1000).toISOString();
}

export function dateToUTCString(date: string) {
    return convertVietnamTimeToUTC(new Date(date).toISOString().toString());
}

export function convertUTCTimeToVietNam(vnDate: string) {
    const date = new Date(vnDate);

    // Trừ đi 7 giờ (7 * 60 * 60 * 1000 milliseconds)
    return new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString();
}

export const convertToDisplayTime = (time: string) => {
    const hours = time.split('T')[1].split(':')[0];
    const minutes = time.split('T')[1].split(':')[1];
    const day = time.split('T')[0].split('-')[2];
    const month = time.split('T')[0].split('-')[1];
    const year = time.split('T')[0].split('-')[0];
    return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
    export function Calculate(startTime: Date, durationInMinutes: number): Date {
        const endTime = new Date(startTime.getTime() + durationInMinutes * 60000); // 60000 ms = 1 minute
        return endTime;
    }