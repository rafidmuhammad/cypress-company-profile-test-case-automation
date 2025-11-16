describe('When testing banner API,', () => {
    it('should return valid data when hitting homepage hero api', () => {
        cy.fixture('TECHCORP/homepage/schemaForBanner.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/homepage/hero`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema.homepageHero)
            })
        })
    })

    it('should return valid data when hitting portofolio hero api', () => {
        cy.fixture('TECHCORP/homepage/schemaForBanner.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolio/hero?locale=id`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema.portofolioHero)
            })
        })
    })

    it('should return valid data when hitting service hero api', () => {
        cy.fixture('TECHCORP/homepage/schemaForBanner.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/service/hero?locale=id`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema.serviceHero)
            })
        })
    })
})