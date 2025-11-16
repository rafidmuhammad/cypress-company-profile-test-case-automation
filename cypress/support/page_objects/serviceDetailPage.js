export class ServiceDetailPage {
    checkVideoBanner() {
        cy.get('iframe').should('be.visible')
        cy.get('iframe').should('have.attr', 'src')
        cy.get('iframe').invoke('attr', 'src').should('not.be.empty')
    }

    checkBannerTitle(bannerTitle, locale) {
        cy.get('[data-cy="titleBanner"]').should('contain', locale === 'id' ? bannerTitle.name_id : locale === 'en' ? bannerTitle.name_en : -1).and('be.visible')
    }

    checkUrl(slug) {
        cy.url().should('contain', `/service/${slug}`)
    }

    checkCoreCard(data, locale) {
        cy.get('[data-cy="core-value-card"]').each((item, index) => {
            cy.wrap(item).should('contain', locale === 'id' ? data.ourCoreValues[index].title_id : locale === 'en' ? data.ourCoreValues[index].title_en : -1).and('be.visible')
            cy.wrap(item).should('contain', locale === 'id' ? data.ourCoreValues[index].description_id : locale === 'en' ? data.ourCoreValues[index].description_en : -1).and('be.visible')
        })
    }

    checkForMoreInformation(locale) {
        if (locale === 'id') {
            cy.contains('h2', 'Punya Pertanyaan?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('hello@techcorp.id')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parent().find('button').contains('Klik di sini').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
        }
        else if (locale === 'en') {
            cy.contains('h2', 'Have Questions?').as('informasi').should('be.visible')
            cy.get('@informasi').parent().contains('hello@techcorp.id')
            cy.get('@informasi').parent().contains('techcorpid')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
            cy.get('@informasi').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
            cy.get('@informasi').parent().find('button').should('contain', 'Click here')
        }
    }


    clickNextCoreCards() {
        cy.get('[data-cy="carouselValues"]').find('button[tabindex="0"]').click()
    }

    checkNextCoreCards(data, locale) {
        cy.get('[data-cy="core-value-card"]').eq(3).should('contain', locale === 'id' ? data.ourCoreValues[3].title_id : locale === 'en' ? data.ourCoreValues[3].title_en : -1).and('be.visible')
        cy.get('[data-cy="core-value-card"]').eq(3).should('contain', locale === 'id' ? data.ourCoreValues[3].description_id : locale === 'en' ? data.ourCoreValues[3].description_en : -1).and('be.visible')
    }

    checkOfferingsShouldNotExist() {
        cy.get('[data-cy="offering-wrapper"]').should('not.exist')
    }

    checkValuesShouldNotExist() {
        cy.get('[data-cy="values-wrapper"]').should('not.exist')
    }

    checkOfferingCards(data, locale) {
        cy.get('[data-cy="offering-title"]').should('be.visible').and('contain', locale === 'id' ? "Penawaran Kami" : locale === 'en' ? "Our Offerings" : -1)
        cy.get('[data-cy="offering-carousel"]').should('be.visible')
        cy.get('[data-cy="offering-text"]').each((item, index) => {
            cy.wrap(item).should('contain', locale === 'id' ? data.ourOfferings[index].description_id : locale === 'en' ? data.ourOfferings[index].description_en : -1).and('be.visible')
        })
    }

    clickNextOfferingCards() {
        cy.get('[data-cy="offering-title"]').parent().find('button[tabindex="0"]').click()
    }

    checkNextOfferingCards(data, locale) {
        cy.get('[data-cy="offering-text"]').eq(3).should('contain', locale === 'id' ? data.ourOfferings[3].description_id : locale === 'en' ? data.ourOfferings[3].description_en : -1).and('be.visible')
    }

    checkPortoCards(data, locale) {
        cy.log(data)
        cy.get('[data-cy="portofolio-title"]').should('be.visible')
        cy.get('[data-cy="portofolio-carousel"]').should('be.visible')
        cy.get('[data-cy="portofolio-carousel"]').find('.CustomCard_card__ARBgw').each((item, index) => {
            cy.wrap(item).should('contain', data.techcorpPortfolio[index].title)
            cy.wrap(item).click()
            if (data.techcorpPortfolio[index].short_description_id !== null || data.techcorpPortfolio[index].short_description_en !== null) {
                cy.wrap(item).should('contain', locale === 'id' ? data.techcorpPortfolio[index].short_description_id : locale === 'en' ? data.techcorpPortfolio[index].short_description_en : -1)
            }
            else {
                cy.wrap(item).find('p').invoke('text').should('be.empty')
            }

            if (data.techcorpPortfolio[index].ifHasDetail !== null) {
                cy.wrap(item).find('button').should('contain', locale === 'id' ? 'Lihat Detail' : locale === 'en' ? 'See Details' : -1)
            }
            else {
                cy.wrap(item).find('button').should('not.exist')
            }

        })

    }

    clickNextPortoCards() {
        cy.get('[data-cy="portofolio-carousel"]').find('button[tabindex="0"]').click()
    }

    checkNextPortoCards(data, locale) {
        cy.get('[data-cy="portofolio-carousel"]').find('.CustomCard_card__ARBgw').eq(4).then(item => {
            cy.wrap(item).should('contain', data.techcorpPortfolio[4].title)
            cy.wrap(item).click()
            if (data.techcorpPortfolio[4].short_description_id !== null || data.techcorpPortfolio[4].short_description_en !== null) {
                cy.wrap(item).should('contain', locale === 'id' ? data.techcorpPortfolio[4].short_description_id : locale === 'en' ? data.techcorpPortfolio[4].short_description_en : -1)
            }
            else {
                cy.wrap(item).find('p').invoke('text').should('be.empty')
            }

            if (data.techcorpPortfolio[4].ifHasDetail !== null) {
                cy.wrap(item).find('button').should('contain', locale === 'id' ? 'Lihat Detail' : locale === 'en' ? 'See Details' : -1)
            }
            else {
                cy.wrap(item).find('button').should('not.exist')
            }

        })
    }

    checkOtherServiceCards(data, locale) {
        cy.get('[data-cy="other-service-title"]').should('be.visible')
        cy.get('[data-cy="other-service-title"]').parent().find('.ServiceBox_listCardBox__d3O5m').each((item, index) => {
            cy.wrap(item).should('contain', locale === "id" ? data[index].attributes.name_id : locale === "en" ? data[index].attributes.name_en : -1)
            cy.wrap(item).should('contain', locale === "id" ? data[index].attributes.description_id : locale === "en" ? data[index].attributes.description_en : -1)
            cy.wrap(item).click()
            cy.wrap(item).find('a').should('contain', locale === 'id' ? 'Lihat Detail' : locale === 'en' ? 'See Detail' : -1)
        })
    }

    clickNextOtherServiceCards() {
        cy.get('[data-cy="other-service-title"]').parent().find('button[tabindex="0"]').click()
    }

    checkNextOtherServiceCards(data, locale) {
        cy.get('[data-cy="other-service-title"]').parent().find('.ServiceBox_listCardBox__d3O5m').eq(3).then(item => {
            cy.wrap(item).should('contain', locale === "id" ? data[3].attributes.name_id : locale === "en" ? data[3].attributes.name_en : -1)
            cy.wrap(item).should('contain', locale === "id" ? data[3].attributes.description_id : locale === "en" ? data[3].attributes.description_en : -1)
            cy.wrap(item).click()
            cy.wrap(item).find('a').should('contain', locale === 'id' ? 'Lihat Detail' : locale === 'en' ? 'See Detail' : -1)
        })
    }

    checkLeader(data) {
        cy.get('.LeadersCard_cardRoot__WFypq').each((item, index) => {
            cy.wrap(item).should('contain', data.teams[index].name).and('be.visible')
            cy.wrap(item).should('contain', data.teams[index].jobPosition).and('be.visible')
            cy.wrap(item).find('img').invoke('attr', 'src').should('not.be.empty')
        })
    }

    clickLeaderDetail() {
        cy.get('.LeadersCard_cardRoot__WFypq').first().as('teamCard').trigger('mouseover').then(() => {
            cy.get('@teamCard').find('button').click({ force: true })
        })
    }

    checkLeaderDetail(data, locale) {
        cy.get('[data-cy="team-venture-modal-name-0"]').should('contain', data.teams[0].name).and('be.visible')
        cy.get('[data-cy="team-venture-modal-avatar-name-0"]').should('contain', data.teams[0].name).and('be.visible')
        cy.get('[data-cy="team-venture-modal-position-0"]').should('contain', locale === "id" ? data.teams[0].jobDescription_id : locale === "en" ? data.teams[0].jobDescription_en : -1).and('be.visible')
        cy.get('[data-cy="team-venture-modal-avatar-position-0"]').should('contain', data.teams[0].jobPosition).and('be.visible')
        cy.get('[data-cy="team-venture-modal-avatar-instagram-0"]').should('be.visible')
        cy.get('[data-cy="team-venture-modal-avatar-linkedIn-0"]').should('be.visible')
    }

    //NOTE: Instagram Issue 
    clickInstagram(data) {
        cy.get('[data-cy="team-venture-modal-avatar-instagram-0"]').then(element => {
            cy.wrap(element.prop('href')).should('equal', data.teams[0].instagramUrl)
            cy.request({
                url: data.teams[0].instagramUrl,
                method: 'GET'
            }).then(response => {
                cy.wrap(response.status).should('equal', 200)
            })
        })
    }

    clickLinkedIn(data) {
        const sentArgs = { url: data.teams[0].linkedinUrl }
        cy.origin('https://www.linkedin.com', () => {
            cy.on('uncaught:exception', (e) => {
                if (e.message.includes('Things went bad')) {
                    // we expected this error, so let's ignore it
                    // and let the test continue
                    return false
                }
            })
        })
        cy.get('[data-cy="team-venture-modal-avatar-linkedIn-0"]').invoke('removeAttr', 'target').click()
        cy.origin('https://www.linkedin.com/', { args: sentArgs }, ({ url }) => {
            cy.url().should('eq', url)
        })
    }

    checkServiceDetail(data, locale) {
        cy.get('[data-cy="service-card"]').each((item, index) => {
            cy.wrap(item).should('contain', locale === 'id' ? data.ourServices[index].title_id : locale === 'en' ? data.ourServices[index].title_en : -1).isVisible()
            cy.wrap(item).should('contain', locale === 'id' ? data.ourServices[index].description_id : locale === 'en' ? data.ourServices[index].description_en : -1).isVisible()
        })
    }

    clickPortfolioDetail() {
        cy.get('[data-cy="portofolio-carousel"]').find('.CustomCard_card__ARBgw').first().then(item => {
            cy.wrap(item).find('button').click({ force: true })
        })
    }

    checkPortofolioPagePath(data) {
        const pathname = 'portfolio/' + data.techcorpPortfolio[0].slug
        cy.location('pathname').should('contain', pathname)
    }

    clickNextPageLeaders() {
        cy.get('[data-cy="team-venture-title"]').parent().find('button[tabindex="0"]').click()
    }

    checkLeaderNextPage(data) {
        cy.get('[class="LeadersCard_cardDescWrapper__5TUCG"]').eq(6).should('contain', data.teams[6].name).and('be.visible')
        cy.get('[class="LeadersCard_cardDescWrapper__5TUCG"]').eq(6).should('contain', data.teams[6].jobPosition).and('be.visible')
    }
}

export const onServiceDetailPage = new ServiceDetailPage()