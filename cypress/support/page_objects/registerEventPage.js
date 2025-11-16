const { hasDifferentLengthFields, hasDifferentLengthTextArea } = require('../helper/checkBetweenTwoLength');


export class RegisterEventPage {
    validateThePath() {
        cy.location('pathname').should('contain', 'techspaces_submission')
    }

    checkTheContents(locale) {
        if (locale === "id") {
            cy.contains('Ke Halaman Profil')
            cy.contains('Registrasi')
            cy.get('[role="tablist"]').contains('Informasi Tim').invoke('attr', 'aria-selected').should('equal', 'true')
            cy.get('[role="tablist"]').contains('Informasi Inovasi').invoke('attr', 'aria-selected').should('equal', 'false')
        }
        else if (locale === "en") {
            cy.contains('To Profile Page')
            cy.contains('Registration')
            cy.get('[role="tablist"]').contains('Team Information').invoke('attr', 'aria-selected').should('equal', 'true')
            cy.get('[role="tablist"]').contains('Innovation Information').invoke('attr', 'aria-selected').should('equal', 'false')
        }
        cy.get('.FormProgress_progressDesc__wnPN_')
        cy.get('[role="progressbar"]')
        cy.get('[data-cy="teamName"]')
        cy.get('[data-cy="teamLeadName"]')
        cy.get('[data-cy="teamLeadEmail"]')
        cy.get('[data-cy="teamLeadWhatsapp"]')
        cy.get('[data-cy="competitionTrack"]')
        cy.get('[data-cy="institution"]')
        cy.get('[data-cy="domicileCity"]')
        cy.get('[data-cy="gender"]')
        cy.get('[data-cy="save-draft"]')
        cy.get('[data-cy="next"]')

    }

    clickInformasiTim(locale) {
        locale === "id" ? cy.get('[role="tablist"]').contains('Informasi Tim').click() : locale === "en" ? cy.get('[role="tablist"]').contains('Team Information').click() : -1
    }

    clickInformasiInovasi(locale) {
        locale === 'id' ? cy.get('[role="tablist"]').contains('Informasi Inovasi').click() : locale === 'en' ? cy.get('[role="tablist"]').contains('Innovation Information').click() : -1
        cy.get('.FormProgress_progressDesc__wnPN_')
        cy.get('[role="progressbar"]')
    }

    isiInformasiTim(locale) {
        cy.fixture('WEB/registerEvent/dataInformasiTim.json').then(data => {
            cy.get('[data-cy="teamName"]').clear()
            cy.get('[data-cy="teamName"]').type(data.namaTim)
            cy.get('[data-cy="teamLeadName"]').clear()
            cy.get('[data-cy="teamLeadName"]').type(data.namaKetuaTim)
            cy.get('[data-cy="teamLeadWhatsapp"]').clear()
            cy.get('[data-cy="teamLeadWhatsapp"]').type(data.nomorWAKetuaTim)
            cy.get('[data-cy="competitionTrack"]').contains(data.jalurKompetisi).click()
            cy.get('[data-cy="institution"]').clear()
            cy.get('[data-cy="institution"]').type(data.institusi)
            cy.get('[data-cy="domicileCity"]').clear()
            cy.get('[data-cy="domicileCity"]').type(data.domisiliSearch)
            cy.get('[role="listbox"]', { timeout: 3000 }).contains(data.domisiliSelect).click()
            locale === 'id' ? cy.get('[data-cy="gender"]').contains(data.gender_id).click() : locale === 'en' ? cy.get('[data-cy="gender"]').contains(data.gender_en).click() : -1
        })
    }

    isiInformasiInovasi(locale) {
        cy.fixture('WEB/registerEvent/dataInformasiInovasi.json').then(data => {
            cy.get('[data-cy="innovationCategory"]').clear()
            cy.get('[data-cy="innovationCategory"]').type(data.kategoriInovasi)
            cy.get('[role="listbox"] [role="option"]', { timeout: 3000 }).eq(0).click()
            cy.get('[data-cy="summaryOfInnovation"]').clear()
            cy.get('[data-cy="summaryOfInnovation"]').type(data.rangkumanInovasi)
            cy.get('[data-cy="problemStatement"]').clear()
            cy.get('[data-cy="problemStatement"]').type(data.pernyataanMasalah)
            cy.get('[data-cy="solution"]').clear()
            cy.get('[data-cy="solution"]').type(data.solusi)
            cy.get('[data-cy="competitiveAnalysis"]').clear()
            cy.get('[data-cy="competitiveAnalysis"]').type(data.analisaKompetisi)
            cy.get('[data-cy="uniqueValueProposition"]').clear()
            cy.get('[data-cy="uniqueValueProposition"]').type(data.uVP)
            locale === "id" ? cy.get('[data-cy="haveProductTraction"] .CustomRadioInput_root__z1skV').contains(data.traction_id).click() : locale === "en" ? cy.get('[data-cy="haveProductTraction"] .CustomRadioInput_root__z1skV').contains(data.traction_en).click() : -1
            cy.get('[data-cy="productTractionInformation"]').clear()
            cy.get('[data-cy="productTractionInformation"]').type(data.keteranganTraction)
            locale === "id" ? cy.get('[data-cy="haveGetInvestments"] .CustomRadioInput_root__z1skV').contains(data.investment_id).click() : locale === "en" ? cy.get('[data-cy="haveGetInvestments"] .CustomRadioInput_root__z1skV').contains(data.investment_en).click() : -1
            cy.get('[data-cy="investmentInformation"]').clear()
            cy.get('[data-cy="investmentInformation"]').type(data.keteranganInvestment)
            cy.get('[data-cy="referral"]').clear()
            cy.get('[data-cy="referral"]').click()
            cy.get('[role="listbox"]', { timeout: 3000 }).eq(2).find('[role="option"]').eq(0).click()
        })
    }

    isiReferral() {
        cy.fixture('WEB/registerEvent/dataInformasiInovasi.json').then(data => {
            cy.get('[data-cy="referral"]').clear()
            cy.get('[data-cy="referral"]').type(data.referral)
            cy.get('[role="listbox"]', { timeout: 3000 }).eq(2).find('[role="option"]').eq(0).click()
        })
    }

    fillInTheFieldsMoreThanLimit(locale) {
        cy.fixture('WEB/registerEvent/charLengthTest.json').then(data => {
            hasDifferentLengthFields("teamName", data.charLength110, 100)
            hasDifferentLengthFields("teamLeadName", data.charLength110, 100)
            hasDifferentLengthFields("teamLeadWhatsapp", data.charLength110, 100)
            cy.get('[data-cy="competitionTrack"]').as("competitionTrack")
            locale === "id" ? cy.get('@competitionTrack').contains('Mahasiswa').click() : locale === "en" ? cy.get('@competitionTrack').contains('Student').click() : -1
            hasDifferentLengthFields("institution", data.charLength110, 100)
            hasDifferentLengthFields("major", data.charLength110, 100)

            cy.get('[data-cy="next"]').click()

            hasDifferentLengthTextArea("summaryOfInnovation", data.charLength505, 500)
            hasDifferentLengthTextArea("problemStatement", data.charLength110, 100)
            hasDifferentLengthTextArea("solution", data.charLength110, 100)
            hasDifferentLengthTextArea("competitiveAnalysis", data.charLength110, 100)
            hasDifferentLengthTextArea("uniqueValueProposition", data.charLength110, 100)
            cy.get('[data-cy="haveProductTraction"] .CustomRadioInput_root__z1skV').as("productTraction")
            locale === "id" ? cy.get("@productTraction").contains("Sudah").click() : locale === "en" ? cy.get("@productTraction").contains("Yes").click() : -1
            hasDifferentLengthTextArea("productTractionInformation", data.charLength260, 255)
            cy.get('[data-cy="haveGetInvestments"] .CustomRadioInput_root__z1skV').as("getInvestments")
            locale === "id" ? cy.get("@getInvestments").contains("Sudah").click() : locale === "en" ? cy.get("@getInvestments").contains("Yes").click() : -1
            hasDifferentLengthTextArea("investmentInformation", data.charLength260, 255)
        })
    }

    clickSimpan(locale) {
        if (locale === "id") {
            cy.contains('Simpan').click()
            cy.contains('Draft berhasil disimpan')
            cy.contains('button', 'Ke Halaman Profil')
        }
        else if (locale === "en") {
            cy.contains('Save').click()
            cy.contains('Draft saved successfully')
            cy.contains('button', 'Go to Profile Page')
        }
    }

    clickSelanjutnya() {
        cy.get('[data-cy="next"]').click()
    }

    clickDaftar() {
        cy.get('[data-cy="submit"]').click()
    }

    clickPeriksaData(locale) {
        locale === "id" ? cy.contains('Periksa Data').click() : locale === "en" ? cy.contains('Check Data').click() : -1
    }

    clickKembaliKeProfil(locale) {
        locale === "id" ? cy.contains('button', 'Ke Halaman Profil').click() : locale === "en" ? cy.contains('button', 'Go to Profile Page').click() : -1
    }

    validateSuccessDaftar(locale) {
        if (locale === "id") {
            cy.contains('Pengajuan berhasil dikirim')
            cy.contains('button', 'Ke Halaman Profil')
        }
        else if (locale === "en") {
            cy.contains('Submission sent successfully')
            cy.contains('button', 'Go to Profile Page')
        }
    }

    validateFailureDaftar(locale) {
        if (locale === "id") {
            cy.contains('Pengajuan belum berhasil')
            cy.contains('button', 'Periksa Data')
        }
        else if (locale === "en") {
            cy.contains('Submission not successful')
            cy.contains('button', 'Check Data')
        }
    }

    validateValidationMessageInformasiInovasi(locale) {
        if (locale === "id") {
            cy.contains('Kategori Inovasi harus diisi')
            cy.contains('Rangkuman Inovasi harus diisi')
            cy.contains('Pernyataan Masalah harus diisi')
            cy.contains('Solusi harus diisi')
            cy.contains('Analisa Kompetisi harus diisi')
            cy.contains('Unique Value Proposition harus diisi')
            cy.contains('Traction harus diisi')
            cy.contains('Status investasi harus diisi')
            cy.contains('Proposal harus diisi')
        }
        else if (locale === "en") {
            cy.contains('Innovation Category is required')
            cy.contains('Innovation Summary is required')
            cy.contains('Problem Statement is required')
            cy.contains('Solution is required')
            cy.contains('Competitor Analysis is required')
            cy.contains('Unique Value Proposition is required')
            cy.contains('Traction is required')
            cy.contains('Investment status is required')
            cy.contains('Proposal is required')
        }
    }

    validateValidationMessageInformasiTim(locale) {
        if (locale === "id") {
            cy.contains('Nama Tim harus diisi')
            cy.contains('Nama Ketua Tim harus diisi')
            cy.contains('No WA Ketua Tim harus diisi')
            cy.contains('Jalur Kompetisi harus diisi')
            cy.contains('Institusi harus diisi')
            cy.contains('Jurusan (Jika Mahasiswa) harus diisi')
            cy.contains('Domisili harus diisi')
            cy.contains('Jenis Kelamin harus diisi')
        }
        else if (locale === "en") {
            cy.contains('Team Name is required')
            cy.contains('Team leader name is required')
            cy.contains('Team Leader Whatsapp is required')
            cy.contains('Competition Track is required')
            cy.contains('Institution is required')
            cy.contains('Major (Student Only) is required')
            cy.contains('Domicile is required')
            cy.contains('Gender is required')
        }
    }

    validateValidationMessageWhenFileLargerThan15MB(locale) {
        locale === "id" ? cy.contains('Ukuran file terlalu besar, maksimal 15MB') : locale === "en" ? cy.contains('File size is too large, maximum file size is 15MB') : -1
    }

    validateValidationMessageWhenFileIsNotPdf(locale) {
        locale === "id" ? cy.contains('Tipe file tidak valid, hanya menerima PDF') : locale === "en" ? cy.contains('Invalid file type, only accept PDF') : -1
    }


    uploadFile(filePath) {
        cy.wait(1000)
        cy.contains('Upload Proposal').scrollIntoView()
        cy.get('input[type="file"]').selectFile(filePath, { force: true })
    }
}

export const onRegisterEventPage = new RegisterEventPage()