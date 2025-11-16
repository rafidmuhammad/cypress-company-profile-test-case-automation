describe('When testing profile page APIs postively,', () => {
    let cookieToken;
    before('get token', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })
    })

    it('should return valid data when get profile', () => {
        cy.fixture('WEB/profile/profileSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/profile`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when updating profile', () => {
        const payload = { "name": 'tester' }
        cy.fixture('WEB/profile/profileUpdateSchema.json').then(schema => {
            cy.request({
                method: 'PATCH',
                url: `${Cypress.env('API_URL')}api/web/techspace/profile-update`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value
                },
                body: payload
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
                expect(response.body.data).to.deep.include(payload)
            })
        })
    })
})

describe('When testing profile APIs negatively', () => {
    it('should return error when hitting profile api with invalid tokens', () => {
        cy.fixture('WEB/auth/invalidToken.json').then(tokens => {
            cy.wrap(tokens.data).each(item => {
                cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                    cy.request({
                        method: 'GET',
                        url: `${Cypress.env('API_URL')}api/web/techspace/profile`,
                        headers: {
                            'Authorization': 'Bearer ' + item.token
                        },
                        failOnStatusCode: false
                    }).then(response => {
                        expect(response.status).to.equal(item.statusCode)
                        expect(response.body).to.be.jsonSchema(schema)
                    })
                })
            })
        })
    })

    it('should return error when hitting profile update api with invalid tokens', () => {
        const name = 'tester'
        cy.fixture('WEB/auth/invalidToken.json').then(tokens => {
            cy.wrap(tokens.data).each(item => {
                cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                    cy.request({
                        method: 'PATCH',
                        url: `${Cypress.env('API_URL')}api/web/techspace/profile-update`,
                        headers: {
                            'Authorization': 'Bearer ' + item.token
                        },
                        body: {
                            "name": name
                        },
                        failOnStatusCode: false
                    }).then(response => {
                        expect(response.status).to.equal(item.statusCode)
                        expect(response.body).to.be.jsonSchema(schema)
                        expect(response.body).to.deep.equal(item.response)
                    })
                })
            })
        })
    })
})