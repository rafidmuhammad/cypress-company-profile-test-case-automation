export class ServicePage {
    validatePagePath() {
        cy.location('pathname').should('contain', 'service')
    }

    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
        cy.get('video source').should('have.attr', 'src')
    }

    checkBannerTitle(bannerTitle) {
        cy.get('[data-cy="service-banner-title"]').should('contain', bannerTitle).and('be.visible')
    }

    checkBodyTitle(locale) {
        if (locale === 'id') {
            cy.get('.OurService_bodyTitle__7LNaY').should('contain', "Layanan Kami").and('be.visible')
        }
        else if (locale === 'en') {
            cy.get('.OurService_bodyTitle__7LNaY').should('contain', "Our Services").and('be.visible')
        }
    }

    checkBodyDescription(locale) {
        if (locale === 'id') {
            cy.get('.OurService_bodyList__uIKdV p').should('contain', "Kami siap berdiskusi dan mendukung Anda mewujudkan ide-ide bisnis yang inovatif. Dengan pengalaman dan sumber daya kami, TechCorp Digital siap menjadi mitra yang dapat diandalkan dalam mengembangkan bisnis Anda di era digital.").and('be.visible')
        }
        else if (locale === 'en') {
            cy.get('.OurService_bodyList__uIKdV p').should('contain', "We are ready to discuss and support you in realizing innovative business ideas. With our experience and resources, TechCorp Digital is ready to be a reliable partner in developing your business in the digital era.").and('be.visible')
        }
    }

    checkServicesCards(locale, data) {
        if (locale === 'id') {
            cy.get('[data-cy="service-card-desktop"]').each((item, index) => {
                cy.wrap(item).should('contain', data[index].attributes.name_id)
                cy.wrap(item).should('contain', data[index].attributes.description_id)
                cy.wrap(item).find('a').invoke('attr', 'href').should('contain', data[index].attributes.slug)
                cy.wrap(item).click().should('contain', 'Lihat Detail')
            })
        }
        else if (locale === 'en') {
            cy.get('[data-cy="service-card-desktop"]').each((item, index) => {
                cy.wrap(item).should('contain', data[index].attributes.name_en)
                cy.wrap(item).should('contain', data[index].attributes.description_en)
                cy.wrap(item).find('a').invoke('attr', 'href').should('contain', data[index].attributes.slug)
                cy.wrap(item).click().should('contain', 'See Detail')
            })
        }
    }

    hoverToCard() {
        cy.get('[data-cy="service-card-desktop"]').first().trigger('mouseover')
    }

    clickCard() {
        cy.get('[data-cy="service-card-desktop"]').first().find('a').click()
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

export const onServicePage = new ServicePage()