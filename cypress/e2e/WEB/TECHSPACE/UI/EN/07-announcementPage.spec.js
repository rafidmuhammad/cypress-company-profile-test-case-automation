const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onAnnouncementPage } = require('../../../../../support/page_objects/announcementPage');

describe('When testing the announcement page,', () => {
    beforeEach('Visit announcement page', () => {
        cy.visit('techspace_updates')
        cy.changeToEnglish(false, "AN")
    })

    it('should user shown winner and finalistt on announcement page', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Winner&filters[category]=Startup+Track&filters[year]=2024`
        }, { fixture: 'WEB/announcement/winnerStartupTrack.json' },).as('winnerStartupTrack')

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Finalistt&filters[category]=Startup+Track&filters[year]=2024&pagination[pageSize]=100`
        }, { fixture: 'WEB/announcement/finalisttStartupTrack.json' },).as('finalisttStartupTrack')

        onAnnouncementPage.clickWinnerStartUpTab()

        cy.wait('@winnerStartupTrack').then(xhr => {
            onAnnouncementPage.checkWinnerTitle('en')
            onAnnouncementPage.checkYearSelect()
            onAnnouncementPage.checkWinnerTab()
            onAnnouncementPage.checkWinnerCard(0, xhr.response.body.data[0].attributes.name, xhr.response.body.data[0].attributes.description, "en")
            onAnnouncementPage.checkWinnerCard(1, xhr.response.body.data[1].attributes.name, xhr.response.body.data[1].attributes.description, "en")
            onAnnouncementPage.checkWinnerCard(2, xhr.response.body.data[2].attributes.name, xhr.response.body.data[2].attributes.description, "en")
        })

        onAnnouncementPage.clickFinalistStartUpTab()

        cy.wait('@finalisttStartupTrack').then(xhr => {
            onAnnouncementPage.checkFinalisttTitle('en')
            onAnnouncementPage.checkFinalistTab()
            onAnnouncementPage.checkFinalisttCard(0, xhr.response.body.data[0].attributes.name, xhr.response.body.data[0].attributes.description, "en")
            onAnnouncementPage.checkFinalisttCard(1, xhr.response.body.data[1].attributes.name, xhr.response.body.data[1].attributes.description, "en")
            onAnnouncementPage.checkFinalisttCard(2, xhr.response.body.data[2].attributes.name, xhr.response.body.data[2].attributes.description, "en")
        })
    })

    it('should in tahun lain menampilkan finalist and winner', () => {
        cy.fixture('WEB/conference/testDataYearList.json').then(year => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement/list-year`
            }, year).as('yearList')
        })

        cy.fixture('WEB/announcement/winner2023.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Winner&filters[category]=Startup+Track&filters[year]=2023`
            }, testData).as('winner2023')

            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Winner&filters[year]=2023`
            }, testData).as('isWinner')
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Finalistt&filters[category]=Startup+Track&filters[year]=2023&pagination[pageSize]=100`
        }, { fixture: 'WEB/announcement/finalistt2023.json' },).as('finalistt2023')

        cy.reload()
        cy.wait(2000)

        onAnnouncementPage.selectOtherYearAnnouncement()
        cy.wait(['@isWinner', '@yearList', '@winner2023', '@finalistt2023']).spread(
            (isWinner, yearList, winner, finalistt) => {
                onAnnouncementPage.checkWinnerCard(0, winner.response.body.data[0].attributes.name, winner.response.body.data[0].attributes.description, "en")
                onAnnouncementPage.checkFinalisttCard(0, finalistt.response.body.data[0].attributes.name, finalistt.response.body.data[0].attributes.description, "en")
            }
        )

    })

    it('should user shown bagian Informasi More Lanjut', () => {
        onAnnouncementPage.checkForMoreInformation('en')
    })

    it('should user shown komponen-footer components', () => {
        onPageFooter.checkAllComponents('en')
    })

    it('should hanya shown finalist when not yet ada winner', () => {
        cy.fixture('WEB/announcement/emptyData.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Winner&filters[year]=2024`
            }, testData).as('winner2024')

            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Finalistt&filters[category]=Startup+Track&filters[year]=2024&pagination[pageSize]=100`
            }, { fixture: 'WEB/announcement/finalisttStartupTrack.json' },).as('finalistt2024')
        })

        cy.reload()

        cy.wait('@winner2024').then((winner) => {
            cy.wait('@finalistt2024').then((finalistt) => {
                cy.log(winner.response.body.data)
                onAnnouncementPage.checkAbsenceOfWinner()
                onAnnouncementPage.checkFinalisttTitle('en')
                onAnnouncementPage.checkFinalistTab()
                onAnnouncementPage.checkFinalisttCard(0, finalistt.response.body.data[0].attributes.name, finalistt.response.body.data[0].attributes.description, "en")
                onAnnouncementPage.checkFinalisttCard(1, finalistt.response.body.data[1].attributes.name, finalistt.response.body.data[1].attributes.description, "en")
                onAnnouncementPage.checkFinalisttCard(2, finalistt.response.body.data[2].attributes.name, finalistt.response.body.data[2].attributes.description, "en")
            })
        })

    })

    it('should user shown winner and finalistt in tab lain', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Winner&filters[category]=Student+Track&filters[year]=2024`
        }, { fixture: 'WEB/announcement/testDataForStudentTrackWinner.json' },).as('winnerStudentTrack')

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/announcement?filters[type]=Finalistt&filters[category]=Student+Track&filters[year]=2024&pagination[pageSize]=100`
        }, { fixture: 'WEB/announcement/testDataForStudentTrackFinalistt.json' },).as('finalisttStudentTrack')


        onAnnouncementPage.clickWinnerStudentTab()

        cy.wait('@winnerStudentTrack').its('response.body').then(body => {
            cy.wrap(body.data).each((winner, index) => {
                onAnnouncementPage.checkWinnerCard(index, winner.attributes.name, winner.attributes.description, "en")
            })
        })

        onAnnouncementPage.clickFinalistStudentTab()

        cy.wait('@finalisttStudentTrack').its('response.body').then(body => {
            cy.log(body.data)
            cy.wrap(body.data).each((finalistt, index) => {
                onAnnouncementPage.checkFinalisttCard(index, finalistt.attributes.name, finalistt.attributes.description, "en")
            })
        })


    })
})