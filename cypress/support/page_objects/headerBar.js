

export class HeaderBar {

    checkHeaderBarLogo() {
        cy.get('img[alt="TechCorp"]').should('be.visible')
            .and('have.attr', 'src').and('match', /\/_next\/static\/media\/logo-techcorp.*/)
        cy.get('img[alt="One Nation"]').should('be.visible')
            .and('have.attr', 'src').and('match', /\/_next\/static\/media\/logo-one-nation.*/)
        cy.get('img[alt="TechCorp Digital"]').should('be.visible')
            .and('have.attr', 'src').and('match', /\/_next\/static\/media\/logo-techcorp-digital.*/)
        cy.get('button.mantine-Burger-root').should('be.visible')
    }

    clickOneNationLogo() {
        cy.get('a[title="TechCorp One Nation"]').click()
        cy.origin('https://www.techcorp.com/', () => {
            cy.url().should('eq', 'https://www.techcorp.com/')
        })
    }

    clickTechCorpLogo() {
        cy.get('a[title="TechCorp"]').click()
        cy.origin('https://www.techcorp.com/', () => {
            cy.url().should('eq', 'https://www.techcorp.com/')
        })

    }

    clickTechCorpDigitalLogo() {
        cy.get('a[title="TechCorp Digital"]').click()
        cy.wait(2000)
        cy.url().should('eq', 'https://qa.techcorp.com/')

    }

    openBurgerMenu(isLoggedIn, locale) {
        cy.get('button.mantine-Burger-root').click()
        cy.contains('TechCorp Digital').should('be.visible').as('techCorpDigital')
        cy.contains('TechSpace').should('be.visible').as('techSpaceMenu')

        if (locale === "id") {
            cy.contains('Contact Us').should('be.visible').as('contactUs')
            if (!isLoggedIn) {
                cy.contains('Register').should('be.visible').as('register')
                cy.contains('Login').should('be.visible').as('login')
            }
            else {
                cy.contains('My Account').should('be.visible')
                cy.contains('Logout').should('be.visible')
            }
        }
        else if (locale === 'en') {
            cy.contains('Contact us').should('be.visible').as('contactUs')
            if (!isLoggedIn) {
                cy.contains('Register').should('be.visible').as('register')
                cy.contains('Login').should('be.visible').as('login')
            }
            else {
                cy.contains('My Account').should('be.visible')
                cy.contains('Logout').should('be.visible')
            }
        }

        cy.get('[title="LinkedIn TechCorp Digital"]').should('be.visible')
        cy.get('[title="Youtube TechCorp Digital"]').should('be.visible')
        cy.get('[title="Tiktok TechCorp Digital"]').should('be.visible')
        cy.get('[title="Instagram TechCorp Digital"]').should('be.visible')
    }

    openBurgerMenuAD(locale) {
        cy.get('button.mantine-Burger-root').click()
        cy.contains('TechCorp Digital').should('be.visible').as('techCorpDigital')
        cy.contains('TechSpace').should('be.visible').as('techSpaceMenu')

        if (locale === "id") {
            cy.contains('Contact Us').should('be.visible').as('contactUs')
        }
        else if (locale === 'en') {
            cy.contains('Contact us').should('be.visible').as('contactUs')
        }
        cy.contains('Register').should('not.exist')
        cy.contains('Login').should('not.exist')
        cy.contains('My Account').should('not.exist')
        cy.contains('Logout').should('not.exist')
        cy.contains('Register').should('not.exist')
        cy.contains('Login').should('not.exist')
        cy.contains('My Account').should('not.exist')
        cy.contains('Logout').should('not.exist')
        cy.get('[title="LinkedIn TechCorp Digital"]').should('be.visible')
        cy.get('[title="Youtube TechCorp Digital"]').should('be.visible')
        cy.get('[title="Tiktok TechCorp Digital"]').should('be.visible')
        cy.get('[title="Instagram TechCorp Digital"]').should('be.visible')
    }




    changeToEnglish() {
        cy.get('.MainHeader_language__zP7qs').find('button').contains('EN').click()
    }

    openTechCorpDigitalMenu(locale) {
        cy.get('@techCorpDigital').click()
        if (locale === "id") {
            cy.contains('Homepage').should('be.visible')
            cy.contains('About Us').should('be.visible')
            cy.contains('Our Services').should('be.visible')
            cy.contains('Portfolio').should('be.visible')
            cy.contains('Article').should('be.visible')
        }
        else if (locale === 'en') {
            cy.contains('Homepage').should('be.visible')
            cy.contains('About Us').should('be.visible')
            cy.contains('Our Services').should('be.visible')
            cy.contains('Portfolio').should('be.visible')
            cy.contains('Article').should('be.visible')
        }
    }

    navigateToHomepage(locale) {
        cy.contains('Homepage').click()
        cy.url().should('eq', 'https://qa.techcorp.com/')
    }

    navigateToAboutUs(locale) {
        cy.contains('About Us').click()
        cy.location('pathname').should('eq', '/about')
    }

    navigateToOurServices(locale) {
        cy.contains('Our Services').click()
        cy.location('pathname').should('eq', '/service')
    }

    navigateToPortfolio(locale) {
        cy.contains('Portfolio').click()
        cy.location('pathname').should('eq', '/portfolio')
    }

    navigateToArticle(locale) {
        cy.contains('Article').click()
        cy.location('pathname').should('eq', '/article')
    }


    openTechSpaceMenu(isWithinProposal = false, locale) {
        cy.get('@techSpaceMenu').click()
        if (locale === "id") {
            cy.contains('About TechSpace').should('be.visible')
            cy.contains('Rules').should('be.visible')
            cy.contains('Announcement').should('be.visible')
            cy.contains('TechSpace Conference').should('be.visible')
            cy.contains('Past Event').should('be.visible')
            if (isWithinProposal) {
                cy.contains('Submission Form').should('be.visible')
            }
        }
        else if (locale === 'en') {
            cy.contains('About TechSpace').should('be.visible')
            cy.contains('Rules').should('be.visible')
            cy.contains('Announcement').should('be.visible')
            cy.contains('TechSpace Conference').should('be.visible')
            cy.contains('Past Event').should('be.visible')
            if (isWithinProposal) {
                cy.contains('Submission Form').should('be.visible')
            }
        }


    }


    navigateToContactUs() {
        cy.get('@contactUs').click()
        cy.location('pathname').should('eq', '/contact')
    }

    clickRegister() {
        cy.get('@register').click()
    }

    clickLogin(locale) {
        cy.contains('Login').click()
    }

    clickMyAccount(locale) {
        cy.contains('My Account').click()
    }

    clickLogout() {
        cy.contains('Logout').click()
    }

    confirmLogout() {
        cy.get(".mantine-Modal-body").find('button').eq(0).should('contain', "Logout").click()
    }

    navigateToAboutTechSpaceThroughBurger(locale) {
        cy.contains('About TechSpace').click()
        cy.url().should('eq', Cypress.config('baseUrl') + "/techspace")
    }

    navigateToRulesThroughBurger(locale) {
        cy.contains('Rules').click()
    }

    navigateToPastEventThroughBurger(locale) {
        cy.contains('Past Event').click()
    }

    navigateToAnnouncementThroughBurger(locale) {
        cy.contains('Announcement').click()
    }

    navigateToConferenceThroughBurger(locale) {
        cy.contains('TechSpace Conference').click()
    }

    navigateToEventRegistrationThroughBurger(locale) {
        cy.contains('Submission Form').click()
    }


    clickLinkedIn() {
        cy.get('[title="LinkedIn TechCorp Digital"]').invoke('removeAttr', 'target').eq(0).click()
        cy.origin('https://www.linkedin.com/', () => {
            cy.location('pathname').should('eq', '/company/techcorp-digital-international/')
        })

    }

    clickYoutube() {
        cy.get('[title="Youtube TechCorp Digital"]').eq(0).then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.youtube.com/@techcorpdigital')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickTiktok() {
        cy.get('[title="Tiktok TechCorp Digital"]').eq(0).then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.tiktok.com/@techcorpdigitalid')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickInstagram() {
        cy.get('[title="Instagram TechCorp Digital"]').eq(0).then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.instagram.com/techcorpdigitalid/')
            cy.request({
                url: 'http://www.instagram.com/techcorpdigitalid/',
                method: 'GET'
            }).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickTermsPrivacy(locale) {
        cy.contains('Terms & Privacy').click()
    }
}

export const onHeaderBar = new HeaderBar()