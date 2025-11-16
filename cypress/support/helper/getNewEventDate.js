function getNewValidEventDate() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Clone the current date and then modify it
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() - 2);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() + 3);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() - 2);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() + 3);

    return {
        openRegistration: newOpenRegistrationDate.toISOString(),
        closeRegistration: newCloseRegistrationDate.toISOString(),
        openProposal: newOpenProposalDate.toISOString(),
        closeProposal: newCloseProposalDate.toISOString(),
    };
}

function getNewValidEventDateOnlyInRegistration() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Clone the current date and then modify it
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() - 2);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() + 3);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() + 4);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() + 5);

    return {
        openRegistration: newOpenRegistrationDate.toISOString(),
        closeRegistration: newCloseRegistrationDate.toISOString(),
        openProposal: newOpenProposalDate.toISOString(),
        closeProposal: newCloseProposalDate.toISOString(),
    };
}

function getNewValidEventDateOnlyInProposal() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Clone the current date and then modify it
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() - 4);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() - 2);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() - 2);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() + 2);

    return {
        openRegistration: newOpenRegistrationDate.toISOString(),
        closeRegistration: newCloseRegistrationDate.toISOString(),
        openProposal: newOpenProposalDate.toISOString(),
        closeProposal: newCloseProposalDate.toISOString(),
    };
}

function getNewInvalidEventDate() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the new dates by modifying the current date
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() - 3);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() - 2);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() + 2);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() + 3);

    // Convert dates to ISO string format
    const newOpenRegistration = newOpenRegistrationDate.toISOString();
    const newCloseRegistration = newCloseRegistrationDate.toISOString();
    const newOpenProposal = newOpenProposalDate.toISOString();
    const newCloseProposal = newCloseProposalDate.toISOString();

    // Return an object with the new dates
    return {
        openRegistration: newOpenRegistration,
        closeRegistration: newCloseRegistration,
        openProposal: newOpenProposal,
        closeProposal: newCloseProposal
    };
}

function getNewInvalidEventDateBeforeRegistration() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the new dates by modifying the current date
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() + 2);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() + 3);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() + 4);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() + 5);

    // Convert dates to ISO string format
    const newOpenRegistration = newOpenRegistrationDate.toISOString();
    const newCloseRegistration = newCloseRegistrationDate.toISOString();
    const newOpenProposal = newOpenProposalDate.toISOString();
    const newCloseProposal = newCloseProposalDate.toISOString();

    // Return an object with the new dates
    return {
        openRegistration: newOpenRegistration,
        closeRegistration: newCloseRegistration,
        openProposal: newOpenProposal,
        closeProposal: newCloseProposal
    };
}

function getNewInvalidEventDateAfterProposal() {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the new dates by modifying the current date
    const newOpenRegistrationDate = new Date(currentDate);
    newOpenRegistrationDate.setDate(currentDate.getDate() - 5);

    const newCloseRegistrationDate = new Date(currentDate);
    newCloseRegistrationDate.setDate(currentDate.getDate() - 4);

    const newOpenProposalDate = new Date(currentDate);
    newOpenProposalDate.setDate(currentDate.getDate() - 3);

    const newCloseProposalDate = new Date(currentDate);
    newCloseProposalDate.setDate(currentDate.getDate() - 2);

    // Convert dates to ISO string format
    const newOpenRegistration = newOpenRegistrationDate.toISOString();
    const newCloseRegistration = newCloseRegistrationDate.toISOString();
    const newOpenProposal = newOpenProposalDate.toISOString();
    const newCloseProposal = newCloseProposalDate.toISOString();

    // Return an object with the new dates
    return {
        openRegistration: newOpenRegistration,
        closeRegistration: newCloseRegistration,
        openProposal: newOpenProposal,
        closeProposal: newCloseProposal
    };
}



module.exports = {
    getNewValidEventDate, getNewInvalidEventDate, getNewValidEventDateOnlyInProposal,
    getNewInvalidEventDateBeforeRegistration, getNewInvalidEventDateAfterProposal, getNewValidEventDateOnlyInRegistration
}