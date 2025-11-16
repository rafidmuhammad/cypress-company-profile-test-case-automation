const { onProfilePage } = require('../../../../../support/page_objects/profilePage');
const { onHomePage } = require('../../../../../support/page_objects/homePage');
const { isWithinProposalRange, isWithinRegistrationRange } = require('../../../../../support/helper/isWithinTimeRange');
const { adjustTimeSetting } = require('../../../../../support/helper/adjustTimeSetting');
const { getNewValidEventDate, getNewInvalidEventDate } = require('../../../../../support/helper/getNewEventDate');
const { onRegisterEventPage } = require('../../../../../support/page_objects/registerEventPage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
import { deleteSubmissionFromUserWhenExist } from '../../../../../support/helper/deleteSubmission';

describe("When testing profile page, ", () => {
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration

    before('Store current setting', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
        })
    })

    beforeEach('Navigate to the profile page', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')

        cy.openHomepage()
        cy.LoginToTechSpace("id")
        deleteSubmissionFromUserWhenExist()
        onHeaderBar.openBurgerMenu(true, "id")
        onHeaderBar.clickAkunSaya("id")

    })

    it('User successfully navigates to profile', () => {
        onProfilePage.checkPageContent("id")
    })

    it('User successfully edits team leader name', () => {
        onProfilePage.clickEdit()
        onProfilePage.fillInName()
        onProfilePage.clickSimpan("id")
    })

    it('User successfully navigates to the pengisian Formulir Pengajuan when pendaftaran techspace sedang dibuka', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir("id")
            onRegisterEventPage.validateThePath()
        })
    })

    it('User successfully navigates to the pengisian Formulir Pengajuan when user not yet selesai mengisi formulir pengajuan', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir("id")
            onRegisterEventPage.clickSimpan("id")
            onRegisterEventPage.clickKembaliKeProfil("id")
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickLengkapiFormulir("id")
            onRegisterEventPage.validateThePath()
        })
    })

    it('User successfully accesses the page formulir pengajuan to memperbarui data', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickIsiFormulir("id")
            onRegisterEventPage.isiInformasiTim("id")
            onRegisterEventPage.clickInformasiInovasi("id")
            onRegisterEventPage.isiInformasiInovasi("id")
            onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/validFile.pdf')
            onRegisterEventPage.clickDaftar()
            onRegisterEventPage.clickKembaliKeProfil("id")
            onProfilePage.clickFormulirPengajuan()
            onProfilePage.clickPerbaruiData("id")
            onRegisterEventPage.validateThePath()
        })
    })

    it('should user navigated to the forgot password', () => {
        onProfilePage.clickKataSandi("id")
        onProfilePage.clickUbahKataSandi("id")

        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onForgotPasswordPage } = Cypress.require('../../../../../support/page_objects/forgotPasswordPage')
            onForgotPasswordPage.checkAllElement()
        })
    })

    it('should user successfully keluar/logout', () => {
        onProfilePage.clickKeluar("id")
        onProfilePage.confirmKeluar("id")
        onHomePage.checkUrl()
        onHomePage.checkBannerButtonCondition(false, "id")
    })

    it('should user will be shown bahwa pendaftaran already ditutup', () => {
        cy.wait('@setting').its('response.body').then(obj => {
            if (isWithinProposalRange(obj)) {
                const newDates = getNewInvalidEventDate()
                adjustTimeSetting(newDates)
            }
            onProfilePage.clickFormulirPengajuan()
            cy.reload()
            onProfilePage.validatePendaftaranDitutup()
        })
    })

    after('Rollback to previous setting', () => {
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })
})