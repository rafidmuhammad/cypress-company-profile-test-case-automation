function isWithinProposalRange(object) {
    const currentTime = new Date(); // Get current time in local timezone
    const now_utc = Date.UTC(currentTime.getUTCFullYear(), currentTime.getUTCMonth(),
        currentTime.getUTCDate(), currentTime.getUTCHours(),
        currentTime.getUTCMinutes(), currentTime.getUTCSeconds());
    const currentTimeUTC = new Date(now_utc); // Convert current time to UTC

    const openProposalTimeUTC = new Date(object.data.attributes.openProposal);
    const closeProposalTimeUTC = new Date(object.data.attributes.closeProposal);
    // Check if current time is within the proposal range
    return currentTimeUTC >= openProposalTimeUTC && currentTimeUTC <= closeProposalTimeUTC;
}

function isWithinRegistrationRange(object) {
    const currentTime = new Date(); // Get current time
    const now_utc = Date.UTC(currentTime.getUTCFullYear(), currentTime.getUTCMonth(),
        currentTime.getUTCDate(), currentTime.getUTCHours(),
        currentTime.getUTCMinutes(), currentTime.getUTCSeconds());
    const currentTimeUTC = new Date(now_utc); // Convert current time to UTC

    const openRegistrationTimeUTC = new Date(object.data.attributes.openRegistration);
    const closeRegistrationTimeUTC = new Date(object.data.attributes.closeRegistration);

    // Check if current time is within the registration range
    return currentTimeUTC >= openRegistrationTimeUTC && currentTimeUTC <= closeRegistrationTimeUTC;
}

module.exports = { isWithinProposalRange, isWithinRegistrationRange }