export class ComingSoonPage {

    checkPageContent() {
        cy.contains('COMING SOON').should('be.visible')
        cy.contains('Halaman yang anda cari sedang dalam proses peluncuran, silahkan cari informasi lain nya di Beranda kami').should('be.visible')
    }

}

export const onComingSoonPage = new ComingSoonPage()