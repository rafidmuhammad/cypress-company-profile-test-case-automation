import { checkTypeForAllPages } from '../../../../../support/helper/checkTypeForAllPages';


describe("When testing announcement APIs positively,", () => {

    it("should return valid data for winner in announcement page", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/announcement`, 'WEB/announcement/schemaForWinner.json', 1, 'Winner')
    })

    it("should return valid data for finalistt in announcement page", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/announcement`, 'WEB/announcement/schemaForFinalistt.json', 1, 'Finalistt')
    })

    it("should return valid data for year list in announcement page", () => {
        cy.fixture('WEB/announcement/schemaForYearList.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/announcement/list-year`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })
})

describe("When testing announcement APIs negatively,", () => {
    it("should return empty data for invalid type in announcement page", () => {
        const invalidType = 'runner'
        cy.fixture('WEB/announcement/schemaForEmptyResponse.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type][$eq]=${invalidType}`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
                expect(res.body.data).to.be.empty
                expect(res.body.meta.pagination.total).to.equal(0)
            })
        })
    })
})