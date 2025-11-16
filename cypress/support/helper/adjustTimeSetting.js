function adjustTimeSetting(obj) {
    let tokenCookie
    cy.getCookie('telas23saa').then(cookie => {
        tokenCookie = cookie
        cy.request({
            method: 'PUT',
            url: `${Cypress.env('API_URL')}api/cms/techspaces/setting`,
            headers: {
                'Authorization': 'Bearer ' + tokenCookie.value
            },
            body: {
                "data": {
                    "openRegistration": obj.openRegistration,
                    "closeRegistration": obj.closeRegistration,
                    "openProposal": obj.openProposal,
                    "closeProposal": obj.closeProposal
                }
            }
        })
    }
    )
}

module.exports = { adjustTimeSetting }