export class ProfilePage {

    checkPageContent(locale) {
        if (locale === "id") {
            cy.get('[data-cy="profile-navigation"]').contains("Profil Saya")
            cy.get('[data-cy="profile-navigation"]').contains("Formulir Pengajuan")
            cy.get('[data-cy="profile-navigation"]').contains("Kata Sandi")
            cy.get('[data-cy="profile-navigation"]').contains("Keluar")

            cy.get('[data-cy="profile-navigation"]').contains('Batas waktu Pengumpulan Formulir').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Hari').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Jam').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Menit').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Detik').should('be.visible')

            cy.get('[data-cy="profile-content"]').contains('Profil Saya')
        }
        else if (locale === "en") {
            cy.get('[data-cy="profile-navigation"]').contains("My Profile")
            cy.get('[data-cy="profile-navigation"]').contains("Registration Form")
            cy.get('[data-cy="profile-navigation"]').contains("Change Password")
            cy.get('[data-cy="profile-navigation"]').contains("Logout")

            cy.get('[data-cy="profile-navigation"]').contains('Form submission deadline').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Days').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Hours').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Minutes').should('be.visible')
            cy.get('[data-cy="profile-navigation"]').contains('Seconds').should('be.visible')

            cy.get('[data-cy="profile-content"]').contains('My Profile')
        }
        //NOTE: need to add profile content component
        cy.get('[data-cy="profile-content"]').find('[data-cy="profile-name"]').should('be.visible')
        cy.get('[data-cy="profile-content"]').find('[data-cy="profile-email"]').should('be.visible')
        cy.get('[data-cy="profile-content"]').find('[data-cy="profile-edit-button"]').should('be.visible')
    }
    clickFormulirPengajuan() {
        cy.get('[data-cy="profile-navigation"] button').eq(1).click()
    }
    clickLengkapiFormulir(locale) {
        locale === 'id' ? cy.contains('Lengkapi Formulir', { timeout: 5000 }).click() : locale === 'en' ? cy.contains('Complete Submission Form', { timeout: 5000 }).click() : -1
    }

    clickIsiFormulir(locale) {
        locale === 'id' ? cy.contains('Isi Formulir Pengajuan', { timeout: 5000 }).click() : locale === 'en' ? cy.contains('Fill Submission Form', { timeout: 5000 }).click() : -1
    }

    clickPerbaruiData(locale) {
        locale === "id" ? cy.contains('Perbarui Data', { timeout: 5000 }).click() : locale === "en" ? cy.contains('Update Data', { timeout: 5000 }).click() : -1
    }

    clickEdit() {
        cy.get('[data-cy="profile-content"]').find('[data-cy="profile-edit-button"]').click()
        cy.get('[data-cy="profile-name-input"]').should('be.visible')
        cy.get('[data-cy="profile-email-input"]').should('be.visible')
        cy.get('[data-cy="profile-submit-button"]').should('be.visible')
    }

    fillInName() {
        let currentDate = new Date();
        let hour = currentDate.getHours();
        let minute = currentDate.getMinutes();

        // Formatting to ensure single digit numbers have leading zeros
        hour = (hour < 10 ? '0' : '') + hour;
        minute = (minute < 10 ? '0' : '') + minute;

        let dateString = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear() + ' ' + hour + ':' + minute;
        cy.get('[data-cy="profile-name-input"]').clear()
        cy.get('[data-cy="profile-name-input"]').type('Test ' + dateString)
    }

    clickSimpan(locale) {
        cy.get('[data-cy="profile-submit-button"]').click()
        if (locale === 'id') {
            cy.contains('Data berhasil disimpan')
            cy.contains('button', 'Ke Halaman Profil')
        }
        else if (locale === 'en') {
            cy.contains('Profile Updated')
            cy.contains('button', 'Back to Profile Page')
        }

    }

    clickKeluar(locale) {
        if (locale === "id") {
            cy.contains('Keluar').click()
            cy.get(".mantine-Modal-body").should('contain', "Keluar dari akun Anda")
            cy.get(".mantine-Modal-body").find('button').eq(0).should('contain', "Keluar")
            cy.get(".mantine-Modal-body").find('button').eq(1).should('contain', "Tidak Jadi")
        }
        else if (locale === "en") {
            cy.contains('Logout').click()
            cy.get(".mantine-Modal-body").should('contain', "Log out of your account")
            cy.get(".mantine-Modal-body").find('button').eq(0).should('contain', "Logout")
            cy.get(".mantine-Modal-body").find('button').eq(1).should('contain', "Cancel")
        }
    }

    confirmKeluar(locale) {
        if (locale === "id") {
            cy.get(".mantine-Modal-body").find('button').eq(0).should('contain', "Keluar").click()
        }
        else if (locale === "en") {
            cy.get(".mantine-Modal-body").find('button').eq(0).should('contain', "Logout").click()
        }
    }

    clickKataSandi(locale) {
        if (locale === 'id') {
            cy.get('[data-cy="profile-navigation"]').contains("Kata Sandi").click()
            cy.get('[data-cy="profile-content"]').should('contain', 'Ubah Kata Sandi')
        }
        else if (locale === 'en') {
            cy.get('[data-cy="profile-navigation"]').contains("Change Password").click()
            cy.get('[data-cy="profile-content"]').should('contain', 'Change Password')
        }
    }

    clickUbahKataSandi(locale) {
        locale === "id" ? cy.get('[data-cy="profile-content"] button').contains("Ubah Kata Sandi").click() : locale === 'en' ? cy.get('[data-cy="profile-content"] button').contains("Change Password").click() : -1
    }

    validatePendaftaranDitutup(locale) {
        locale === "id" ? cy.contains('Pendaftaran TechSpace 2024 telah ditutup').should('be.visible') : locale === 'en' ? cy.contains('TechSpace 2024 Registration has closed').should('be.visible') : -1
    }

    validateFormulirPengajuan(locale) {
        if (locale === "id") {
            cy.get('[data-cy="profile-content"]').contains('Formulir Pengajuan').should('be.visible')
            cy.get('[data-cy="profile-content"]').find('button').contains('Perbarui Data').should('be.visible')
        }
        else if (locale === "en") {
            cy.get('[data-cy="profile-content"]').contains('Registration Form').should('be.visible')
            cy.get('[data-cy="profile-content"]').find('button').contains('Update Data').should('be.visible')
        }


    }

}

export const onProfilePage = new ProfilePage()