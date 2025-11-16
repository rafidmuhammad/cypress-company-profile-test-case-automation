const { onHomePage } = require('../../../../../support/page_objects/homePage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');
const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');
const { onTermsAndConditionPage } = require('../../../../../support/page_objects/termsAndConditionPage');
const { onComingSoonPage } = require('../../../../../support/page_objects/comingSoonPage');
const { onPastEventPage } = require('../../../../../support/page_objects/pastEventPage');
const { onRegisterEventPage } = require('../../../../../support/page_objects/registerEventPage');
const { getNewValidEventDate, getNewInvalidEventDate, getNewInvalidEventDateBeforeRegistration,
    getNewInvalidEventDateAfterProposal, getNewValidEventDateOnlyInRegistration, getNewValidEventDateOnlyInProposal } = require('../../../../../support/helper/getNewEventDate');
const { onProfilePage } = require('../../../../../support/page_objects/profilePage');
const { onAnnouncementPage } = require('../../../../../support/page_objects/announcementPage');
const { onConferencePage } = require('../../../../../support/page_objects/conferencePage');
const { deleteSubmissionFromUserWhenExist } = require('../../../../../support/helper/deleteSubmission');



describe('When testing the home page,', () => {
    before('Delete submission if exist,', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        deleteSubmissionFromUserWhenExist()
        cy.logOut()
        cy.wait(1000)
    })

    beforeEach('Navigate to the home page', () => {
        cy.fixture('WEB/home/testDataForProgramDetails.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/program-details?filters[type]=Homepage&locale=id`
            }, testData.en).as('programDetails')
        })
        cy.fixture('WEB/home/testDataForBanner.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/banner?locale=id`
            }, testData.en).as('banner')
        })
        cy.fixture('WEB/home/testDataForParticipationInfo.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/participation-infos?locale=id`
            }, testData.en).as('participationInfo')
        })
        cy.fixture('WEB/home/testDataForTimeline.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/timelines*`
            }, testData.en).as('timeline')
        })
        cy.fixture('WEB/home/testDataForPartners.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/partners?locale=id`
            }, testData.en).as('partners')
        })
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/judges-mentors?pagination[pageSize]=100`
        }).as('judgesAndMentors')
        cy.openHomepage()
    })

    it('should user navigate to the homepage', () => {
        onHeaderBar.checkHeaderBarLogo()
        cy.wait(2000)
        onHomePage.checkAllElement(false)

    })

    it('should user navigate to the TechCorp when click logo techcorp', () => {
        onHeaderBar.clickTechCorpLogo()
    })

    it('should user navigate to the TechCorp when click logo Indonesia Satu', () => {
        onHeaderBar.clickSatuIndonesiaLogo()
    })

    it('should user navigate to the TechCorp Digital when click logo TechCorp Digital', () => {
        onHeaderBar.clickTechCorpDigitalLogo()
    })

    it('should user navigate to the tentang techspace when click Tentang TechSpace on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToAboutTechSpaceThroughBurger("id")
    })

    it('should user navigate to the Ketentuan TechSpace when click Ketentuan on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToKetentuanThorughBurger("id")
        onTermsAndConditionPage.validatePagePath()
        onTermsAndConditionPage.validateTitle()

    })

    it('should user navigate to the TechSpace Sebelumnya when click TechSpace Sebelumnya on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToPastEvenThroughBurger("id")
        onPastEventPage.validatePageContent()
        onPastEventPage.validatePagePath()
    })

    it.skip('should user navigate to the page coming soon when click konferensi techspace on burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.openTechSpaceMenu()
        onHeaderBar.navigateToConferenceThroughBurger()
        onComingSoonPage.checkPageContent()
    })

    it.skip('should user navigate to the page coming soon when click pengumuman on burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.openTechSpaceMenu()
        onHeaderBar.navigateToAnnouncementThroughBurger()
        onComingSoonPage.checkPageContent()
    })

    it('should user navigate to the page Konferensi TechSpace when click konferensi techspace on burger', () => {
        cy.fixture('WEB/conference/testDataForConference.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-banner?locale=id`
            }, testData.en).as('bannerConference')


            onHeaderBar.openBurgerMenu(false, "id")
            onHeaderBar.openTechSpaceMenu(false, "id")
            onHeaderBar.navigateToConferenceThroughBurger("id")

            onConferencePage.validatePagePath()
            cy.wait('@bannerConference').then(() => {
                onConferencePage.checkPageTitle(testData.en)
            })
        })
    })

    it('should user navigate to the page Pengumuman when click pengumuman on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechSpaceMenu(false, "id")
        onHeaderBar.navigateToAnnouncementThroughBurger("id")
        onAnnouncementPage.validatePagePath()
        onAnnouncementPage.validateTitle()
    })



    it('should user navigate to the page profile when click Formulir Pengajuan on burger in a state of already login and already mendaftar sebelumnya', () => {
        cy.fixture('WEB/submission/stubForSubmission.json').then(data => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/profile/submission`
            }, data).as('scopedSubmission')
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')

        cy.LoginToTechSpace("id")
        cy.wait('@scopedSetting').then(xhrSetting => {
            cy.wait('@scopedSubmission').then(xhr => {
                onHeaderBar.openBurgerMenu(true, "id")
                onHeaderBar.openTechSpaceMenu(true, "id")
                onHeaderBar.navigateToEventRegistrationThroughBurger("id")
                onProfilePage.validateFormulirPengajuan("id")
            })
        })
    })

    it('should user navigate to the page login when click Formulir Pengajuan on burger in a state of not logged in', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then(xhr => {
            onHeaderBar.openBurgerMenu(false, "id")
            onHeaderBar.openTechSpaceMenu(true, "id")
            onHeaderBar.navigateToEventRegistrationThroughBurger("id")
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement()
            })
        })
    })

    it('should user navigate to the page formulir pengajuan when click Formulir Pengajuan on burger in a state of already login and not yet mendaftar sebelumnya', () => {
        cy.fixture('WEB/submission/stubForSubmission.json').then(mockedData => {
            mockedData.data = null
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/profile/submission`
            }, mockedData).as('scopedSubmission')
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')

        cy.LoginToTechSpace("id")

        cy.wait('@scopedSetting').then(xhrSetting => {
            cy.wait('@scopedSubmission').then(xhr => {
                onHeaderBar.openBurgerMenu(true, "id")
                onHeaderBar.openTechSpaceMenu(true, "id")
                onHeaderBar.navigateToEventRegistrationThroughBurger("id")
                onRegisterEventPage.checkTheContents("id")
            })
        })
    })

    it('should user navigate to the page techcorpdigital when click Beranda TechCorp Digital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToBeranda("id")
    })

    it('should user navigate to the page About Us TechCorpDigital when click About Us TechCorp Digital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToTentangKami("id")
    })

    it('should user navigate to the page Our Services TechCorpDigital when click Our Services TechCorp Digital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToLayananKami("id")
    })

    it('should user navigate to the page Portofolio TechCorpDigital when click Portofolio TechCorpDigital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToPortofolio("id")
    })

    it('should user navigate to the page Artikel TechCorp Digital when click Artikel TechCorp Digital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.openTechCorpDigitalMenu("id")
        onHeaderBar.navigateToArtikel("id")

    })

    it('should user navigate to the page Kontak Kami TechCorpDigital when click Kontak Kami TechCorpDigital on burger', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.navigateToKontakKami()

    })

    it('should user navigate to the page LinkedIn TechCorp Digital melalui burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.clickLinkedIn()
    })
    //NOTE: Exception load never ends
    it('should user navigate to the page Youtube TechCorp Digital melalui burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.clickYoutube()
    })
    //NOTE: cy.origin() failed to create a spec bridge to communicate with the specified origin
    //NOTE: not can menjamin hasil that konsisten on kasus benar2 redirect to the tiktok
    //NOTE: when ini menggunwill hit to url tiktok
    it('should user navigate to the page TikTok TechCorp Digital melalui burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.clickTiktok()
    })

    //NOTE: Exception security issue that blocks automation from Instagram
    it('should user navigate to the page Instagram TechCorp Digital melalui burger', () => {
        onHeaderBar.openBurgerMenu(false)
        onHeaderBar.clickInstagram()
    })

    //NOTE: user request to remove the button
    it.skip('should user navigate to the page ketentuan and privasi when click Ketentuan & Privasi', () => {
        onHeaderBar.openBurgerMenu(false, "id")
        onHeaderBar.clickKetentuanPrivasi("id")
        onTermsAndConditionPage.validateTitle("id")
        onTermsAndConditionPage.validatePagePath()
    })

    it('should user navigated from button daftar banner to the login with tombol daftar akun when pendaftaran masih dibuka and not logged in', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.clickDaftarBannerButton("id")
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(true)
            })
        })
    })

    it('should user ditunujukkan popup from button daftar banner when click tombol daftar when pendaftaran already ditutup and not logged in', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.clickDaftarBannerButton("id")
            onHomePage.checkModalPendaftaranTutup("id")
            onHomePage.clickCloseModal()
        })
    })


    it('should user navigated from button daftar timeline and participation info to the login with tombol daftar akun when pendaftaran masih dibuka and not logged in', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.clickDaftarButtonParticipation()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(true)
                cy.go('back')
            })
            onHomePage.clickDaftarButtonTimeline()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(true)
            })
        })
    })

    it('should user navigated from button daftar timeline and participation info to the login without tombol daftar akun when pendaftaran ditutup and not logged in', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.clickDaftarButtonParticipation()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(false)
                cy.go('back')
            })
            onHomePage.clickDaftarButtonTimeline()
            cy.origin(`${Cypress.env('B2C_URL')}`, () => {
                const { onLoginPage } = Cypress.require('../../../../../support/page_objects/loginPage')
                onLoginPage.checkAllElement(false)
            })
        })
    })

    it('should user navigated from button daftar timeline and participation info to the form when pengumpulan proposal dibuka and already login', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            cy.LoginToTechSpace("id")
            onHomePage.clickDaftarButtonParticipation()
            onRegisterEventPage.checkTheContents("id")
            onRegisterEventPage.clickInformasiInovasi("id")
            cy.openHomepage()
            onHomePage.clickDaftarButtonTimeline()
            onRegisterEventPage.checkTheContents("id")
            onRegisterEventPage.clickInformasiInovasi("id")
        })
    })

    it('should user shown popup from button daftar timeline and participation info when already login and waktu pengumpulan proposal already ditutup', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDateAfterProposal()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            cy.LoginToTechSpace("id")
            onHomePage.clickDaftarButtonParticipation()
            onHomePage.checkModalPendaftaranTutup("id")
            onHomePage.clickCloseModal()
            cy.openHomepage()
            onHomePage.clickDaftarButtonTimeline()
            onHomePage.checkModalPendaftaranTutup("id")
            onHomePage.clickCloseModal()
        })
    })

    it('should display video banner on the homepage', () => {
        onHomePage.checkVideoBanner()
    })

    it.skip('should user navigate to the coming soon when click tombol pengumuman on homepage', () => {
        onHomePage.clickAnnouncement()
        onComingSoonPage.checkPageContent()
    })

    it.skip('should user navigate to the coming soon when click tombol konferensi techspace on homepage', () => {
        onHomePage.NavigateToConferenceThroughBanner()
        onComingSoonPage.checkPageContent()
    })

    it('should user navigate to the Pengumuman when click tombol pengumuman on homepage', () => {
        onHomePage.clickAnnouncement("id")
        onAnnouncementPage.validatePagePath()
        onAnnouncementPage.validateTitle("id")
    })

    it('should user navigate to the Konferensi TechSpace when click tombol konferensi techspace on homepage', () => {
        cy.fixture('WEB/conference/testDataForConference.json').then(testData => {
            cy.intercept({
                method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/conference-banner?locale=id`
            }, testData.en).as('bannerConference')

            onHomePage.NavigateToConferenceThroughBanner("id")
            onConferencePage.validatePagePath()
            cy.wait('@bannerConference').then(() => {
                onConferencePage.checkPageTitle(testData.en)
            })
        })
    })

    it('should display homepage description on homepage', () => {
        cy.wait('@banner').its('response.body').then(data => {
            onHomePage.checkHomepageDescription(data)
        })
    })

    it('should display program details on homepage', () => {
        cy.reload()
        cy.wait(1000)
        cy.wait("@programDetails").its('response.body').then(data => {
            onHomePage.checkProgramDetails(data)
        })
    })

    it('should display Participation Info on homepage', () => {
        cy.wait('@participationInfo').its('response.body').then(data => {
            onHomePage.checkToParticipationInfo(data)
        })
    })

    it('should display bagian juri and mentor on homepage', () => {
        onHomePage.checkJudges()
        onHomePage.checkMentor()
    })

    it('should display bagian mitra on homepage', () => {
        cy.wait('@partners').its('response.body').then(data => {
            onHomePage.checkPartner(data)
        })
    })

    it('should display bagian timeline on homepage', () => {
        cy.wait('@timeline').its('response.body').then(data => {
            onHomePage.checkTimeline(data)
        })
    })

    it('should display bagian punya pertanyaan on homepage', () => {
        onHomePage.validateForMoreInformation("id")
    })

    it('should display countdown timer on homepage when waktu masih dalam rentang waktu pendaftaran', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewValidEventDateOnlyInRegistration()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.checkCountDownTimer(true, false, "id")
        })
    })

    it('should display countdown timer on homepage when waktu setelah rentang waktu pendaftaran already habis', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDate()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.checkCountDownTimer(true, true, "id")
        })
    })

    it('should not display countdown timer on homepage when waktu senot yet rentang waktu pendaftaran', () => {
        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }, (req) => {
            req.reply(res => {
                const newDate = getNewInvalidEventDateBeforeRegistration()
                res.body.data.attributes.openRegistration = newDate.openRegistration
                res.body.data.attributes.closeRegistration = newDate.closeRegistration
                res.body.data.attributes.openProposal = newDate.openProposal
                res.body.data.attributes.closeProposal = newDate.closeProposal
            })
        }).as('scopedSetting')
        cy.reload()
        cy.wait(2000)
        cy.wait('@scopedSetting').then((xhr) => {
            onHomePage.checkCountDownTimer(false)
        })
    })

    it.skip('should user navigated to the techcorp digital academy when click TechCorp Digital Academy on footer', () => {
        onPageFooter.clickTechCorpDigitalAcademy()
    })

    it('should user navigated to the techspace when click techspace on footer', () => {
        onPageFooter.clickTechSpace()
    })

    it('should user navigated to contact page kami techcorpdigital when click FAQ on footer', () => {
        onPageFooter.clickFAQ()
    })

    it('should user navigated to the natacara when click Natacara on footer', () => {
        onPageFooter.clickNatacara()
    })

    it('should user navigated to article page techcorp digital when click Blog on footer', () => {
        onPageFooter.clickBlog()
    })

    it.skip('should user navigate to the page bantuan when click Bantuan on footer', () => {
        onPageFooter.clickBantuan()
    })

    it('should user navigated to the About Us techcorp digital when click About Us on footer', () => {
        onPageFooter.clickTentangKami("id")
    })

    it('should user navigated to the Layanan techcorp digital when click Pelayanan on footer', () => {
        onPageFooter.clickPelayanan("id")
    })

    it('should user navigated to the Portofolio techcorp digital when click Karya Kami on footer', () => {
        onPageFooter.clickKaryaKami("id")
    })

    it('should user navigated to the Kontak Kami techcorp digital when click KOntak Kami on footer', () => {
        onPageFooter.clickKontakKami("id")
    })

    //NOTE: user request to remove the button for a while
    it.skip('should user navigated to the Ketentuan and Privasi techcorp digital when click Ketentuan and Privasi on footer', () => {
        onPageFooter.clickKetentuandanPrivasi("id")
        onTermsAndConditionPage.validatePagePath()
        onTermsAndConditionPage.validateTitle("id")
    })

    it.skip('should user will navigated to the cookies when click cookies on footer', () => {
        onPageFooter.clickCookies()
    })

    it('should user navigated to the LinkedIn techcorp digital when click LinkedIn on footer', () => {
        onPageFooter.clickLinkedIn()
    })

    //NOTE: Loads will never end
    it('should user navigated to the Youtube techcorp digital when click Youtube on footer', () => {
        onPageFooter.clickYoutube()
    })

    //NOTE: cy.origin() failed to create a spec bridge to communicate with the specified origin
    //NOTE: not can menjamin hasil that konsisten on kasus benar2 redirect to the tiktok secara script already redirect
    //NOTE: Tapi bridge komunikasi not can berjalan with baik
    //NOTE: when ini menggunwill hit to url tiktok
    it('should user navigated to the TikTok techcorp digital when click TikTok on footer', () => {
        onPageFooter.clickTiktok()
    })

    //NOTE: Security issue that blocks automation
    it('should user navigated to the Instagram techcorp digital when click Instagram on footer', () => {
        onPageFooter.clickInstagram()
    })
})