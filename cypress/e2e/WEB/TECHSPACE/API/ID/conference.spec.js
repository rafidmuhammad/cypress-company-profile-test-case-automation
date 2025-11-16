import { checkTypeForAllPages } from '../../../../../support/helper/checkTypeForAllPages';


describe("When testing conference APIs positively,", () => {

    it("should return valid data for banner in conference page", () => {
        cy.fixture('WEB/conference/schemaForBanner.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/conference-banner?locale=id`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("should return valid data for speaker in conference page", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/judges-mentors`, 'WEB/conference/schemaForSpeaker.json', 1, 'Speaker')
    })

    it("should return valid data for konferensi sebelumnya in conference page", () => {
        cy.fixture('WEB/conference/schemaForPastConference.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/past-conference?pagination[pageSize]=50`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("should return valid data for agenda konferensi in conference page", () => {
        cy.fixture('WEB/conference/schemaForAgenda.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/conference-agendas?locale=id&pageSize=50`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("should return valid data for program details in conference page", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/program-details`, 'WEB/conference/schemaForProgramDetails', 1, 'Conference', 'id')
    })

    it("should return valid data for year list for speaker in conference page", () => {
        cy.fixture('WEB/conference/schemaForYearList.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors/list-year`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })
})

describe("When testing conference APIs negatively,", () => {
    const invalidType = 'president'
    it("should return empty data for invalid type in conference page", () => {
        cy.fixture('WEB/conference/schemaForInvalidSpeaker.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?filters[type][$eq]=${invalidType}`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
                expect(res.body.data).to.be.empty
                expect(res.body.meta.pagination.total).to.equal(0)
            })
        })
    })

    it("should return empty data for invalid year on konferensi sebelumnya api in conference page", () => {
        const invalidYear = 2028
        cy.fixture('WEB/conference/schemaForInvalidYear.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/past-conference?filters[year]=${invalidYear}`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
                expect(res.body.data).to.be.empty
                expect(res.body.meta.pagination.total).to.equal(0)
            })
        })
    })

    it("should return empty data for invalid occasion on program details in conference page", () => {
        const invalidCon = 'Party'
        cy.fixture('WEB/conference/schemaForInvalidConference.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/program-details?filters[type]=${invalidCon}&locale=id`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
                expect(res.body.data).to.be.empty
                expect(res.body.meta.pagination.total).to.equal(0)
            })
        })
    })
})