function agendaTimeFormat(startTime, endTime, estimatedTime) {
    let startTimeParts = startTime.split(":");
    let endTimeParts = endTime.split(":");

    let formattedStartTime = startTimeParts[0] + ":" + startTimeParts[1];
    let formattedEndTime = endTimeParts[0] + ":" + endTimeParts[1];

    let time = formattedStartTime + " - " + formattedEndTime;
    let duration;
    if (estimatedTime === null) {
        duration = "()"
    }
    else {
        duration = "(" + estimatedTime + ")";
    }
    return { time, duration }
}

module.exports = { agendaTimeFormat }