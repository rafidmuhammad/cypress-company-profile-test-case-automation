export class ContactUsPage {
    checkDescription(locale) {
        cy.contains(locale === "id" ? "Kami ingin mendengar pendapat Anda" : locale === "en" ? "We want to hear what you think" : -1).should('be.visible')
    }
    checkAddress() {
        cy.contains("Altira Business Park D.01-02 Jl. Yos Sudarso Kav 85, RT.10/RW.11, Sunter Jaya, Kec. Tj. Priok, Kota Jkt Utara, Daerah Khusus Ibukota Jakarta 14350").should('be.visible')
    }
    checkPhoneNumber() {
        cy.contains("+6221 8823 58").should('be.visible')
    }
    checkEmailAddress() {
        cy.contains("hello@techcorp.id").should('be.visible')
    }
    clickLinkedIn() {
        cy.get('[data-cy="contact-address"] [title="LinkedIn TechCorp Digital"]').invoke('removeAttr', 'target').click()
        cy.origin('https://www.linkedin.com/', () => {
            cy.location('pathname').should('eq', '/company/pt-techcorp-digital-internasional/')
        })
    }
    clickYoutube() {
        cy.get('[data-cy="contact-address"] [title="Youtube TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.youtube.com/@techcorp')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }
    clickTiktok() {
        cy.get('[data-cy="contact-address"] [title="Tiktok TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.tiktok.com/@techcorpid')
            cy.request(element.prop('href')).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }
    clickInstagram() {
        cy.get('[data-cy="contact-address"] [title="Instagram TechCorp Digital"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://www.instagram.com/techcorpid/')
            cy.request({
                url: 'http://www.instagram.com/techcorpid/',
                method: 'GET'
            }).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }
    //NOTE: Cannot validate in the google maps due to infinite loads as it streams for real time data 
    clickMaps(locale) {
        cy.get('[data-cy="contact-address"]').contains(locale === "id" ? "Lihat Lokasi" : locale === "en" ? "View Location" : -1).then(element => {
            cy.wrap(element.prop('href')).should('equal', 'https://maps.app.goo.gl/mQPJ1iqWVDXtCG1XA')
            cy.request({
                url: element.prop('href'),
                method: 'GET'
            }).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })

    }
}

export const onContactUsPage = new ContactUsPage()