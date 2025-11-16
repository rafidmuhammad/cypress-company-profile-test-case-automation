const { agendaTimeFormat } = require('../helper/agendaTimeFormat');

export class ConferencePage {

    validatePagePath() {
        cy.location('pathname').should('contain', 'techspaces_conference')
    }

    validateTitle() {
        cy.get('[data-cy="/techspaces_conference-welcome"]').scrollIntoView()
        cy.wait(1000)
        cy.get('[data-cy="/techspaces_conference-welcome"]').should('contain', 'Selamat Datang di TechSpace Conference').and('be.visible')
    }

    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
    }

    //NOTE: Automation Detected
    clickBeliTiket() {
        cy.get('[data-cy="banner-button"] [title="Beli Tiket"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://goers.co/techspacesconference2024')
            cy.request('GET', element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickSpeaker(locale) {
        cy.get('[class="m-38a85659 mantine-Popover-dropdown SpeakerSection_selectDropdown__mfPrZ m-88b62a41 mantine-Select-dropdown"]').as('scrollCondition')
            .invoke('attr', 'style').then((style) => {
                const firstCondition = style
                locale === "id" ? cy.get('[data-cy="banner-button"]', { timeout: 5000 }).contains('Pembicara').click() : locale === 'en' ? cy.get('[data-cy="banner-button"]', { timeout: 5000 }).contains('Speakers').click() : -1
                cy.get('#speaker').should('be.visible')
                cy.get('@scrollCondition').invoke('attr', 'style').should('not.equal', firstCondition)
            })
    }

    clickAgenda() {
        cy.get('[class="m-38a85659 mantine-Popover-dropdown AgendaSection_selectDropdown__L2Slm m-88b62a41 mantine-Select-dropdown"]').as('agendaScrollCondition')
            .invoke('attr', 'style').then((style) => {
                const firstCondition = style
                cy.get('[data-cy="banner-button"]', { timeout: 5000 }).contains('Agenda').click()
                cy.wait(5000)
                cy.get('#agenda').should('be.visible')
                cy.get('@agendaScrollCondition', { timeout: 5000 }).invoke('attr', 'style').should('not.equal', firstCondition)
            })
    }

    checkAgenda(body, tab) {
        if (body.data[(tab - 1)].attributes.agendaDetails.length) {
            cy.wait(1000)
            cy.get('#agenda .mantine-Timeline-itemBody', { timeout: 5000 }).each((item, index) => {
                cy.wrap(item).should('be.visible').and('contain', body.data[(tab - 1)].attributes.agendaDetails[index].title)
                let startTime = body.data[(tab - 1)].attributes.agendaDetails[index].startTime
                let endTime = body.data[(tab - 1)].attributes.agendaDetails[index].endTime
                let estimatedTime = body.data[(tab - 1)].attributes.agendaDetails[index].estimatedTime
                let time = agendaTimeFormat(startTime, endTime, estimatedTime)

                cy.get('#agenda .mantine-Timeline-itemBullet').eq(index).should('be.visible').and('contain', time.time)
                cy.get('#agenda .mantine-Timeline-itemBullet').eq(index).should('be.visible').and('contain', time.duration)

                if (body.data[(tab - 1)].attributes.agendaDetails[index].speakers) {
                    cy.wrap(body.data[(tab - 1)].attributes.agendaDetails[index].speakers).each((speaker, speakerIndex) => {
                        cy.wrap(item).should('be.visible').and('contain', speaker.name)
                    })
                }
            })
        }
    }

    clickLihatHighlight(locale) {
        locale === "id" ? cy.get('[data-cy="register"]').contains('Lihat Video Highlights').click() : locale === "en" ? cy.get('[data-cy="register"]').contains('See Highlights Video').click() : -1
    }

    checkPageTitle(body) {
        cy.get('[data-cy="/techspaces_conference-welcome"]').scrollIntoView()
        cy.wait(1000)
        cy.get('[data-cy="/techspaces_conference-welcome"]', { timeout: 5000 }).should('contain', body.data.attributes.homepageTitle)
    }

    checkPageDescription(body) {
        cy.get('[data-cy="/techspaces_conference-description"]').scrollIntoView()
        cy.wait(1000)
        cy.get('[data-cy="/techspaces_conference-description"]', { timeout: 5000 }).should('contain', body.data.attributes.homepageDescription)
    }

    checkPartner(element) {
        if (element.attributes.partners.length) {
            cy.get('[data-cy="partners"]').should('contain', element.attributes.name)
            cy.contains(element.attributes.name).parent().find('img').each((item, Imageindex) => {
                cy.wrap(item).invoke('attr', 'src').should('not.be.empty')
            })
        }
        else {
            cy.get('[data-cy="partners"]').should('not.contain', element.attributes.name)
        }
    }

    checkForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Punya Pertanyaan?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parent().find('button').contains('Klik di sini').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Have Questions?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Click here')
        }
    }

    checkProgramDetails(body) {
        cy.get('[data-cy="program-card"]', { timeout: 5000 }).each((item, index) => {
            cy.wrap(item, { timeout: 5000 }).scrollIntoView()
            cy.wrap(item, { timeout: 5000 }).contains(body.data[index].attributes.title).isVisible()
            cy.wrap(item, { timeout: 5000 }).contains(body.data[index].attributes.description).isVisible()
        })
    }

    checkSpeaker(body, locale) {
        if (body.data.length) {
            cy.wait(1000)
            locale === "id" ? cy.contains('Pembicara TechSpace').scrollIntoView() : locale === "en" ? cy.get("#speaker").contains('Speakers').scrollIntoView() : -1
            cy.get('[class="SpeakerCard_card__fg5P_ m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]', { timeout: 5000 }).each((item, index) => {
                cy.wrap(item).find('img.SpeakerCard_image__jluhz', { timeout: 5000 }).invoke('attr', 'src').should('not.be.empty')
                cy.wrap(item).click()
                cy.wrap(item).find('[class="SpeakerCard_overlayText__YFvup"]', { timeout: 5000 }).should('be.visible').and('contain', body.data[index].attributes.name)
                cy.wrap(item).find('[class="SpeakerCard_overlayText__YFvup"]', { timeout: 5000 }).should('be.visible').and('contain', body.data[index].attributes.position)
                cy.wrap(item).find('[class="SpeakerCard_overlayText__YFvup"]', { timeout: 5000 }).find('svg').isVisible()
                if (body.data[index].attributes.company) {
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.company)
                }
                cy.wrap(item).find('[class="SpeakerCard_overlayText__YFvup"]', { timeout: 5000 }).find('a').invoke('attr', 'href').then(val => {
                    expect(val).to.satisfy(url => {
                        return url === body.data[index].attributes.linkedInProfileUrl || url === undefined
                    })
                })
            })
        }

    }

    clickNextArrow() {
        cy.get('#speaker button', { timeout: 5000 }).eq(1).click({ force: true })
    }

    checkSpeakerNextPage(body) {
        cy.get('[data-cy="section-title"]').scrollIntoView()
        cy.get('[class="SpeakerCard_card__fg5P_ m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]', { timeout: 5000 }).then(item => {
            cy.wrap(item).eq(8).should('be.visible')
        })
    }

    selectOtherYearSpeakers(year) {
        cy.get('[data-cy="speaker-year-select"]').click()
        cy.get('.SpeakerSection_selectOption__DarcI[role="option"]').eq(1).click()
        cy.get('[data-cy="speaker-year-select"]').invoke('attr', 'value').should('contain', '2023')
    }

    checkSpeakerOtherYear(body) {
        cy.get('[class="SpeakerCard_card__fg5P_ m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]', { timeout: 5000 }).as('speakerCard')
        cy.get('@speakerCard').should('have.length', body.data.length)
        cy.get('@speakerCard').each(item => {
            cy.wrap(item).should('be.visible')
        })
    }

    selectOtherYearAgenda() {
        cy.get('[data-cy="agenda-year-select"]', { timeout: 5000 }).click({ force: true })
        cy.get('.AgendaSection_selectOption__zZQVH[role="option"]').eq(1).click()
    }

    clickNextAgenda() {
        cy.get('#agenda [class="m-d98df724 mantine-Carousel-slide"]', { timeout: 5000 }).eq(1).click()
    }

    scrollToPastConference() {
        cy.get('.PastConference_container__dOj3T', { timeout: 5000 }).scrollIntoView()
        cy.get('.PastConference_container__dOj3T', { timeout: 5000 }).should('be.visible')
    }

    clickOneOfPastConference() {
        cy.get('.PastConference_container__dOj3T').find('.PastConference_galleryGridItem__025mO', { timeout: 5000 }).eq(1).click({ force: true })
        cy.get('[data-cy="past-conference-galery-modal-image"]').find('img', { timeout: 5000 }).should('be.visible')
    }

    checkPastConferenceSection(data) {
        cy.get('.PastConference_galleryGridItem__025mO').as('imageGallery').each((items) => {
            cy.wrap(items).find('img').then(image => {
                cy.wrap(image).invoke('attr', 'src').should('not.be.empty')
                cy.wrap(image).should('be.visible')
            })
        })
        cy.get('@imageGallery').should('have.length', data.length)
    }

    checkElementNextPage() {
        cy.wait(2000)
        cy.get('.PastConference_container__dOj3T .PastConference_galleryGrid__hD49i', { timeout: 5000 }).eq(1).find('.PastConference_galleryGridItem__025mO').find('img').as('conferenceCard')
        cy.get('@conferenceCard').should('be.visible')
        cy.get('@conferenceCard').invoke('attr', 'src').should('not.be.empty')

    }

    clickPastConNextArrow() {
        cy.wait(2000)
        cy.get('.PastConference_container__dOj3T button', { timeout: 5000 }).eq(1).click()
    }

    //NOTE: Automation Detected
    clickBeliTiketAgenda() {
        cy.get('[data-cy="register"]').contains('Beli Tiket').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://goers.co/techspacesconference2024')
            cy.request('GET', element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }
}

export const onConferencePage = new ConferencePage()