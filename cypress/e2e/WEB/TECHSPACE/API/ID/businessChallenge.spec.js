describe('When testing business challenge API,', () => {
    it('should return valid data for business challenge', () => {
        cy.fixture('WEB/businessChallenge/schemaForBusinessChallenge.json').then(schema => {
            cy.request('GET', `${Cypress.env('API_URL')}api/web/techspace/business-challenges?pagination[page]=1&pagination[pageSize]=10`)
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.be.jsonSchema(schema)
                })
        })
    })
})