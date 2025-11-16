describe('When testing past event page API positively, ', () => {
    it('should return valid data for past event', () => {
        cy.fixture('WEB/home/pastEventList.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/past-events?locale=id`,
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data for past event detail', () => {
        const pastEvents = ['2022', '2023']
        cy.fixture('WEB/home/pastEventDetailSchema.json').then(schema => {
            cy.wrap(pastEvents).each(year => {
                cy.request({
                    method: 'GET',
                    url: `${Cypress.env('API_URL')}api/web/techspace/past-events?filters[year][$eqi]=${year}&locale=id`,
                }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body).to.be.jsonSchema(schema)
                    expect(response.body.data[0].attributes.locale).to.be.a('string').and.to.equal('id')
                    expect(response.body.data[0].attributes.year).to.be.a('string').and.to.equal(year)
                    expect(response.body.data[0].attributes.youtube_link).to.be.not.empty
                })
            })
        })
    })
})

describe('When testing past event page API negatively, ', () => {
    it('should not return anything when year other than 2022 or 2023', () => {
        cy.fixture('WEB/home/pastEventNegativeSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/past-events?filters[year][$eqi]=2028&locale=id`,
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
                expect(response.body.data).to.be.empty
            })
        })
    })
})