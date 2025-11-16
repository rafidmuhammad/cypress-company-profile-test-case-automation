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
    })

    it('should user will be navigated to login page when user accesses the page event registration in a state of not logged in (banner)', () => {
        onHomePage.clickDaftarBannerButton("id")
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
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToEventRegistrationThroughBurger("id")
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
            onLoginPage.checkAllElement()
        })
    })

    it('should user will be navigated to the form when user accesses the page event registration when user already login (participation info)', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.checkTheContents("id")
        onRegisterEventPage.clickInformasiInovasi("id")
    })

    it('should user will be navigated to the form when user accesses the page event registration when user already login (timeline)', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonTimeline()
        onRegisterEventPage.checkTheContents("id")
        onRegisterEventPage.clickInformasiInovasi("id")
    })

    it('should user will be navigated to login page when user accesses the page event registration when user already login (formulir pengajuan burger menu)', () => {
        cy.LoginToTechSpace("id")
        onHeaderBar.openBurgerMenu(true, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToEventRegistrationThroughBurger("id")
        onRegisterEventPage.checkTheContents("id")
        onRegisterEventPage.clickInformasiInovasi("id")
    })

    it('should user not can mendaftarkan event with form kosong', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSelanjutnya()
        onRegisterEventPage.clickDaftar()
        onRegisterEventPage.validateFailureDaftar("id")
        onRegisterEventPage.clickPeriksaData("id")
        onRegisterEventPage.validateValidationMessageInformasiInovasi("id")
        onRegisterEventPage.clickInformasiTim("id")
        onRegisterEventPage.validateValidationMessageInformasiTim("id")
    })

    it('should field on the event registration display batasan karakter', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.fillInTheFieldsMoreThanLimit("id")
    })

    it('should user not can mengunggah proposal melebihi batas that ditentukan', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSelanjutnya()
        onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/16MB-TESTFILE.pdf')
        onRegisterEventPage.validateValidationMessageWhenFileLargerThan15MB("id")
        cy.fixture('WEB/registerEvent/invalidData.json').then(invalidFiles => {
            cy.wrap(invalidFiles.data).each(item => {
                onRegisterEventPage.uploadFile(`cypress/fixtures/WEB/registerEvent/${item.file}`)
                onRegisterEventPage.validateValidationMessageWhenFileIsNotPdf("id")
            })
        })
    })

    it('should user can menyimpan data form when pertama kali akses page pengisian formulir', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickDaftarButtonParticipation()
        onRegisterEventPage.clickSimpan("id")
    })

    it('should user can menyimpan data form when display data that already terisi', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickAkunSaya("id")
        onProfilePage.clickFormulirPengajuan()
        onProfilePage.clickLengkapiFormulir("id")
        onRegisterEventPage.isiInformasiTim("id")
        onRegisterEventPage.clickSimpan("id")
    })

    it('should user can mendaftarkan event', () => {
        cy.LoginToTechSpace("id")
        onHomePage.clickAkunSaya("id")
        onProfilePage.clickFormulirPengajuan()
        onProfilePage.clickLengkapiFormulir("id")
        onRegisterEventPage.clickInformasiInovasi("id")
        onRegisterEventPage.isiInformasiInovasi("id")
        onRegisterEventPage.uploadFile('cypress/fixtures/WEB/registerEvent/validFile.pdf')
        onRegisterEventPage.clickDaftar()
        onRegisterEventPage.validateSuccessDaftar("id")
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