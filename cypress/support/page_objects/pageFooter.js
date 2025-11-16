export class PageFooter {
    checkAllComponents(locale) {
        if (locale === 'id') {
            cy.get('[data-cy="footer"]').contains('Tentang Kami').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Layanan Kami').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Portofolio').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Kontak Kami').should('be.visible')
        }
        else if (locale === 'en') {
            cy.get('[data-cy="footer"]').contains('About Us').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Our Services').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Portfolio').should('be.visible')
            cy.get('[data-cy="footer"]').contains('Contact Us').should('be.visible')
        }
        cy.get('[data-cy="footer"]').contains('TechSpace').should('be.visible')
        cy.get('[data-cy="footer"]').contains('Natacara').should('be.visible')
        cy.get('[data-cy="footer"]').contains('FAQ').should('be.visible')
        cy.get('[data-cy="footer"]').contains('Blog').should('be.visible')
        cy.get('[data-cy="footer"] [title="LinkedIn TechCorp Digital"]').should('be.visible')
        cy.get('[data-cy="footer"] [title="Youtube TechCorp Digital"]').should('be.visible')
        cy.get('[data-cy="footer"] [title="Tiktok TechCorp Digital"]').should('be.visible')
        cy.get('[data-cy="footer"] [title="Instagram TechCorp Digital"]').should('be.visible')
    }

    clickTechCorpDigitalAcademy() {
        cy.get('[data-cy="footer"]').contains('TechCorp Digital Academy').click()
    }

    clickTechSpace() {
        cy.get('[data-cy="footer"]').contains('TechSpace').click()
        cy.url().should('eq', Cypress.config('baseUrl') + "/techspaces")
    }

    clickFAQ() {
        cy.get('[data-cy="footer"]').contains('FAQ').click()
        cy.location('pathname').should('eq', '/contact')
    }

    clickBlog() {
        cy.get('[data-cy="footer"]').contains('Blog').click()
        cy.location('pathname').should('eq', '/article')
    }

    clickNatacara() {
        //NOTE: Error from web natacara
        cy.origin('https://natacara.id', () => {
            cy.on('uncaught:exception', (e) => {
                if (e.message.includes('GTM is not defined')) {
                    // we expected this error, so let's ignore it
                    // and let the test continue
                    return false
                }
            })
        })

        cy.get('[data-cy="footer"]').contains('Natacara').click()
        cy.origin('https://natacara.id/', () => {
            cy.url().should('eq', 'https://natacara.id/tentangkami')
        })

    }

    clickBantuan() {
        cy.get('[data-cy="footer"]').contains('Bantuan').click()
    }

    clickTentangKami(locale) {
        locale === "id" ? cy.get('[data-cy="footer"]').contains('Tentang Kami').click() : locale === "en" ? cy.get('[data-cy="footer"]').contains('About Us').click() : -1
        cy.location('pathname').should('eq', '/about')
    }

    clickPelayanan(locale) {
        locale === "id" ? cy.get('[data-cy="footer"]').contains('Layanan Kami').click() : locale === "en" ? cy.get('[data-cy="footer"]').contains('Our Services').click() : -1
        cy.location('pathname').should('eq', '/service')
    }

    clickKaryaKami(locale) {
        locale === "id" ? cy.get('[data-cy="footer"]').contains('Portofolio').click() : locale === "en" ? cy.get('[data-cy="footer"]').contains('Portfolio').click() : -1
        cy.location('pathname').should('eq', '/portfolio')
    }

    clickKontakKami(locale) {
        locale === "id" ? cy.get('[data-cy="footer"]').contains('Kontak Kami').click() : locale === "en" ? cy.get('[data-cy="footer"]').contains('Contact Us').click() : -1
        cy.location('pathname').should('eq', '/contact')
    }

    clickKetentuandanPrivasi(locale) {
        locale === "id" ? cy.get('[data-cy="footer"]').contains('Ketentuan & Privasi').click() : locale === "en" ? cy.get('[data-cy="footer"]').contains('Terms & Privacy').click() : -1
    }

    clickCookies() {
        cy.get('[data-cy="footer"]').contains('Cookies').click()
    }

    clickLinkedIn() {
        cy.get('[data-cy="footer"] [title="LinkedIn TechCorp Digital"]').invoke('removeAttr', 'target').click()
        cy.origin('https://www.linkedin.com/', () => {
            cy.location('pathname').should('eq', '/company/pt-techcorp-digital-internasional/')
        })
    }

    clickYoutube() {
        cy.get('[data-cy="footer"] [title="Youtube TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.youtube.com/@techcorp')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickTiktok() {
        cy.get('[data-cy="footer"] [title="Tiktok TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.tiktok.com/@techcorpid')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickInstagram() {
        cy.get('[data-cy="footer"] [title="Instagram TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.instagram.com/techcorpid/')
            cy.request({
                url: 'http://www.instagram.com/techcorpid/',
                method: 'GET'
            }).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }
}

export const onPageFooter = new PageFooter()