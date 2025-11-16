export class AboutUsPage {
    validatePagePath() {
        cy.location('pathname').should('contain', 'about')
    }

    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
        cy.get('video source').should('have.attr', 'src')
    }

    clickNextArrowLeaderSection() {
        cy.get('[data-cy="leaders-section"]').find('button[tabindex="0"]').click()
    }


    checkLeader(data) {
        cy.get('[class="AboutUsPage_cardRoot__0DaMs m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]').each((item, index) => {
            cy.wrap(item).should('contain', data.attributes.boardOfDirectors[index].name).and('be.visible')
        })
    }

    checkLeaderTitle(locale) {
        cy.get('[data-cy="leaders-title"]').should('be.visible').and('contain', locale === 'id' ? 'Our Company Leaders' : 'Board of Directors')
    }

    checkLeaderNextPage(data) {
        cy.get('[class="AboutUsPage_cardRoot__0DaMs m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]').eq(6).should('contain', data.attributes.boardOfDirectors[6].name).and('be.visible')
    }

    checkTitle(data, locale) {
        if (locale === 'id') {
            cy.get('[data-cy="about-us-title"]').should('contain', data.attributes.banner.pageTitle_id)
        }
        else if (locale === 'en') {
            cy.get('[data-cy="about-us-title"]').should('contain', data.attributes.banner.pageTitle_en)
        }
    }

    checkDesc(data, locale) {
        if (locale === 'id') {
            cy.get('[data-cy="about-us-desc"]').should('contain', data.attributes.banner.pageDescription_id)
        }
        else if (locale === 'en') {
            cy.get('[data-cy="about-us-desc"]').should('contain', data.attributes.banner.pageDescription_en)
        }
    }

    checkLogo() {
        cy.get('[data-cy="company-logo"]').as('logo').should('be.visible')
        cy.get('@logo').invoke('attr', 'src').should('not.be.empty')
    }

    clickNextArrowCoreValues() {
        cy.get('.AboutUsPage_coreValues__97JNV').find('button').eq(1).click()
    }

    checkCoreValuesNextPage(data, locale) {
        if (locale === 'id') {
            cy.get('[data-cy="core-value-card"]').eq(3).as('coreCard').should('contain', data.attributes.ourCoreValues[3].title_id).and('be.visible')
            cy.get('@coreCard').should('contain', data.attributes.ourCoreValues[3].description_id).and('be.visible')
        }
        else if (locale === 'en') {
            cy.get('[data-cy="core-value-card"]').eq(3).as('coreCard').should('contain', data.attributes.ourCoreValues[3].title_en).and('be.visible')
            cy.get('@coreCard').should('contain', data.attributes.ourCoreValues[3].description_en).and('be.visible')
        }
    }
    checkCoreValues(data, locale) {
        if (locale === 'id') {
            cy.get('[data-cy="core-value-card"]').each((item, index) => {
                cy.wrap(item).should('contain', data.attributes.ourCoreValues[index].title_id).and('be.visible')
                cy.wrap(item).should('contain', data.attributes.ourCoreValues[index].description_id).and('be.visible')
            })
        }
        else if (locale === 'en') {
            cy.get('[data-cy="core-value-card"]').each((item, index) => {
                cy.wrap(item).should('contain', data.attributes.ourCoreValues[index].title_en).and('be.visible')
                cy.wrap(item).should('contain', data.attributes.ourCoreValues[index].description_en).and('be.visible')
            })
        }
    }

    checkForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Have Questions?').as('information').should('be.visible')
            cy.get('@information').parent().contains('hello@techcorp.com')
            cy.get('@information').parent().contains('techcorpid')
            cy.get('@information').parent().find('button').contains('Click here').should('be.visible')
            cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Have Questions?').as('information').should('be.visible')
            cy.get('@information').parent().contains('hello@techcorp.com')
            cy.get('@information').parent().contains('techcorpid')
            cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@information').parent().find('button').should('contain', 'Click here')
        }
    }
}

export const onAboutUsPage = new AboutUsPage()