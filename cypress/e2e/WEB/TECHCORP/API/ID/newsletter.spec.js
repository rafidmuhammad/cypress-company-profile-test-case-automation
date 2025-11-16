const faker = require('faker');

const randomEmail = faker.internet.email();
const payload = {
    "email": randomEmail,
    "locale": "id"
}

describe('When testing newsletter API positively,', () => {
    it('should return valid data when hitting newsletter api', () => {
        cy.fixture('TECHCORP/newsletter/schemaForNewsletter.json').then((schema) => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/newslatter/subscribe`,
                body: payload
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})

describe('When testing newsletter API negatively,', () => {
    it('should return error when hitting newsletter listing api with used email', () => {
        cy.fixture('TECHCORP/newsletter/schemaForErrorResponse.json').then((schema) => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/newslatter/subscribe`,
                body: payload
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema.used_email)
            })
        })
    })

    it('should return error when hitting newsletter listing api with invalid email', () => {
        const invalidEmail = {
            "email": "tester.com",
            "locale": "id"
        }
        const errorResponse = {
            "data": null,
            "error": {
                "status": 400,
                "name": "BadRequestError",
                "message": "Invalid email address",
                "details": {}
            }
        }
        cy.fixture('TECHCORP/newsletter/schemaForErrorResponse.json').then((schema) => {
            cy.request({
                method: 'POST',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/newslatter/subscribe`,
                body: invalidEmail,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.be.jsonSchema(schema.invalid_email)
                expect(response.body).to.deep.eq(errorResponse)
            })
        })
    })
})