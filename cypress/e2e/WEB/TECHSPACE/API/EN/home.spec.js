import { checkTypeForAllPages } from '../../../../../support/helper/checkTypeForAllPages';


describe("When testing home APIs positively,", () => {
    it("should return valid data timelines in homepage", () => {
        cy.fixture('WEB/home/timelines.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/timelines?sort[0]=startDate:asc&locale=en`,
            }).then(res => {
                if (res.body.data.length !== 0) {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.jsonSchema(schema)
                }
            })
        })
    })

    it("Should return valid data partners in homepage", () => {
        cy.fixture('WEB/home/partners.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/partners?locale=en`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("should be able to get participant info,", () => {
        cy.fixture('WEB/home/participantInfo.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/participation-infos?locale=en`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
    it("should be able to get program details,", () => {
        cy.fixture('WEB/home/programDetailsListSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/program-details?filters[type]=Homepage&locale=en`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema);
            })
        })
    })

    it("should be able to get banner,", () => {
        cy.fixture('WEB/home/bannerSchema.json').then(schema => {
            cy.request({
                method: "GET",
                url: `${Cypress.env('API_URL')}api/web/techspace/banner?locale=en`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})