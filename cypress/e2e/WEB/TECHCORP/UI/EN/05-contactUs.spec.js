const { onContactUsPage } = require('../../../../../support/page_objects/contactUsPage');
const { onPageFooter } = require('../../../../../support/page_objects/pageFooter');

describe('When testing contact us page,', () => {
    beforeEach('open contact Us Page,', () => {
        cy.visit('/contact')
        cy.changeToEnglish(false, "AD")
    })

    it("should display deskripsi halaman", () => {
        onContactUsPage.checkDescription("en")
    })

    it("should display alamat kantor pusat TechCorp Digital.", () => {
        onContactUsPage.checkAddress()
    })

    it("should display nomor telepon TechCorp Digital.", () => {
        onContactUsPage.checkPhoneNumber()
    })

    it("should display email TechCorp Digital.", () => {
        onContactUsPage.checkEmailAddress()
    })

    it("should user navigated to the instagram techcorp digital", () => {
        onContactUsPage.clickInstagram()
    })

    it("should user navigated to the tiktok techcorp digital", () => {
        onContactUsPage.clickTiktok()
    })

    it("should user navigated to the youtube techcorp digital", () => {
        onContactUsPage.clickYoutube()
    })

    it("should user navigated to the linkedIn techcorp digital", () => {
        onContactUsPage.clickLinkedIn()
    })

    it("should user navigated menuju maps alamat TechCorpDigital", () => {
        onContactUsPage.clickMaps("en")
    })

    it("should display footer components on about us page", () => {
        onPageFooter.checkAllComponents("en")
    })
})