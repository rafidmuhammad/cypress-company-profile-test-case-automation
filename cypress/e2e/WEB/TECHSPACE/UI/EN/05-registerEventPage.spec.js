const { onHomePage } = require('../../../../../support/page_objects/homePage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
const { onRegisterEventPage } = require('../../../../../support/page_objects/registerEventPage');
const { onProfilePage } = require('../../../../../support/page_objects/profilePage');
import { adjustTimeSetting } from '../../../../../support/helper/adjustTimeSetting';
import { deleteSubmissionFromUserWhenExist } from '../../../../../support/helper/deleteSubmission';
const { getNewValidEventDate } = require('../../../../../support/helper/getNewEventDate');

describe('When testing event registration page,', () => {
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration


    before('Force to fall within registration range', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
        })
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        const newDates = getNewValidEventDate()
        adjustTimeSetting(newDates)
        cy.logOut()
        cy.wait(1000)

    })

    beforeEach('Visit the homepage', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')
        cy.openHomepage()
        cy.changeToEnglish(false, "AN")
    })

    it('should user will be navigated to login page when user accesses the page event registration in a state of not logged in (banner)', () => {
        onHomePage.clickDaftarBannerButton("en")
        cy.wait(1000)
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })


    it('should user will be navigated to login page when user accesses the page event registration in a state of not logged in (participation info)', () => {
        onHomePage.clickDaftarButtonParticipation()
        cy.wait(1000)
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })

    it('should user will be navigated to login page when user accesses the page event registration in a state of not logged in (timeline)', () => {
        onHomePage.clickDaftarButtonTimeline()
        cy.wait(1000)
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })


    it('should user will be navigated to login page when user accesses the page event registration in a state of not logged in (Pengajuan Formulir Burger)', () => {
        onHeaderBar.openBurgerMenu(false, "en")
        onHeaderBar.openTechSpaceMenu(false, "en")
        onHeaderBar.navigateToEventRegistrationThroughBurger("en")
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })

    it('should user will be navigated to the form when user accesses the page event registration when user already login (participation info)', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.checkTheContents("en")
        onRegisterEventPage.clickInformasiInovasi("en")
    })

    it('should user will be navigated to the form when user accesses the page event registration when user already login (timeline)', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonTimeline()
        onRegisterEventPage.checkTheContents("en")
        onRegisterEventPage.clickInformasiInovasi("en")
    })

    it('should user will be navigated to login page when user accesses the page event registration when user already login (formulir pengajuan burger menu)', () => {
        cy.LoginToTechSpace("en")
        onHeaderBar.openBurgerMenu(true, "en")
        onHeaderBar.openTechSpaceMenu(false, "en")
        onHeaderBar.navigateToEventRegistrationThroughBurger("en")
        onRegisterEventPage.checkTheContents("en")
        onRegisterEventPage.clickInformasiInovasi("en")
    })

    it('should user not can mendaftarkan event with form kosong', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSelanjutnya()
        onRegisterEventPage.clickDaftar()
        onRegisterEventPage.validateFailureDaftar("en")
        onRegisterEventPage.clickPeriksaData("en")
        onRegisterEventPage.validateValidationMessageInformasiInovasi("en")
        onRegisterEventPage.clickInformasiTim("en")
        onRegisterEventPage.validateValidationMessageInformasiTim("en")
    })

    it('should field on the event registration display batasan karakter', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.fillInTheFieldsMoreThanLimit("en")
    })

    it('should user not can mengunggah proposal melebihi batas that ditentukan', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSelanjutnya()
        onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/16MB-TESTFILE.pdf')
        onRegisterEventPage.validateValidationMessageWhenFileLargerThan15MB("en")
        cy.fixture('WEB/registerEvent/invalidData.json').then(invalidFiles => {
            cy.wrap(invalidFiles.data).each(item => {
                onRegisterEventPage.uploadFile(`cypress/fixtures/WEB/registerEvent/${item.file}`)
                onRegisterEventPage.validateValidationMessageWhenFileIsNotPdf("en")
            })
        })
    })

    it('should user can menyimpan data form when pertama kali akses page pengisian formulir', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSimpan("en")
    })

    it('should user can menyimpan data form when display data that already terisi', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickAkunSaya("en")
        onProfilePage.clickFormulirPengajuan()
        onProfilePage.clickLengkapiFormulir("en")
        onRegisterEventPage.isiInformasiTim("en")
        onRegisterEventPage.clickSimpan("en")
    })

    it('should user can mendaftarkan event', () => {
        cy.LoginToTechSpace("en")
        onHomePage.clickAkunSaya("en")
        onProfilePage.clickFormulirPengajuan()
        onProfilePage.clickLengkapiFormulir("en")
        onRegisterEventPage.clickInformasiInovasi("en")
        onRegisterEventPage.isiInformasiInovasi("en")
        onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/validFile.pdf')
        onRegisterEventPage.clickDaftar()
        onRegisterEventPage.validateSuccessDaftar("en")
    })

    after('Deleting Submission & rollback setting', () => {
        deleteSubmissionFromUserWhenExist()

        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })

})