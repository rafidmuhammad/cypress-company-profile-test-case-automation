export class TermsAndConditionPage {

    validatePagePath() {
        cy.location('pathname').should('contain', 'techspaces_rules')
    }

    validateTitle(locale) {
        if (locale === 'id') {
            cy.get('h1').should('contain', 'TECHSPACE Terms & Conditions').and('be.visible')
        }
        else if (locale === 'en') {
            cy.get('h1').should('contain', 'TECHSPACE Terms & Conditions').and('be.visible')
        }
    }

    validateEachDropdownTitle(locale) {
        const title = ['Umum', 'Pendaftaran dan Kepesertaan', 'Tahapan TechSpace', 'Ide dan Produk',
            'Hadiah', 'Informasi, Rekaman, dan Materi Peserta', 'Logistik Peserta', 'Hak Kekayaan Intelektual',
            'Tindakan Selama Pelaksanaan Kegiatan TechSpace', 'Hukum yang Berlaku']

        const title_en = ['General', 'Registration and Participation', 'TechSpace Stages', 'Ideas And Products',
            'Winning Prizes', 'Participant Information, Records And Materials', 'Participant Logistics', 'Intellectual Property Rights',
            'Actions During The Implementation Of TechSpace Activities', 'Applicable Law']

        cy.get('.mantine-Accordion-item').each((item, index) => {
            if (locale === 'id') {
                cy.wrap(item).should('contain', title[index]).and('be.visible')
            }
            else if (locale === 'en') {
                cy.wrap(item).should('contain', title_en[index]).and('be.visible')
            }
        })

    }

    openDropdown() {
        cy.get('.mantine-Accordion-item').each(item => {
            cy.wrap(item).find('button').click()
            cy.wrap(item).find('button').invoke('attr', 'aria-expanded').should('equal', 'true')
            cy.wrap(item).find('.mantine-Accordion-panel').invoke('attr', 'aria-hidden').should('equal', 'false')
            cy.wrap(item).find('.mantine-Accordion-content').should('be.visible')
        })
    }

    closedDropdown() {
        cy.get('.mantine-Accordion-item').each(item => {
            cy.wrap(item).find('button').click()
            cy.wrap(item).find('button').invoke('attr', 'aria-expanded').should('equal', 'false')
            cy.wrap(item).find('.mantine-Accordion-panel').invoke('attr', 'aria-hidden').should('equal', 'true')
            cy.wrap(item).find('.mantine-Accordion-content').should('not.be.visible')
        })
    }

    validateForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Informasi Lebih Lanjut').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('@techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Klik di sini')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Further information').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('techspaces@techcorp.com')
            cy.get('@informasi').parent().contains('@techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Click here')
        }
    }

}

export const onTermsAndConditionPage = new TermsAndConditionPage()