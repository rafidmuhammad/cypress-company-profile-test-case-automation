
describe('When testing portofolio API postively,', () => {
    let slug;
    it('should return valid data when hitting portofolio listing api', () => {
        cy.fixture('TECHCORP/portofolio/schemaForPortofolioListing.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
                slug = response.body.data[0].attributes.techcorpPortfolio[0].slug
            })
        })
    })

    it('should return valid data when hitting portofolio listing api for all category', () => {
        cy.fixture('TECHCORP/portofolio/schemaForAllCategoryPorto.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios?page=1&pageSize=12&data=all`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting portofolio detail api', () => {
        cy.fixture('TECHCORP/portofolio/schemaForPortofolioDetail.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios/${slug}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting other portofolio listing api', () => {
        cy.fixture('TECHCORP/portofolio/schemaForOtherPortofolioList.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-portofolios/${slug}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})

describe('When testing portofolio API negatively,', () => {
    const nonExisitingSlug = 'test'
    const errorResponseDetail = {
        "data": null
    }
    const errorResponseOthers = {
        "data": null,
        "error": {
            "status": 404,
            "name": "NotFoundError",
            "message": "Portfolio not found",
            "details": {}
        }
    }

    it('should return error when hitting article detail api with non-existent slug', () => {
        cy.fixture('TECHCORP/article/schemaForArticleDetail.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/portofolios/${nonExisitingSlug}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.eq(errorResponseDetail)
            })
        })
    })

    it('should return error when hitting other article listing api with non-existent slug', () => {
        cy.fixture('TECHCORP/article/schemaForOtherArticles.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-portofolios/${nonExisitingSlug}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body).to.deep.eq(errorResponseOthers)
            })
        })
    })
})