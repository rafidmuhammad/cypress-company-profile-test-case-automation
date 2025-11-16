const { onTermsAndConditionPage } = require('../../../../../support/page_objects/termsAndConditionPage');


describe('On Terms and Condition Page,', () => {
    beforeEach('Navigate to terms and condition page', () => {
        cy.visit('techspace_rules')
    })

    it('should user successfully akses page Syarat and ketentuan TechSpace', () => {
        onTermsAndConditionPage.validatePagePath()
        onTermsAndConditionPage.validateTitle('id')
    })

    it('should user displayed dropdown with judul-judul terkait', () => {
        onTermsAndConditionPage.validateEachDropdownTitle('id')
    })

    it('should user shown konten dropdown when dropdown in click', () => {
        onTermsAndConditionPage.openDropdown()
    })

    it('should user shown dropdown will tertutup when click dropdown that terbuka', () => {
        onTermsAndConditionPage.openDropdown()
        onTermsAndConditionPage.closedDropdown()
    })

    it('should user shown bagian Informasi More Lanjut', () => {
        onTermsAndConditionPage.validateForMoreInformation('id')
    })

})