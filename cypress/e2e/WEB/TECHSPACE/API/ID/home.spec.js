import { checkTypeForAllPages } from '../../../../../support/helper/checkTypeForAllPages';


describe("When testing home APIs positively,", () => {

    it("should return valid data for countdown in homepage", () => {
        cy.fixture('WEB/home/settingSchema.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("should return valid data timelines in homepage", () => {
        cy.fixture('WEB/home/timelines.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/timelines?sort[0]=startDate:asc&locale=id`,
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
                url: `${Cypress.env('API_URL')}api/web/techspace/partners?locale=id`,
            }).then(res => {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonSchema(schema)
            })
        })
    })

    it("Should return valid data for mentors,", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/judges-mentors`, 'WEB/home/judgesAndMentorsSchema.json', 1, 'Mentor')
    })

    it("should return valid data for Judges,", () => {
        checkTypeForAllPages(`${Cypress.env('API_URL')}api/web/techspace/judges-mentors`, 'WEB/home/judgesAndMentorsSchema.json', 1, 'Judges')
    })

    it("should be able to get participant info,", () => {
        cy.fixture('WEB/home/participantInfo.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/participation-infos?locale=id`
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
                url: `${Cypress.env('API_URL')}api/web/techspace/program-details?filters[type]=Homepage&locale=id`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema);

                cy.wrap(response.body.data).each(item => {
                    cy.fixture('WEB/home/detailedProgramDetails.json').then(detailedSchema => {
                        cy.request({
                            method: 'GET',
                            url: `${Cypress.env('API_URL')}api/web/techspace/program-details/${item.id}`
                        }).then(detailedResponse => {
                            expect(detailedResponse.status).to.equal(200)
                            expect(detailedResponse.body).to.be.jsonSchema(detailedSchema)
                        })
                    })
                })
            })
        })
    })

    it("should be able to get banner,", () => {
        cy.fixture('WEB/home/bannerSchema.json').then(schema => {
            cy.request({
                method: "GET",
                url: `${Cypress.env('API_URL')}api/web/techspace/banner?locale=id`
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})

describe("When testing home APIs negatively,", () => {
    it("should not return anything other than mentor or judges,", () => {
        let invalidType = 'commitee'
        cy.fixture('WEB/home/judgesAndMentorsNegativeSchema.json').then(schema => {
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

    it('should return error when getting program details for the unknown data,', () => {
        cy.fixture('WEB/home/programDetailsNegativeSchema.json').then(schema => {
            cy.fixture('WEB/home/validationDataForProgramDetailsNegative.json').then(validationData => {
                cy.request({
                    method: 'GET',
                    url: `${Cypress.env('API_URL')}api/web/techspace/program-details/1000`,
                    failOnStatusCode: false
                }).then(response => {
                    expect(response.status).to.equal(404)
                    expect(response.body).to.be.jsonSchema(schema)
                    expect(response.body).to.deep.equal(validationData)
                })
            })
        })
    })
})