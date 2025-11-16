// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('LoginToCMS', (account) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('API_URL')}admin/login`,
        body: account
    }).then(response => {
        window.localStorage.setItem('authToken', response.body.data.token)
        expect(response.status).to.equal(200)
    })

})

Cypress.Commands.add('LoginToTechSpace', (locale) => {
    const { onHeaderBar } = require('../support/page_objects/headerBar')
    cy.visit('/techspaces')
    onHeaderBar.openBurgerMenu(false)
    onHeaderBar.clickMasuk(locale)

    cy.origin(`${Cypress.env('B2C_URL')}`, () => {
        const { onLoginPage } = Cypress.require('../support/page_objects/loginPage')
        onLoginPage.submitWithEmailandPassword(Cypress.env('testEmail'), Cypress.env('testPassword'))
    })
    cy.wait(1000)
    cy.contains('Kembali ke Beranda').click()

})

Cypress.Commands.add('openHomepage', () => {
    cy.visit('/techspaces')
})

// Access element whose parent is hidden
Cypress.Commands.add('isVisible', {
    prevSubject: true
}, (subject) => {
    const isVisible = (elem) => !!(
        elem.offsetWidth ||
        elem.offsetHeight ||
        elem.getClientRects().length
    )
    expect(isVisible(subject[0])).to.be.true
})

//is within viewport
Cypress.Commands.add('isWithinViewport', {
    prevSubject: true
}, (element) => {
    const rect = element[0].getBoundingClientRect()
    cy.window().then((win) => {
        const isWithinViewport = (elem) => (
            elem.top >= 0 &&
            elem.left >= 0 &&
            elem.bottom <= win.innerHeight &&
            elem.right <= win.innerWidth
        )
        return isWithinViewport(rect)
    })

})

Cypress.Commands.add('logOut', () => {
    const { onHeaderBar } = require('../support/page_objects/headerBar')
    onHeaderBar.openBurgerMenu(true, "id")
    onHeaderBar.clickKeluar()
    onHeaderBar.confirmKeluar()
})

Cypress.Commands.add('changeToEnglish', (isLoggedIn, burgerType) => {
    const { onHeaderBar } = require('../support/page_objects/headerBar')

    burgerType === 'AD' ? onHeaderBar.openBurgerMenuAD("id") : burgerType === "AN" ? onHeaderBar.openBurgerMenu(isLoggedIn, "id") : -1
    onHeaderBar.changeToEnglish()
})

Cypress.Commands.add('getNewEmail', () => {
    cy.request({
        method: 'GET',
        url: 'https://api.guerrillamail.com/ajax.php?f=get_email_address&lang=en&site=guerrillamail.com'
    }).then(response => {
        cy.writeFile('cypress/fixtures/WEB/auth/emailAccountData.json', response.body)
    })
})

Cypress.Commands.add('getOTPEmail', () => {
    const { extractOTPCode } = require('../support/helper/extractOTPCode');
    cy.fixture('WEB/auth/emailAccountData.json').then(testData => {
        const sid_token = testData.sid_token
        cy.request({
            method: 'GET',
            url: `https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sid_token}`
        }).then(response => {
            cy.request({
                method: 'GET',
                url: `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${response.body.list[0].mail_id}&sid_token=${sid_token}`
            }).then(response_new => {
                const code = extractOTPCode(response_new.body.mail_body)
                cy.log(code)
                return cy.wrap(code)
            })
        })
    })
})