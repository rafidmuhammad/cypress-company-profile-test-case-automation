const { getNewValidEventDateOnlyInRegistration } = require('../../../../../support/helper/getNewEventDate');
const { isWithinRegistrationRange } = require('../../../../../support/helper/isWithinTimeRange');
const { adjustTimeSetting } = require('../../../../../support/helper/adjustTimeSetting');


describe('Testing auth APIs positively,', () => {
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration
    let cookieToken;

    before('store current setting', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')

        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })

        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinRegistrationRange(obj)) {
                const newDates = getNewValidEventDateOnlyInRegistration()
                adjustTimeSetting(newDates)
            }
        })
    })


    it('should return valid data when hitting azure login portal,', () => {
        cy.fixture('WEB/auth/authSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/auth/authorization-url?policy=sign-in`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting azure sign up portal,', () => {
        cy.fixture('WEB/auth/authSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/auth/authorization-url?policy=sign-up`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })

    })

    it('should return valid data when hitting logout api,', () => {
        cy.fixture('WEB/auth/logoutSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/auth/logout-url`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value
                }
            }).then(response => {
                expect(response.status).to.be.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
    //NOTE: Cannot add more validation due to dynamic response
    it('should return valid data when hitting token generation api', () => {
        cy.fixture('WEB/auth/testDataForGenerateToken.json').then(payload => {
            cy.fixture('WEB/auth/tokenGenerationSchema.json').then(schema => {
                cy.request({
                    method: 'POST',
                    url: `${Cypress.env('API_URL')}api/web/techspace/auth/generate-token`,
                    body: payload
                }).then(response => {
                    expect(response.status).to.be.equal(200)
                    expect(response.body).to.be.jsonSchema(schema)
                })
            })
        })
    })

    after('Rollback to previous setting', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })
})

describe('Testing auth APIs negatively,', () => {
    it('should return not found when hitting token generation api with invalid payload', () => {
        cy.fixture('WEB/auth/invalidTestDataForGenerateToken.json').then(payload => {
            cy.fixture('WEB/auth/invalidTokenGenerationSchema.json').then(schema => {
                cy.fixture('WEB/auth/validationDataForAuthAPINegative.json').then(validationData => {
                    cy.request({
                        method: 'POST',
                        url: `${Cypress.env('API_URL')}api/web/techspace/auth/generate-token`,
                        body: payload,
                        failOnStatusCode: false
                    }).then(response => {
                        expect(response.status).to.be.equal(404)
                        expect(response.body).to.be.jsonSchema(schema)
                        expect(response.body).to.deep.equal(validationData)
                    })
                })
            })
        })
    })

    //NOTE: Test skipped due to hotfix
    it.skip('should return error when hitting log-out api with invalid tokens', () => {
        cy.fixture('WEB/auth/invalidTokenForLogout.json').then(tokens => {
            cy.wrap(tokens.data).each(item => {
                cy.request({
                    method: 'GET',
                    url: `${Cypress.env('API_URL')}api/web/techspace/auth/logout-url`,
                    headers: {
                        'Authorization': 'Bearer ' + item.token
                    },
                    failOnStatusCode: false
                }).then(response => {
                    expect(response.status).to.equal(item.statusCode)
                    expect(response.body).to.be.jsonSchema(item.schema)
                })
            })
        })
    })
})