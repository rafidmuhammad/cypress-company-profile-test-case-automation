export class AnnouncementPage {

    validatePagePath() {
        cy.location('pathname').should('contain', 'techspaces_updates')
    }

    validateTitle(locale) {
        locale === 'id' ? cy.get('[data-cy="title"]').should('contain', 'Pengumuman Pemenang & Finalis') : locale === 'en' ? cy.get('[data-cy="title"]').should('contain', 'Announcement of Winners & Finalists') : -1
    }

    checkWinnerTitle(locale) {
        locale === 'id' ? cy.get('[data-cy="winner-title"]').should('contain', 'Pemenang TechSpace') : locale === 'en' ? cy.get('[data-cy="winner-title"]').should('contain', 'TechSpace Winner') : -1
    }

    checkYearSelect() {
        cy.get('[data-cy="year-select"]').invoke('val').should('contain', "2024")
    }

    checkWinnerTab() {
        cy.get('[data-cy="winner-desktop-tabs"]').should('be.visible')
            .and('contain', 'Startup Track')
            .and('contain', 'Student Track')
            .and('contain', 'Business Challenge')
    }

    selectOtherYearAnnouncement() {
        cy.get('[data-cy="year-select"]', { timeout: 5000 }).click({ force: true })
        cy.get('.AnnouncementPage_selectOption__kOQE3[role="option"]').eq(1).click()
    }

    clickWinnerStartUpTab() {
        cy.get('[data-cy="winner-desktop-tabs"]').contains('Startup Track').click()
    }

    clickWinnerStudentTab() {
        cy.get('[data-cy="winner-desktop-tabs"]').contains('Student Track').as('winnerStudentTab').click()
        cy.get('@winnerStudentTab').invoke('attr', 'aria-selected').should('equal', 'true')
    }

    checkWinnerCard(order, title, description, locale) {
        cy.get(`[data-cy="winner-desktop-card-${order}"]`).should('be.visible')
        cy.get(`[data-cy="winner-desktop-card-${order}"]`).find('[alt="medal"]').invoke('attr', 'src').should('not.be.empty')
        cy.get(`[data-cy="winner-desktop-card-${order}"]`).find(locale === "id" ? '[alt="Pemenang TechSpace"]' : locale === "en" ? '[alt="TechSpace Winner"]' : -1).invoke('attr', 'src').should('not.be.empty')
        cy.get(`[data-cy="winner-desktop-card-${order}"]`).find('h3').invoke('text').should('equal', title)
        if (description !== null) {
            cy.get(`[data-cy="winner-desktop-card-${order}"]`).find('p').invoke('text').should('contain', description)
        }
    }

    checkFinalistTitle(locale) {
        locale === 'id' ? cy.get('[data-cy="finalist-title"]').should('contain', 'Daftar Finalis') : locale === 'en' ? cy.get('[data-cy="finalist-title"]').should('contain', 'List of Finalists') : -1
    }

    checkFinalisTab() {
        cy.get('[data-cy="finalist-desktop-tabs"]').should('be.visible')
            .and('contain', 'Startup Track')
            .and('contain', 'Student Track')
            .and('contain', 'Business Challenge')
    }

    clickFinalisStartUpTab() {
        cy.get('[data-cy="finalist-desktop-tabs-startup"]').click()
    }

    clickFinalisStudentTab() {
        cy.get('[data-cy="finalist-desktop-tabs-student"]').as('finalistStudentTab').click()
        cy.get('@finalistStudentTab').invoke('attr', 'aria-selected').should('equal', 'true')
    }

    checkFinalistCard(order, title, description, locale) {
        cy.get('[data-cy="finalist-content-wrapper"]').find('.CustomCard_card__8y2Ua').as('finalist-cards')
        cy.get('@finalist-cards').eq(order).should('be.visible')
        cy.get('@finalist-cards').eq(order).find(locale === "id" ? '[alt="Pemenang TechSpace"]' : locale === "en" ? '[alt="TechSpace Winner"]' : -1).invoke('attr', 'src').should('not.be.empty')
        cy.get('@finalist-cards').eq(order).find('h3').invoke('text').should('equal', title)
        if (description !== null) {
            cy.get('@finalist-cards').eq(order).find('p').invoke('text').should('contain', description)
        }
    }

    checkForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Punya Pertanyaan?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parent().find('button').contains('Klik di sini').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Have Questions?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Click here')
        }
    }

    checkAbsenceOfPemenang() {
        cy.get('[data-cy="winner-content-wrapper"] .CustomCard_card__8y2Ua').should('not.exist')
        cy.get('[data-cy="winner-title"]').should('not.exist')
        cy.get('[data-cy="winner-desktop-tabs"]').should('not.exist')
    }

}

export const onAnnouncementPage = new AnnouncementPage()