export class PortofolioPage {
    validatePagePath() {
        cy.location('pathname').should('contain', 'portfolio')
    }

    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
        cy.get('video source').should('have.attr', 'src')
    }

    clickPortofolioCard() {
        cy.get('[data-cy="header-/portfolio"]').click()
    }

    checkTabbing(data, locale) {
        cy.get('[data-cy="portfolio-tab"]').parent().should('contain', locale === 'id' ? "Semua Kategori" : locale === 'en' ? "All Categories" : -1).should('be.visible')
        cy.get('[data-cy="portfolio-tab"]').each((item, index) => {
            cy.wrap(item).should('contain', locale === 'id' ? data[index].attributes.name_id : locale === 'en' ? data[index].attributes.name_en : -1).isVisible()
        })
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

    checkCard(data, locale, page) {
        cy.get('[data-cy="portfolios-desktop-carousel"] [class="m-d98df724 mantine-Carousel-slide"]').eq(page - 1).find('[data-cy="portfolio-desktop-card"]').each((item, index) => {
            cy.wrap(item).should('contain', data[index].attributes.title).and('be.visible')
            cy.wrap(item).should('contain', locale === 'id' ? data[index].attributes.short_description_id : locale === 'en' ? data[index].attributes.short_description_en : -1).and('be.visible')
            cy.wrap(item).find('img').invoke('attr', 'src').should('not.be.empty')
        })
    }

    clickNextArrowPortoList() {
        cy.get('[data-cy="portfolios-desktop-carousel"]').find('button[tabindex="0"]').click()
    }

    clickOtherTab() {
        cy.get('[data-cy="portfolio-tab"]').eq(0).click()
    }

    checkCardOtherTab(data, locale) {
        cy.log(data)
        cy.get('[data-cy="portfolios-desktop-carousel"] [class="m-d98df724 mantine-Carousel-slide"]').eq(0).find('[data-cy="portfolio-desktop-card"]').each((item, index) => {
            cy.wrap(item).should('contain', data[index].title).and('be.visible')
            cy.wrap(item).should('contain', locale === 'id' ? data[index].short_description_id : locale === 'en' ? data[index].short_description_en : -1).and('be.visible')
            cy.wrap(item).find('img').invoke('attr', 'src').should('not.be.empty')
        })
    }

    navigateToDetail(locale) {
        cy.get('[data-cy="portfolio-desktop-card"]').eq(0).as('firstCard').trigger('mouseover')
        cy.get('@firstCard').find('button').contains(locale === "id" ? 'Lihat Detail' : locale === "en" ? 'See Details' : -1).click({ force: true })
    }
}

export const onPortofolioPage = new PortofolioPage()