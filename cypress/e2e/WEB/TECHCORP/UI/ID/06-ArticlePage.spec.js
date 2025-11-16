const { onArticleDetailPage } = require('../../../../../support/page_objects/articleDetailPage');
const { onArticlePage } = require('../../../../../support/page_objects/articlePage');
const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const faker = require('faker');

describe('When testing article page,', () => {
    const randomEmail = faker.internet.email();
    beforeEach('open article Page,', () => {
        cy.fixture('TECHCORP/article/testDataForArticle.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=1&pagination[pageSize]=10`
            }, testData.articleList).as('articleList')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=3&pagination[pageSize]=5`
            }, testData.articleListNextPage).as('articleListMore')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/article-categories?locale=id&pagination=1&pagination[pageSize]=10`
            }, testData.articleCategory).as('articleCategories')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=1&pagination[pageSize]=10&filters[category][id][[$eq]=10`
            }, testData.articleListOtherCategory).as('articleOtherCategories')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/artikel-cek-1`
            }, testData.articleDetail).as('articleDetail')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/artikel-cek-1/others?locale=id`
            }, testData.otherArticles).as('otherArticles')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/graduation-night-techcorp-innov-lab-seven-local-startups-with-great-potential`
            }, testData.articleDetail2).as('articleDetail2'),
                cy.intercept({
                    method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles/graduation-night-techcorp-innov-lab-seven-local-startups-with-great-potential/others?locale=id`
                }, testData.otherArticles).as('otherArticles2')
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=1&pagination[pageSize]=10&filters[title][$containsi]=nvidia`
            }, testData.searchResult).as('searchResult')
        })


        cy.visit('/article')
    })

    it("should display filter artikel on article page", () => {
        cy.wait('@articleCategories').its('response.body.data').then((data) => {
            onArticlePage.checkFilters("id", data)
        })
    })

    it("should display komponen card on article page", () => {
        cy.fixture('TECHCORP/article/testDataForArticle.json').then(testData => {
            testData.articleList.data = testData.articleList.data.slice(0, 2)
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/articles?locale=id&pagination[page]=1&pagination[pageSize]=10`
            }, testData.articleList).as('articleListCards')
        })

        cy.wait('@articleListCards').its('response.body.data').then(data => {
            onArticlePage.checkCards(data, "id")
        })
    })

    it("should displayed list card artikel displayed more banyak when jumlah artikel more from 10 ", () => {
        cy.wait(1000)
        cy.wait('@articleList').its('response.body.data').then(() => {
            onArticlePage.clickLoadMore()
            cy.wait('@articleListMore').its('response.body.data').then(data => {
                onArticlePage.checkNextCards(data, 'id')
            })
        })
    })

    it("should displayed card artikel on kategori lain", () => {
        onArticlePage.clickOtherCategory('id')
        cy.wait('@articleOtherCategories').its('response.body.data').then(data => {
            onArticlePage.checkCards(data, 'id')
        })
    })

    it("should user navigated to the page detil artikel", () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait(['@articleDetail', '@otherArticles']).then(() => {
                onArticleDetailPage.validateThePage()
            })
        })
    })

    it("should user navigated menuju article page sebelumnya", () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.clickPreviousPage()
                onArticlePage.validatePagePath()
            })
        })
    })

    it("should User can View Section Contact Us in artikel and detil artikel", () => {
        onArticlePage.checkForMoreInformation('id')
        onArticlePage.clickOneOfTheCards()
        onArticleDetailPage.checkForMoreInformation('id')
    })

    it("should user shown komponen-footer components on article page", () => {
        onPageFooter.checkAllComponents("id")
        onArticlePage.clickOneOfTheCards()
        onPageFooter.checkAllComponents("id")
    })

    it('should user can subscribe newsletter techcorpdigital via detail page artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.fillEmailSubscription(randomEmail)
                onArticleDetailPage.clickSubscribe()
                onArticleDetailPage.checkSuccessModal("id")
                onArticleDetailPage.closeModal()
            })
        })
    })

    it('should user not can submit email that already dikirimkan on subscription field newsletter via detail page artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.fillEmailSubscription(randomEmail)
                onArticleDetailPage.clickSubscribe()
                onArticleDetailPage.checkErrorModal("id")
                onArticleDetailPage.closeModal()
            })
        })
    })

    it('should user not can enter invalid input on subscription field newsletter via detail page artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.fillEmailSubscription("testgmail.com")
                onArticleDetailPage.checkEmailSubscriptionError("id")
                onArticleDetailPage.fillEmailSubscription("@testgmail.com")
                onArticleDetailPage.checkEmailSubscriptionError("id")
            })
        })
    })

    it('should user can menyalin link halaman', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.clickShareLink()
                onArticleDetailPage.checkSuccessModal('id')
            })
        })
    })

    it('should user navigated to the page X  to melakukan share artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.clickX('artikel-cek-1')
            })
        })
    })

    it('should user navigated to the page facebook to melakukan share artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.clickFacebook('artikel-cek-1')
            })
        })
    })

    it('should User will be navigated to the WA to share artikel', () => {
        cy.wait('@articleList').its('response.body.data').then(data => {
            onArticlePage.clickOneOfTheCards()
            cy.wait('@articleDetail').its('response.body.data').then(() => {
                onArticleDetailPage.clickWhatsapp('artikel-cek-1')
            })
        })
    })

    it('should user navigated to the page detil artikel from page detil artikel lain', () => {
        cy.wait('@articleList').its('response.body.data').then(() => {
            onArticlePage.clickOneOfTheCards()
            cy.wait(['@articleDetail', '@otherArticles']).then(() => {
                onArticleDetailPage.clickOtherArticle()
                cy.wait(['@articleDetail2', '@otherArticles2']).then(() => {
                    onArticleDetailPage.validateThePage()
                })
            })
        })
    })

    it('should user can mencari artikel berdasarkan keyword judul', () => {
        cy.wait('@articleList').its('response.body.data').then(() => {
            const title = "nvidia"
            onArticlePage.clickSearchField()
            onArticlePage.searchArticle(title)
            cy.wait('@searchResult').its('response.body.data').then(data => {
                onArticlePage.checkSearchResult(data[0].attributes.title)
            })
        })
    })

    it('should user displayed error "artikel not ditemukan" when keyword that dicari not ada', () => {
        cy.wait('@articleList').its('response.body.data').then(() => {
            const title = "kumbang"
            onArticlePage.clickSearchField()
            onArticlePage.searchArticle(title)
            onArticlePage.checkNotFoundArticleMessage(title, "id")
        })
    })
    it('should user displayed error "artikel not ditemukan" when when kategori not mempunyai data (artikel)', () => {
        cy.wait('@articleCategories').its('response.body.data').then(() => {
            const category = 'tester'
            onArticlePage.clickCategoryByName(category)
            onArticlePage.checkNotFoundCategoryMessage(category, "id")
        })
    })
})