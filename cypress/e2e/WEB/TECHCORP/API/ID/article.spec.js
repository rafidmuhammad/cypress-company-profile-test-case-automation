
describe('When testing article API positively,', () => {
    let slug;
    const categoryFilter = 'Berita'
    it('should return valid data when hitting article listing api', () => {
        cy.fixture('TECHCORP/article/schemaForArticleListing.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?pagination[page]=1&pagination[pageSize]=10&filters[isHighlighted][$eq]=true`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
                slug = response.body.data[0].attributes.slug
            })
        })
    })

    it('should return valid data when hitting article listing api with category filter applied', () => {
        cy.fixture('TECHCORP/article/schemaForArticleListing.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?filters[category][name_id][[$containsi]=${categoryFilter}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })


    it('should return valid data when hitting article detail api', () => {
        cy.fixture('TECHCORP/article/schemaForArticleDetail.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/${slug}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting other article listing api', () => {
        cy.fixture('TECHCORP/article/schemaForOtherArticles.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/${slug}/others`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })

    it('should return valid data when hitting article category api', () => {
        cy.fixture('TECHCORP/article/schemaForArticleCategory.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/article-categories?pagination[page]=1&pagination[pageSize]=10`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
            })
        })
    })
})


describe('When testing article API negatively,', () => {
    const nonExistingCategory = 'bola'
    const nonExisitingSlug = 'test'
    const errorResponseDetail = {
        "data": null,
        "error": {
            "status": 404,
            "name": "NotFoundError",
            "message": "Not Found",
            "details": {}
        }
    }
    const errorResponseOthers = {
        "data": null,
        "error": {
            "status": 404,
            "name": "NotFoundError",
            "message": "Sorry, article not found",
            "details": {}
        }
    }
    it('should return empty data when hitting article listing api with non existent category', () => {
        cy.fixture('TECHCORP/article/schemaForEmptyList.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?filters[category][name_id][[$containsi]=${nonExistingCategory}`,
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.be.jsonSchema(schema)
                expect(response.body.data).to.be.empty
            })
        })
    })

    it('should return error when hitting article detail api with non-existent slug', () => {
        cy.fixture('TECHCORP/article/schemaForArticleDetail.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/${nonExisitingSlug}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body).to.deep.eq(errorResponseDetail)
            })
        })
    })

    it('should return error when hitting other article listing api with non-existent slug', () => {
        cy.fixture('TECHCORP/article/schemaForOtherArticles.json').then((schema) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/${nonExisitingSlug}/others`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(404)
                expect(response.body).to.deep.eq(errorResponseOthers)
            })
        })
    })
})