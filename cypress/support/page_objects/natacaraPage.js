export class NatacaraPage {

    validatePagePath() {
        cy.location('pathname').should('contain', 'natacara')
    }

}

export const onNatacaraPage = new NatacaraPage()