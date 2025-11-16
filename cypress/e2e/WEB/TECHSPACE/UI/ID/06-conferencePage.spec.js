
const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onConferencePage } = require('../../../../../support/page_objects/conferencePage');
const { onPastEventPage } = require('../../../../../support/page_objects/pastEventPage');

describe('When testing the conference page,', () => {

    beforeEach('Visit announcement page', () => {
        cy.fixture('WEB/conference/testDataForConference.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-banner?locale=id`
            }, testData.id).as('banner')
        })

        cy.fixture('WEB/conference/testDataForProgramDetails.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/program-details?filters[type]=Conference&locale=id`
            }, testData.id).as('programDetails')
        })

        cy.fixture('WEB/conference/testDataForPartner.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/partners?locale=id`
            }, testData.id).as('partners')
        })

        cy.visit('techspace_conference')
    })

    it('should user will be directed to speaker section on conference page', () => {
        onConferencePage.clickSpeaker("id")
    })

    it('should List speaker on Next List appear ', () => {
        cy.fixture('WEB/conference/testDataForSpeakergt8.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?filters[type][$eq]=Speaker&pagination[pageSize]=50`
            }, testData).as('speakersGT8')
        })

        cy.reload()

        cy.wait('@speakersGT8').its('response.body').then((body) => {
            onConferencePage.clickSpeaker("id")
            onConferencePage.clickNextArrow()
            onConferencePage.checkSpeakerNextPage(body)
        })
    })

    it('should User Can view Detail Infromasi Speaker', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?filters[type][$eq]=Speaker&pagination[pageSize]=50`
        }, { fixture: 'WEB/conference/testDataForSpeaker.json' }).as('speaker')


        cy.wait('@speaker').its('response.body').then((body) => {
            onConferencePage.checkSpeaker(body, "id")
        })

    })

    it('should List Speaker sesuai with Tahun That dipilih ', () => {
        cy.fixture('WEB/conference/testDataYearList.json').then(year => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors/list-year`
            }, year).as('yearList')
        })

        cy.fixture('WEB/conference/testDataForSpeaker2023.json').then(speaker => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?filters[type][$eq]=Speaker&filters[year]=2023&pagination[pageSize]=50`
            }, speaker).as('speakerOtherYear')
        })

        cy.reload()
        cy.wait(2000)

        cy.wait('@yearList').its('response.body.data').then((data) => {
            onConferencePage.clickSpeaker("id")
            onConferencePage.selectOtherYearSpeakers(data[1])
            cy.wait('@speakerOtherYear').its('response.body').then((body) => {
                onConferencePage.checkSpeakerOtherYear(body)
            })
        })


    })

    it('should user will be directed to section Agenda on conference page', () => {
        cy.fixture('WEB/conference/testDataForAgenda2024.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-agendas?locale=id&pageSize=50`
            }, testData.id).as('agenda')
        })
        cy.reload()
        onConferencePage.clickAgenda()
        cy.wait('@agenda').its('response.body').then((body) => {
            onConferencePage.checkAgenda(body, 1)
        })
    })

    it('should user can view Agenda in tanggal lain', () => {
        cy.fixture('WEB/conference/testDataForMultipleAgenda.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-agendas?year=2024&locale=id&pageSize=50`
            }, testData.id).as('multipleAgenda')
        })
        cy.reload()
        cy.wait(2000)
        onConferencePage.clickNextAgenda()
        cy.wait('@multipleAgenda').its('response.body').then((body) => {
            cy.log(body)
            onConferencePage.checkAgenda(body, 2)
        })

    })

    it('should List Agenda sesuai with Tahun That dipilih ', () => {
        cy.fixture('WEB/conference/testDataYearList.json').then(year => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-agendas/list-year`
            }, year).as('agendaYearList')
        })

        cy.fixture('WEB/conference/testDataForAgenda2023.json').then(agenda => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-agendas?year=2023&locale=id&pageSize=50`
            }, agenda.en).as('agendaOtherYear')
        })

        cy.reload()
        cy.wait(2000)
        cy.wait('@agendaYearList').then(() => {
            onConferencePage.selectOtherYearAgenda()
            cy.wait('@agendaOtherYear').its('response.body').then((body) => {
                onConferencePage.checkAgenda(body, 1)

            })
        })
    })

    it('should User can View Section TechSpace Conference Sebelumnya', () => {
        cy.intercept('GET', `${Cypress.env('API_URL')}api/web/techspace/past-conference?pagination[pageSize]=50`,
            { fixture: 'WEB/conference/testDataForPastConference.json' }).as('pastConferenceImages')

        cy.reload()
        cy.wait(2000)

        cy.wait('@pastConferenceImages').its('response.body.data').then((testData) => {
            onConferencePage.scrollToPastConference()
            onConferencePage.checkPastConferenceSection(testData)
        })

    })

    it('should User can View Section TechSpace Conference Sebelumnya to in page to 2', () => {
        cy.intercept('GET', `${Cypress.env('API_URL')}api/web/techspace/past-conference?pagination[pageSize]=50`,
            { fixture: 'WEB/conference/testDataPastConGT8.json' }).as('pastConferenceImagesGT8')

        cy.reload()
        cy.wait(2000)

        cy.wait('@pastConferenceImagesGT8').its('response.body.data').then((testData) => {
            onConferencePage.scrollToPastConference()
            onConferencePage.clickPastConNextArrow()
            onConferencePage.checkElementNextPage()
        })
    })

    it('should User can Perbesar Image Conference Sebelumnya', () => {
        cy.fixture('WEB/conference/testDataForPastConference.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/past-conference?pagination[pageSize]=50`
            }, testData).as('pastConference')
        })

        cy.reload()

        cy.wait('@pastConference').then(() => {
            onConferencePage.scrollToPastConference()
            onConferencePage.clickOneOfPastConference()
        })
    })

    it('should User dinavigasi user to the landing page “Past Events TechSpace”', () => {
        onConferencePage.clickLihatHighlight("id")
        onPastEventPage.validatePageContent()
        onPastEventPage.validatePagePath()
    })

    it('should User can view Mitra that ada in page Konferensi ', () => {
        cy.wait('@partners').its('response.body.data').each((element) => {
            onConferencePage.checkPartner(element)
        })
    })

    it('should user shown komponen-footer components', () => {
        onPageFooter.checkAllComponents("id")
    })

    it('should Display Komponen Banner Video in page Konferensi', () => {
        onConferencePage.checkVideoBanner()
    })

    it('should Display Komponen Banner Title on the Konferensi', () => {
        cy.wait('@banner').its('response.body').then((data) => {
            onConferencePage.checkPageTitle(data)
        })
    })

    it('should Display Komponen Banner Description on the Konferensi', () => {
        cy.wait('@banner').its('response.body').then((data) => {
            onConferencePage.checkPageDescription(data)
        })
    })

    it('should Display Komponen Program Details - Conference on the Konferensi', () => {
        cy.wait('@programDetails').its('response.body').then((data) => {
            onConferencePage.checkProgramDetails(data)
        })
    })

    it('should User can View Section Contact Us in page TechSpace', () => {
        onConferencePage.checkForMoreInformation("id")
    })

    //NOTE: Not can in automasi karena website pembelian tiket mendeteksi robot / human
    it.skip('should user will be directed to website pembelian tiket when click tombol beli tiket on conference page', () => {

    })
})