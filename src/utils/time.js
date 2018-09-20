export function timeDifference(startTime, endTime){
    let result = {};

    let difference = (endTime - startTime) / 1000;
    result.seconds = Math.floor(difference % 60);
    result.minutes = Math.floor(difference / 60 % 60);
    result.hours = Math.floor(difference / (60 * 60) % 24);
    result.days = Math.floor(difference / (24 * 60 * 60));

    return result;
}