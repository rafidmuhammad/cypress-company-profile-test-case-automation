const { toPascalCase } = require('../helper/toPascalCase');

export class BusinessChallengePage {

    checkPagePath() {
        cy.location('pathname').should('contain', 'business-challenge')
    }

    checkPageContent() {
        cy.contains('COMING SOON').should('be.visible')
        cy.contains('Halaman yang anda cari sedang dalam proses peluncuran, silahkan cari informasi lain nya di Beranda kami').should('be.visible')
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



    clickTargetMarket() {
        cy.get('.mantine-Tabs-list').contains('Target Market').click()
    }

    clickBusinessChallenge(locale) {
        if (locale === 'id') {
            cy.get('.mantine-Tabs-list').contains('Tantangan Bisnis Saat Ini').click()
        }
        else if (locale === 'en') {
            cy.get('.mantine-Tabs-list').contains('Current Business Challenge').click()
        }
    }

    clickExpectedSolution(locale) {
        locale === 'id' ? cy.get('.mantine-Tabs-list').contains('Solusi yang Diharapkan').click() : locale === 'en' ? cy.get('.mantine-Tabs-list').contains('Expected Solution').click() : -1
    }

    checkTargetMarketInViewport(data, order) {
        cy.get('#target-market').isWithinViewport()
        cy.get('#target-market').find('img').should('be.visible')
        cy.get('#target-market').should('contain', 'Target Market').and('contain', data[order].attributes.businessChallenge[0].companyTargetMarket[0].title).and('contain', data[order].attributes.businessChallenge[0].companyTargetMarket[0].description)
    }

    checkCurrentBusinessChallenge(data, order, locale) {
        cy.get('#current-business-challenge').isWithinViewport()
        locale === 'id' ? cy.get('#current-business-challenge').should('contain', 'Tantangan Bisnis Saat Ini') : locale === 'en' ? cy.get('#current-business-challenge').should('contain', 'Current Business Challenge') :
            cy.get('#current-business-challenge .BusinessChallengePage_businessCarousel__5jRyN').each((item, index) => {
                if (locale === 'id') {
                    cy.wrap(item).should('contain', data[order].attributes.businessChallenge[0].companyCurrentBusinessChallenge[index].title_id)
                        .and('contain', data[order].attributes.businessChallenge[0].companyCurrentBusinessChallenge[index].description_id)
                }
                else if (locale === 'en') {
                    cy.wrap(item).should('contain', data[order].attributes.businessChallenge[0].companyCurrentBusinessChallenge[index].title_en)
                        .and('contain', data[order].attributes.businessChallenge[0].companyCurrentBusinessChallenge[index].description_en)
                }
            })
    }

    checkExpectedSolution(data, order, locale) {
        cy.get('#expected-solution').isWithinViewport()
        locale === 'id' ? cy.get('#expected-solution').should('contain', 'Solusi yang Diharapkan') : locale === 'en' ? cy.get('#expected-solution').should('contain', 'Expected Solution') : -1
        cy.get('#expected-solution h4').each((item, index) => {
            if (locale === 'id') {
                cy.wrap(item).should('contain', data[order].attributes.businessChallenge[0].companyExpectedSolution[index].title_id)
                cy.wrap(item).parent().should('contain', data[order].attributes.businessChallenge[0].companyExpectedSolution[index].description_id)
            }
            else if (locale === 'en') {
                cy.wrap(item).should('contain', data[order].attributes.businessChallenge[0].companyExpectedSolution[index].title_en)
                cy.wrap(item).parent().should('contain', data[order].attributes.businessChallenge[0].companyExpectedSolution[index].description_en)
            }

        })
    }

    clickSubmit() {
        cy.get('[data-cy="register"]').click()
    }

    checkModalPendaftaranTutup(locale) {
        if (locale === 'id') {
            cy.contains('Mohon maaf saat ini pendaftaran ditutup').should('be.visible')
            cy.get('.CustomModal_container__Ugh4H button').contains('Kembali').should('be.visible')
        }
        else if (locale === 'en') {
            cy.contains('Sorry, registration is currently closed').should('be.visible')
            cy.get('.CustomModal_container__Ugh4H button').contains('Back').should('be.visible')
        }

    }

    clickCloseModal() {
        cy.get('header').find('button').click()
    }

    clickCompanyFromTab(tab) {
        cy.get('.BusinessChallengePage_companyContainer__qRqzo').find('a').eq(tab).click()
    }

    checkBreadCrumbs(tab) {
        cy.get('.BusinessChallengePage_companyContainer__qRqzo').find('a').eq(tab).invoke('text').then(companyName => {
            let companyNamePascalCase = toPascalCase(companyName)
            cy.get('[class="CustomBreadcrumbs_breadcrumbRoot__LMJCl m-8b3717df mantine-Breadcrumbs-root"]').should('contain', companyNamePascalCase)
        })
    }
}


export const onBusinessChallengePage = new BusinessChallengePage()