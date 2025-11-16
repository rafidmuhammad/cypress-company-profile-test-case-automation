export class PortofolioDetailPage {
    checkDetailPage(data, locale) {
        cy.get('[data-cy="portfolio-detail-section"]').should('be.visible')
        cy.get('[data-cy="portfolio-detail-image"]').should('be.visible').invoke('attr', 'src').then(imageUrl => {
            cy.wrap(imageUrl).should('not.be.empty')
        })
        cy.get('[data-cy="portfolio-visit-website"]').should('be.visible')
        cy.get('[data-cy="portfolio-detail-title"]').should('be.visible').and('contain', data.title)
        cy.get('[data-cy="portfolio-detail-service"]').should('be.visible').and('contain', locale === "id" ? data.techcorpService.name_id : locale === "en" ? data.techcorpService.name_en : -1)
        cy.get('[data-cy="portfolio-detail-year"]').should('be.visible').and('contain', data.year)
        cy.get('[data-cy="portfolio-detail-about"]').should('be.visible').and('contain', locale === "id" ? data.about_id : locale === "en" ? data.about_en : -1)
        cy.get('[data-cy="gallery-desktop-image"]').should('be.visible')

    }

    clickVisitWebsite() {
        cy.get('[data-cy="portfolio-visit-website"]').parent().invoke('removeAttr', 'target').click()
    }
    validateWebsiteUrl(data) {
        cy.origin(data.websiteUrl, { args: { data } }, ({ data }) => {
            cy.url().should('eq', data.websiteUrl)
        })
    }
    validateHiddenWebsiteButton() {
        cy.get('[data-cy="portfolio-visit-website"]').should('not.exist')
    }

    clickOtherPortoCards(locale) {
        cy.get('.CustomCard_card__ARBgw').eq(0).as('firstOtherPorto').trigger('mouseover')
        cy.get('@firstOtherPorto').find('button').contains(locale === "id" ? 'Lihat Detail' : locale === "en" ? 'See Details' : -1).click({ force: true })
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

}

export const onPortofolioDetailPage = new PortofolioDetailPage()