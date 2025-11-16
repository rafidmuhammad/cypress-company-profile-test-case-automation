
describe('When testing service API,', () => {
    let slug;
    it('should return valid data when hitting service listing api', () => {
        cy.fixture('TECHCORP/service/schemaForServiceListing.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
                slug = response.body.data[0].attributes.slug
            })
        })
    })

    it('should return valid data when hitting service detail api', () => {
        cy.fixture('TECHCORP/service/schemaForServiceDetail.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/${slug}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting other service listing api', () => {
        cy.fixture('TECHCORP/service/schemaForOtherServiceList.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-services/${slug}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})