export function timeDifference(startTime, endTime) {
    let difference = (endTime - startTime) / 1000;

    return {
        seconds: Math.floor(difference % 60),
        minutes: Math.floor(difference / 60 % 60),
        hours: Math.floor(difference / (60 * 60) % 24),
        days: Math.floor(difference / (24 * 60 * 60))
    };
}