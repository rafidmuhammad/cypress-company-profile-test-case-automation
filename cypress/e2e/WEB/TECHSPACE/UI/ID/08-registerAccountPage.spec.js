const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
const { getNewValidEventDate, getNewInvalidEventDate } = require('../../../../../support/helper/getNewEventDate');
const { adjustTimeSetting } = require('../../../../../support/helper/adjustTimeSetting');
const { extractOTPCode } = require('../../../../../support/helper/extractOTPCode');
import { recurse } from 'cypress-recurse'

describe('When testing registration,', () => {
    let userEmail;
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration
    let currentTimeRangeObject
    let sid_token
    let emailCount = 0

    before('create test email and fetch current setting', () => {
        cy.getNewEmail()
        cy.fixture('WEB/auth/emailAccountData.json').then(testAccount => {
            userEmail = testAccount.email_addr
            sid_token = testAccount.sid_token
        })
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
            currentTimeRangeObject = response.body

            cy.openHomepage()
            cy.LoginToTechSpace("id")
            const newDates = getNewValidEventDate()
            adjustTimeSetting(newDates)
            cy.logOut()
            cy.wait(2000)
            cy.reload()
        })
    })

    beforeEach('Navigate to the home page', () => {
        cy.openHomepage()
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.clickDaftar()
    })

    it('User successfully accesses the page register', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, () => {
            const { onRegisterAccountPage } = Cypress.require('../../../../../support/page_objects/registerAccountPage')
            onRegisterAccountPage.checkAllElement()
        })
    })


    it('should form register mengeluarkan pesan validasi form', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, { args: { userEmail } }, ({ userEmail }) => {
            const { onRegisterAccountPage } = Cypress.require('../../../../../support/page_objects/registerAccountPage')
            onRegisterAccountPage.fillInTheField("email", "test.gmail.com")
            onRegisterAccountPage.checkInvalidEmail()
            onRegisterAccountPage.clearField('email')
            onRegisterAccountPage.fillInTheField("email", userEmail)
            onRegisterAccountPage.sendVerificationCode()
        })
        emailCount += 1
        recurse(
            () => cy.request({
                method: 'GET',
                url: `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
            }),
            (res) => res.body.list.length > emailCount,
            {
                delay: 5000,
                timeout: 60000,
                log: false
            }
        )
        cy.getOTPEmail().then(code => {
            // Use DOMParser to parse the HTML content
            cy.origin(`${Cypress.env('B2C_URL')}`, { args: { code } }, ({ code }) => {
                const { onRegisterAccountPage } = Cypress.require('../../../../../support/page_objects/registerAccountPage')
                onRegisterAccountPage.fillInTheField('emailVerificationCode', code)
                onRegisterAccountPage.pressTheButton('emailVerificationControl_but_verify_code')

                onRegisterAccountPage.fillInTheField('newPassword', 'Tes123!')
                cy.contains('The password must be between 8 and 64 characters.').should('be.visible')
                //format password
                onRegisterAccountPage.clearField('newPassword')
                onRegisterAccountPage.fillInTheField('newPassword', 'qwerty123!')
                onRegisterAccountPage.checkPasswordFormat()
                //format password
                onRegisterAccountPage.clearField('newPassword')
                onRegisterAccountPage.fillInTheField('newPassword', 'QWERTY123!')
                onRegisterAccountPage.checkPasswordFormat()
                //format password
                onRegisterAccountPage.clearField('newPassword')
                onRegisterAccountPage.fillInTheField('newPassword', 'Qwerty123')
                onRegisterAccountPage.checkPasswordFormat()
                //konfirmasi password berbeda
                onRegisterAccountPage.clearField('newPassword')
                onRegisterAccountPage.fillInTheField('newPassword', 'Qwerty123!')
                onRegisterAccountPage.fillInTheField('reenterPassword', 'Qwerty1234!')
                cy.contains('The password entry fields do not match. Please enter the same password in both fields and try again.').should('be.visible')
                //konfirmasi password kosong
                onRegisterAccountPage.clearField('reenterPassword')
                onRegisterAccountPage.pressTheButton('continue')
                cy.contains('The password entry fields do not match. Please enter the same password in both fields and try again.').should('be.visible')
            })
        })
    })


    it('should user can melakukan registrasi akun', () => {
        cy.origin(`${Cypress.env('B2C_URL')}`, { args: { userEmail } }, ({ userEmail }) => {
            const { onRegisterAccountPage } = Cypress.require('../../../../../support/page_objects/registerAccountPage')
            onRegisterAccountPage.fillInTheField("email", userEmail)
            onRegisterAccountPage.sendVerificationCode()
        })
        emailCount += 1
        recurse(
            () => cy.request({
                method: 'GET',
                url: `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
            }),
            (res) => res.body.list.length > emailCount,
            {
                delay: 5000,
                timeout: 60000,
                log: false
            }
        )
        cy.getOTPEmail().then(code => {
            cy.origin(`${Cypress.env('B2C_URL')}`, { args: { code } }, ({ code }) => {
                const { onRegisterAccountPage } = Cypress.require('../../../../../support/page_objects/registerAccountPage')
                onRegisterAccountPage.fillInTheField('emailVerificationCode', code)
                onRegisterAccountPage.pressTheButton('emailVerificationControl_but_verify_code')
                onRegisterAccountPage.fillInTheField('newPassword', 'Qwerty123!')
                onRegisterAccountPage.fillInTheField('reenterPassword', 'Qwerty123!')
                onRegisterAccountPage.fillInTheField('givenName', 'QA RGB')
                onRegisterAccountPage.pressTheButton('continue')
            })
        })

        cy.contains('Anda telah berhasil masuk!').should('be.visible')
        cy.contains('button', 'Kembali to Beranda').should('be.visible').click()
    })

    after('Post test processes', () => {
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
        cy.writeFile('cypress/fixtures/WEB/auth/emailcounts.json', { emailSent: emailCount })
    })
})