export class ADHomepage {

    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
        cy.get('video source').should('have.attr', 'src')
    }

    checkBanner(data) {
        cy.get('[class="m-2ce0de02 mantine-BackgroundImage-root"]').invoke('attr', 'style').should('contain', `background-image: url("${data.attributes.hero.attributes.formats.large.url}");`)
    }

    clickOurServicesCard() {
        cy.get('[data-cy="header-/service"]').click()
    }

    clickAboutUsCard() {
        cy.get('[data-cy="header-/about"]').click()
    }

    clickPortfolioCard() {
        cy.get('[data-cy="header-/portfolio"]').click()
    }

    checkEmailSubscription() {
        cy.get(".HomePage_subscribeCard__Eqzyz").find("input").should("be.visible")
        cy.get(".HomePage_subscribeCard__Eqzyz").find("button").should("be.visible")
    }
    fillEmailSubscription(email) {
        cy.get('[data-cy="emailTextInput"]').clear()
        cy.get('[data-cy="emailTextInput"]').type(email)
    }
    clickSubscribe() {
        cy.get('[data-cy="subscribeButton"]').click()
    }
    checkSuccessModal(locale) {
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Success" : locale === "en" ? "Success" : -1)
    }
    checkErrorModal(locale) {
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "Success" : locale === "en" ? "Success" : -1)
        cy.get('.mantine-Modal-body').should('contain', locale === "id" ? "You successfully registered as a subscriber" : locale === "en" ? "You successfully registered as a subscriber" : -1)
    }
    closeModal() {
        cy.get('.mantine-Modal-body button').click()
    }
    checkEmailSubscriptionError(locale) {
        cy.get('.mantine-TextInput-error').should('contain', locale === "id" ? "The format of the email address you entered is incorrect" : locale === "en" ? "The format of the email address you entered is incorrect" : -1)
    }
    clickPartnerSite() {
        //NOTE: Error from web partner site
        cy.origin('https://partner.example.com', () => {
            cy.on('uncaught:exception', (e) => {
                if (e.message.includes('GTM is not defined')) {
                    // we expected this error, so let's ignore it
                    // and let the test continue
                    return false
                }
            })
        })

        cy.get('[data-cy="partnerCard"]').invoke('removeAttr', 'target').click()
        cy.origin('https://partner.example.com/', () => {
            cy.url().should('eq', 'https://partner.example.com/about')
        })

    }

    goBackFromPartnerSite() {
        cy.origin('https://partner.example.com/', () => {
            cy.go('back')
        })
    }
    clickTechSpace() {
        cy.get('[data-cy="header-/techspace"]').click()
    }
    clickArticleCard(slug) {
        cy.get(`[data-cy="header-/article/${slug}"]`).click()
    }
    checkTestimonials(data) {
        cy.get('[data-cy="quoteCarousel"]').should('be.visible')
        cy.wrap(data).each((item, index) => {
            cy.get(`[data-cy="quoteTitle-${data.length - index}"]`).invoke('text').then(item => cy.log(item))
            cy.get(`[data-cy="quoteTitle-${data.length - index}"]`).should('contain', item.attributes.title)
            cy.get(`[data-cy="quotePosition-${data.length - index}"]`).should('contain', item.attributes.userPosition)
            cy.get(`[data-cy="quoteFullname-${data.length - index}"]`).should('contain', item.attributes.userFullname)
            cy.get(`[data-cy="quoteDescription-${data.length - index}"]`).should('contain', item.attributes.description)
        })
    }

    clickArticle() {
        cy.get('[data-cy="article-desktop-header-link-article"]').click()
    }
}

export const onADHomepage = new ADHomepage()