describe('When testing testimonial API,', () => {
    it('should return valid data when hitting testimonial api', () => {
        cy.fixture('TECHCORP/testimonial/schemaForTestimonial.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/testimonials?pagination[page]=1&pagination[pageSize]=10`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})