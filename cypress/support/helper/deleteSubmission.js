export function deleteSubmissionFromUserWhenExist() {
    let tokenCookie
    let submissionId

    cy.getCookie('telas23saa').then(cookie => {
        tokenCookie = cookie
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspaces/profile/submission`,
            headers: {
                'Authorization': 'Bearer ' + tokenCookie.value
            }
        }).then(response => {
            if (response.body.data !== null) {
                submissionId = response.body.data.id
                cy.request({
                    method: 'DELETE',
                    url: `${Cypress.env('API_URL')}api/cms/techspaces/submission-forms/${submissionId}`,
                    headers: {
                        'Authorization': 'Bearer ' + tokenCookie.value
                    }
                })
            }
        })
    })
}