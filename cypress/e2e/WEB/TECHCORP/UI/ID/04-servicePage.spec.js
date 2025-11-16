const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onServicePage } = require('../../../../../support/page_objects/servicePage');
const { onServiceDetailPage } = require('../../../../../support/page_objects/serviceDetailPage');

describe('When testing about us page,', () => {


    beforeEach('open About Us Page,', () => {
        cy.fixture('TECHCORP/service/testDataForServiceHero.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/service/hero?locale=id`
            }, testData.id).as('serviceHero')
        })

        cy.fixture('TECHCORP/service/testDataForServices.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services?locale=id`
            }, testData).as('services')
        })

        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('serviceDetail')
        })

        cy.fixture('TECHCORP/service/testDataForOtherService.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-services/*`
            }, testData).as('otherServices')
        })
        cy.visit('/service')
    })

    it('should display banner that memuat konten informasi page List Layanan', () => {
        cy.wait('@serviceHero').its('response.body').then(body => {
            onServicePage.checkVideoBanner()
            cy.log(body)
            onServicePage.checkBannerTitle(body.data.attributes.title)
        })
    })

    it('should display sub title from page List Layanan.', () => {
        onServicePage.checkBodyTitle('id')
    })

    it('should display deskripsi page List Layanan.', () => {
        onServicePage.checkBodyDescription('id')
    })

    it('should display Konten informasi that menampilkan informasi service TechCorp Digital', () => {
        cy.wait('@services').its('response.body.data').then(data => {
            onServicePage.checkServicesCards('id', data)
        })
    })

    it('should display section Kontak Kami on our services page', () => {
        onServicePage.checkForMoreInformation('id')
    })

    it('should user shown komponen-footer components on the Our Services', () => {
        onPageFooter.checkAllComponents("id")
    })

    //NOTE: DETAIL LAYANAN
    it('should user navigated to the page Detail Layanan', () => {
        cy.wait('@services').its('response.body.data').then(data => {
            onServicePage.hoverToCard()
            onServicePage.clickCard()
            onServiceDetailPage.checkUrl(data[0].attributes.slug)
        })
    })

    it('should display konten page Detail Layanan that berupa video banner', () => {
        cy.wait('@services').its('response.body.data').then(data => {
            onServicePage.hoverToCard()
            onServicePage.clickCard()
            cy.wait('@serviceDetail').its('response.body').then(body => {
                onServiceDetailPage.checkVideoBanner()
            })
        })
    })

    it('should display section informasi Core Values from service TechCorp Digital on the Detail Layanan that dipilih', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.ourCoreValues.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('serviceDetailCVLTE3')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetailCVLTE3').its('response.body.data').then(data => {
            cy.log(data)
            onServiceDetailPage.checkCoreCard(data, "id")
        })
    })

    it('should display section informasi Core Values from service TechCorp Digital on the Detail Layanan that dipilih to data more from 3', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickNextCoreCards()
            onServiceDetailPage.checkNextCoreCards(data, "id")
        })
    })

    it('should User can View Section Kontak Kami in Detail Layanan ', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        onServicePage.checkForMoreInformation('id')
    })

    it('should user shown komponen-footer components on the Detail Layanan', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        onPageFooter.checkAllComponents("id")
    })

    it('should display konten page Detail Layanan that berupa title page', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.checkBannerTitle(data, "id")
        })
    })

    it('should section Penawaran Kami not tampak if memang not ada on the Detail Layanan that dipilih', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.ourOfferings = []
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('serviceDetailNoOfferings')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetailNoOfferings').its('response.body.data').then(data => {
            onServiceDetailPage.checkOfferingsShouldNotExist()
        })
    })

    it('should section core values not tampak if memang not ada on the Detail Layanan that dipilih', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.ourCoreValues = []
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('serviceDetailNoValues')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetailNoValues').its('response.body.data').then(data => {
            onServiceDetailPage.checkValuesShouldNotExist()
        })
    })

    it('should display section informasi Penawaran Kami on the Detail Layanan that dipilih when data less from same with 3', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.ourOfferings.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('serviceDetailOffEq3')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetailOffEq3').its('response.body.data').then(data => {
            onServiceDetailPage.checkOfferingCards(data, "id")
        })
    })
    it('should display section informasi Penawaran Kami on the Detail Layanan that dipilih when data more from 3', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickNextOfferingCards()
            onServiceDetailPage.checkNextOfferingCards(data, "id")
        })
    })

    it('should display section informasi portfolio with kategori that same on TechCorp Digital on the Detail Layanan (Portofolio <= 4)', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.techcorpPortfolio.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('portoEQ4')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@portoEQ4').its('response.body.data').then(data => {
            onServiceDetailPage.checkPortoCards(data, "id")
        })
    })

    it('should display section informasi portfolio with kategori that same on TechCorp Digital on the Detail Layanan that dipilih (Portofolio > 4)', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickNextPortoCards()
            onServiceDetailPage.checkNextPortoCards(data, "id")
        })
    })

    it('should display list kategori layanan lainnya on the Detail Layanan that dipilih (Layanan Lain <= 3)', () => {
        cy.fixture('TECHCORP/service/testDataForOtherService.json').then(testData => {
            testData.data.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/other-services/*`
            }, testData).as('otherServicesLT3')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@otherServicesLT3').its('response.body.data').then(data => {
            onServiceDetailPage.checkOtherServiceCards(data, "id")
        })
    })

    it('should display list kategori layanan lainnya on the Detail Layanan that dipilih (Layanan Lain > 3)', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@otherServices').its('response.body.data').then(data => {
            onServiceDetailPage.clickNextOtherServiceCards()
            onServiceDetailPage.checkNextOtherServiceCards(data, "id")
        })
    })

    it('should display section informasi team member  TechCorp Digital on the Detail Layanan that dipilih', () => {
        cy.fixture('TECHCORP/service/testDataForServiceDetail.json').then(testData => {
            testData.data.teams.pop()
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techcorp-digital/services/*`
            }, testData).as('leaderLT6')
        })
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@leaderLT6').its('response.body.data').then(data => {
            onServiceDetailPage.checkLeader(data)
        })
    })

    it('should display section informasi detail service from card servis TechCorp Digital on the Detail Layanan that dipilih', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.checkServiceDetail(data, "id")
        })
    })

    it('should user can view detail portofolio from Detail Layanan that dipilih', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickPortfolioDetail()
            onServiceDetailPage.checkPortofolioPagePath(data)
        })
    })

    it('should user can membuka detail team member TechCorp Digital on the Detail Layanan that dipilih', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()



        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickLeaderDetail()
            onServiceDetailPage.checkLeaderDetail(data, "id")
        })
    })

    //NOTE: not benar-benar can in click karena instagram detect automation
    it('should user can membuka media sosial team member TechCorp Digital on detail page team member (instagram)', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickLeaderDetail()
            onServiceDetailPage.clickInstagram(data)
        })
    })

    it('should user can membuka media sosial team member TechCorp Digital on detail page team member (linkedin)', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()
        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickLeaderDetail()
            onServiceDetailPage.clickLinkedIn(data)
        })
    })

    it('should display section informasi team member TechCorp Digital on the Detail Layanan that dipilih (Team Member > 6)', () => {
        onServicePage.hoverToCard()
        onServicePage.clickCard()

        cy.wait('@serviceDetail').its('response.body.data').then(data => {
            onServiceDetailPage.clickNextPageLeaders()
            onServiceDetailPage.checkLeaderNextPage(data)
        })
    })

})