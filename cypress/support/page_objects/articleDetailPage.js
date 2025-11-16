export class ArticleDetailPage {

    validatePagePath(slug) {
        cy.location('pathname').should('contain', `article/${slug}`)
    }

    validateThePage() {
        cy.get('[data-cy="article-title"]').should('be.visible')
        cy.get('[data-cy="category-text"]').should('be.visible')
        cy.get('[data-cy="article-date"]').should('be.visible')
        cy.get('[data-cy="social-link-Whatsapp"]').should('be.visible')
        cy.get('[data-cy="social-link-Facebook"]').should('be.visible')
        cy.get('[data-cy="social-link-X"]').should('be.visible')
        cy.get('[data-cy="social-link-share"]').should('be.visible')
        cy.get('[data-cy="article-short-description"]').should('be.visible')
        cy.get('[data-cy="article-image"]').should('be.visible')
        cy.get('[data-cy="article-content"]').should('be.visible')
        cy.get('[data-cy="article-previous-article"]').should('be.visible')
        cy.get('[data-cy="article-other-article"]').should('be.visible')
    }

    clickShareLink() {
        cy.get('[data-cy="social-link-share"]').eq(0).click()
    }

    //NOTE: Facebook tidak memproses automation
    clickFacebook(slug) {
        cy.get('[data-cy="social-link-Facebook"]').eq(0).invoke('attr', 'href').should('contain', "https://www.facebook.com/sharer/").and('contain', slug)
        cy.get('[data-cy="social-link-Facebook"]').eq(0).invoke('removeAttr', 'target').click()
        cy.origin('https://www.Facebook.com/', () => {
            cy.url().then((url) => {
                cy.log(url)
            })
        })
    }

    //NOTE: Tidak dapat melakukan test pada aplikasi desktop
    clickWhatsapp(slug) {
        cy.get('[data-cy="social-link-Whatsapp"]').eq(0).invoke('attr', 'href').then((val) => {
            cy.wrap(val).should('contain', "https://api.whatsapp.com/send?text").and('contain', slug)
            cy.get('[data-cy="social-link-Whatsapp"]').eq(0).invoke('removeAttr', 'target').click()
            const link = val
            cy.origin('https://api.whatsapp.com/', { args: link }, (link) => {
                cy.url().then((url) => {
                    cy.wrap(link).should('contain', url)
                })
            })
        })


    }


    //NOTE: Twitter kalau tidak login tidak dapat di get linknya
    clickX(slug) {
        cy.get('[data-cy="social-link-X"]').eq(0).invoke('attr', 'href').should('contain', "https://twitter.com/intent/post").and('contain', slug)
        cy.get('[data-cy="social-link-X"]').eq(0).invoke('removeAttr', 'target').click()
        cy.origin('https://www.twitter.com/', () => {
        })
    }
    checkSuccessModal(locale) {
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Sukses" : locale === "en" ? "Success" : -1)
    }
    checkErrorModal(locale) {
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Sukses" : locale === "en" ? "Success" : -1)
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Anda berhasil terdaftar sebagai subscriber" : locale === "en" ? "You successfully registered as a subscriber" : -1)
    }
    clickPreviousPage() {
        cy.get('[data-cy="article-previous-article"]').click()
    }
    fillEmailSubscription(email) {
        cy.get('[data-cy="input-email"]').clear({ force: true })
        cy.get('[data-cy="input-email"]').type(email, { force: true })
    }
    clickSubscribe() {
        cy.get('[data-cy="subscribe-button"]').click()
    }
    checkSuccessModal(locale) {
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Sukses" : locale === "en" ? "Success" : -1)
    }
    closeModal() {
        cy.get('.mantine-Modal-body button').click()
    }
    checkEmailSubscriptionError(locale) {
        cy.get('.mantine-TextInput-error').should('contain', locale === "id" ? "Format alamat email yang anda masukkan tidak sesuai" : locale === "en" ? "The format of the email address you entered is not correct" : -1)
    }

    checkForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Punya Pertanyaan?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('hello@techcorp.id')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parent().find('button').contains('Klik di sini').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Have Questions?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('hello@techcorp.id')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Click here')
        }
    }

    clickOtherArticle() {
        cy.get('[data-cy="card-article-other"]').first().click()
    }
}

export const onArticleDetailPage = new ArticleDetailPage()