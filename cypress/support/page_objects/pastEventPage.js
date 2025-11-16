const { extractVideoId } = require('..//helper/extractVideoID.js');

export class PastEventPage {

    validatePagePath() {
        cy.location('pathname').should('contain', 'techspaces_past')
    }

    validatePageContent(locale) {
        if (locale === 'id') {
            cy.contains('TechSpace 2024').should('be.visible')
            cy.contains('TechSpace Tahun Sebelumnya').should('be.visible')
        }
        else if (locale === 'en') {
            cy.contains('TechSpace 2024').should('be.visible')
            cy.contains('Previous TechSpace').should('be.visible')
        }
    }

    checkIframe() {
        cy.get('iframe').should('be.visible').invoke('attr', 'src').should('contain', 'youtube')
    }

    checkVideo() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
    }

    NavigateToTechSpace2022() {
        cy.get('a[title="TechSpace 2022"]').click()
    }

    NavigateToTechSpace2023() {
        cy.get('a[title="TechSpace 2023"]').click()
    }

    detailYearCheckElement(body) {
        cy.wrap(body.data[0].attributes.description).each(item => {
            cy.contains(item.children[0].text).should('be.visible')
        })
        cy.get('iframe').should('be.visible').invoke('attr', 'src').should('contain', extractVideoId(body.data[0].attributes.youtube_link))

    }


}

export const onPastEventPage = new PastEventPage()