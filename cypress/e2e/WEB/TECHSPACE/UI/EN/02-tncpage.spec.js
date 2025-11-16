const { onTermsAndConditionPage } = require('../../../../../support/page_objects/termsAndConditionPage');
const { onHeaderBar } = require('../../../../../support/page_objects/headerBar');


describe('On Terms and Condition Page,', () => {
    beforeEach('Navigate to terms and condition page', () => {
        cy.visit('techspace_rules')
        cy.changeToEnglish(false, "AN")
    })

    it('should user successfully akses page Syarat and ketentuan TechSpace', () => {
        onTermsAndConditionPage.validatePagePath()
        onTermsAndConditionPage.validateTitle('en')
    })

    it('should user displayed dropdown with judul-judul terkait', () => {
        onTermsAndConditionPage.validateEachDropdownTitle('en')
    })

    it('should user shown konten dropdown when dropdown in click', () => {
        onTermsAndConditionPage.openDropdown()
    })

    it('should user shown dropdown will tertutup when click dropdown that terbuka', () => {
        onTermsAndConditionPage.openDropdown()
        onTermsAndConditionPage.closedDropdown()
    })

    it('should user shown bagian Informasi More Lanjut', () => {
        onTermsAndConditionPage.validateForMoreInformation('en')
    })

})