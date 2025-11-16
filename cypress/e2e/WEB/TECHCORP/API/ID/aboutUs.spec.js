describe('When testing about us API,', () => {
    it('should return valid data when hitting about us api', () => {
        cy.fixture('TECHCORP/aboutUs/schemaForAboutUs.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/about-us`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})