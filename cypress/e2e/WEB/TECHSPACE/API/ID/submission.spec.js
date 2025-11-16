const { deleteSubmissionFromUserWhenExist } = require('../../../../../support/helper/deleteSubmission');
const { isWithinProposalRange, isWithinRegistrationRange } = require('../../../../../support/helper/isWithinTimeRange');
const { adjustTimeSetting } = require('../../../../../support/helper/adjustTimeSetting');
const { getNewValidEventDate, getNewInvalidEventDate, getNewInvalidEventDateAfterProposal } = require('../../../../../support/helper/getNewEventDate');

describe('When testing submission API positively,', () => {
    let cookieToken;
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration

    before('get token', () => {

        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')

        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })

        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
            }
        })

        deleteSubmissionFromUserWhenExist()
    })

    it('should return null when getting submission prior saving or submitting', () => {
        const responseData = {
            "data": null
        }
        cy.fixture('WEB/submission/responseSchemaForNoPriorSubmission.json').then(schema => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('API_URL')}api/web/techspace/profile/submission`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.jsonSchema(schema)
                expect(response.body).to.deep.equal(responseData)
            })
        })
    })

    it('should return valid data when saving draft', () => {
        cy.fixture('WEB/submission/testData.json').then(data => {
            const FormData = require('form-data');
            let payload = new FormData();
            payload.append('data', JSON.stringify(data))
            cy.request({
                method: 'POST',
                url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value,
                    'content-type': 'multipart/form-data'
                },
                body: payload,
            }).then(response => {
                const text = new TextDecoder().decode(response.body);
                const jsonData = JSON.parse(text);
                cy.fixture('WEB/submission/responseSchemaForDraft.json').then(schema => {
                    expect(jsonData).to.be.jsonSchema(schema)
                })
                cy.fixture('WEB/submission/responseDataForSaving.json').then(responseData => {
                    expect(jsonData.data).to.deep.include(responseData.data)
                })
            })
        })
    })

    //NOTE: Environment issue. Request berhasil namun data kembalian not keluar on env techcorp
    //NOTE: On env RGB berhasil. Hit API on env techcorp melalui postman sukses
    it('should return valid data when submitting form', () => {
        cy.fixture('WEB/submission/submitTestData.json').then(data => {
            cy.readFile('document.pdf', null).then(pdf => {
                const FormData = require('form-data');
                const fs = require('fs');
                let payload = new FormData();
                payload.append('data', JSON.stringify(data))
                const blob = new Blob([pdf], { type: 'application/pdf' });
                payload.append('files.proposal', blob);

                cy.request({
                    method: 'POST',
                    url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms/submit`,
                    headers: {
                        'Authorization': 'Bearer ' + cookieToken.value,
                        'Content-Type': 'multipart/form-data',
                        'Accept-Encoding': 'gzip, deflate, br',
                    },
                    body: payload,

                }).then(response => {
                    expect(response.status).to.equal(200)
                });
            });
        });
    });

    //NOTE: Environment issue. Request berhasil namun data kembalian not keluar on env techcorp
    //NOTE: On env RGB berhasil. Hit API on env techcorp melalui postman sukses
    it('should return valid data when getting submission after saving or submitting form', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/profile/submission`,
            headers: {
                'Authorization': 'Bearer ' + cookieToken.value
            }
        }).then(response => {
            expect(response.status).to.equal(200)

            cy.fixture('WEB/submission/responseSchemaForDetail.json').then(schema => {
                expect(response.body).to.be.jsonSchema(schema)
            })
            cy.fixture('WEB/submission/responseDataForGetting.json').then(responseData => {
                expect(response.body.data).to.deep.include(responseData.data_1)
                expect(response.body.data.innovationCategory).to.deep.include(responseData.innovationCategory)
                expect(response.body.data.referral).to.deep.include(responseData.referral)
                expect(response.body.data.proposal).to.deep.include(responseData.proposal)
                expect(response.body.data.domicileCity).to.deep.include(responseData.domicileCity)
            })
        })
    })

    after('Rollback to previous setting', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })
})

describe('While testing submission API negatively,', () => {
    let cookieToken;
    let previousOpenProposal
    let previousCloseProposal
    let previousOpenRegistration
    let previousCloseRegistration
    let currentTimeRangeObject

    before('get token', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspace/setting`,
        }).then(response => {
            previousOpenRegistration = response.body.data.attributes.openRegistration
            previousCloseRegistration = response.body.data.attributes.closeRegistration
            previousOpenProposal = response.body.data.attributes.openProposal
            previousCloseProposal = response.body.data.attributes.closeProposal
            currentTimeRangeObject = response.body
        })

        cy.intercept({
            method: 'GET', url: `${Cypress.env('API_URL')}api/web/techspace/setting`
        }).as('setting')

        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })

        cy.wait('@setting').its('response.body').then(obj => {
            if (!isWithinProposalRange(obj)) {
                const newDates = getNewValidEventDate()
                adjustTimeSetting(newDates)
                currentTimeRangeObject = {
                    data: {
                        attributes: newDates
                    }
                }
            }
        })
        deleteSubmissionFromUserWhenExist()
    })


    it('should return error when saving draft with invalid token', () => {
        cy.fixture('WEB/submission/testData.json').then(data => {
            const FormData = require('form-data');
            let payload = new FormData();
            payload.append('data', JSON.stringify(data))
            cy.fixture('WEB/auth/invalidToken.json').then(tokens => {
                cy.wrap(tokens.data).each(item => {
                    cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                        cy.request({
                            method: 'POST',
                            url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms`,
                            headers: {
                                'Authorization': 'Bearer ' + item.token,
                                'content-type': 'multipart/form-data'
                            },
                            body: payload,
                            failOnStatusCode: false
                        }).then(response => {
                            const text = new TextDecoder().decode(response.body);
                            const jsonData = JSON.parse(text);
                            expect(response.status).to.equal(item.statusCode)
                            expect(jsonData).to.be.jsonSchema(schema)
                            expect(jsonData).to.deep.equal(item.response)
                        })
                    })
                })
            })
        })
    })

    it('should return error when submiting submission with invalid token', () => {
        cy.fixture('WEB/submission/testData.json').then(data => {
            cy.fixture('WEB/registerEvent/document.pdf', 'binary').then(pdf => {
                const FormData = require('form-data');
                let payload = new FormData();
                payload.append('data', JSON.stringify(data))
                const blob = new Blob([pdf], { type: 'application/pdf' });
                payload.append('files.proposal', blob, 'document.pdf');
                cy.fixture('WEB/auth/invalidToken.json').then(tokens => {
                    cy.wrap(tokens.data).each(item => {
                        cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                            cy.request({
                                method: 'POST',
                                url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms/submit`,
                                headers: {
                                    'Authorization': 'Bearer ' + item.token,
                                    'content-type': 'multipart/form-data'
                                },
                                body: payload,
                                failOnStatusCode: false
                            }).then(response => {
                                const text = new TextDecoder().decode(response.body);
                                const jsonData = JSON.parse(text);
                                expect(response.status).to.equal(item.statusCode)
                                expect(jsonData).to.be.jsonSchema(schema)
                                expect(jsonData).to.deep.equal(item.response)
                            })
                        })
                    })
                })
            })
        })
    })

    it('should return error when hitting get with invalid token', () => {
        cy.fixture('WEB/auth/invalidToken.json').then(tokens => {
            cy.wrap(tokens.data).each(item => {
                cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                    cy.request({
                        method: 'GET',
                        url: `${Cypress.env('API_URL')}api/web/techspace/profile/submission`,
                        headers: {
                            'Authorization': 'Bearer ' + item.token
                        },
                        failOnStatusCode: false
                    }).then(response => {
                        expect(response.status).to.equal(item.statusCode)

                        cy.fixture('WEB/auth/responseForInvalidTokenSchema.json').then(schema => {
                            expect(response.body).to.be.jsonSchema(schema)
                        })
                        expect(response.body).to.deep.equal(item.response)
                    })
                })
            })
        })
    })



    it('should return error when submitting file outside .pdf format', () => {
        const responseData = {
            "data": null,
            "error": {
                "status": 400,
                "name": "BadRequestError",
                "message": "Hanya format .pdf that diterima",
                "details": {}
            }
        }
        cy.fixture('WEB/submission/responseSchemaForFileOutsidePDF.json').then(schema => {
            cy.fixture('WEB/submission/submitTestData.json').then(data => {
                cy.fixture('WEB/registerEvent/invalidData.json').then(invalidData => {
                    cy.wrap(invalidData.data).each(item => {
                        const FormData = require('form-data');
                        let payload = new FormData();
                        payload.append('data', JSON.stringify(data))
                        const blob = new Blob([item.fileExt], { type: item.fileType });
                        payload.append('files.proposal', blob, item.file);

                        cy.request({
                            method: 'POST',
                            url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms/submit`,
                            headers: {
                                'Authorization': 'Bearer ' + cookieToken.value,
                                'Content-Type': 'multipart/form-data',
                                'Accept-Encoding': 'gzip, deflate, br'
                            },
                            body: payload,
                            failOnStatusCode: false

                        }).then(response => {
                            const text = new TextDecoder().decode(response.body);
                            const jsonData = JSON.parse(text);
                            expect(response.status).to.be.equal(400)
                            expect(jsonData).to.be.jsonSchema(schema)
                            expect(jsonData).to.deep.equal(responseData)
                        });
                    })
                })
            });
        })

    });

    //NOTE: On env techcorp kembalian berupa status 413 and html nginx. Validasi hanya dilakukan to kode 
    it('should return error when submitting pdf file larger than 15 MB', () => {
        const responseData = {
            "data": null,
            "error": {
                "status": 400,
                "name": "BadRequestError",
                "message": "Ukuran file proposal terlalu besar, maksimal 15 MB",
                "details": {}
            }
        }
        cy.fixture('WEB/submission/responseSchemaForFileLargerThan15Mb.json').then(schema => {
            cy.fixture('WEB/submission/submitTestData.json').then(data => {
                cy.fixture('WEB/registerEvent/16MB-TESTFILE.pdf', 'binary').then(pdf => {
                    const FormData = require('form-data');
                    let payload = new FormData();
                    payload.append('data', JSON.stringify(data))
                    const blob = new Blob([pdf], { type: 'application/pdf' });
                    payload.append('files.proposal', blob, '16MB-TESTFILE.pdf');

                    cy.request({
                        method: 'POST',
                        url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms/submit`,
                        headers: {
                            'Authorization': 'Bearer ' + cookieToken.value,
                            'Content-Type': 'multipart/form-data',
                            'Accept-Encoding': 'gzip, deflate, br'
                        },
                        body: payload,
                        failOnStatusCode: false

                    }).then(response => {
                        expect(response.status).to.be.equal(413)
                    });
                });
            });
        })

    });


    it('should return error when saving outside proposal time', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })

        const newDates = getNewInvalidEventDateAfterProposal()
        adjustTimeSetting(newDates)

        const responseData = {
            "data": null,
            "error": {
                "status": 400,
                "name": "BadRequestError",
                "message": "Maaf! pendaftaran proposal already ditutup",
                "details": {}
            }
        }
        cy.fixture('WEB/submission/testData.json').then(data => {
            const FormData = require('form-data');
            let payload = new FormData();
            payload.append('data', JSON.stringify(data))
            cy.request({
                method: 'POST',
                url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms`,
                headers: {
                    'Authorization': 'Bearer ' + cookieToken.value,
                    'content-type': 'multipart/form-data'
                },
                body: payload,
                failOnStatusCode: false
            }).then(response => {
                const text = new TextDecoder().decode(response.body);
                const jsonData = JSON.parse(text);
                expect(response.status).to.be.equal(400)
                cy.fixture('WEB/submission/responseSchemaForSavingOutsideAllowedTime.json').then(schema => {
                    expect(jsonData).to.be.jsonSchema(schema)
                })
                expect(jsonData).to.deep.equal(responseData)
            })
        })
    })

    it('should return error when submitting form outside the proposal submission time', () => {
        cy.openHomepage()
        cy.LoginToTechSpace('id')
        cy.getCookie('telas23saa').then(cookie => {
            cookieToken = cookie
        })

        const newDates = getNewInvalidEventDateAfterProposal()
        adjustTimeSetting(newDates)

        const responseData = {
            "data": null,
            "error": {
                "status": 400,
                "name": "BadRequestError",
                "message": "Maaf! pendaftaran proposal already ditutup",
                "details": {}
            }
        }

        cy.fixture('WEB/submission/submitTestData.json').then(data => {
            cy.fixture('WEB/registerEvent/document.pdf', 'binary').then(pdf => {
                const FormData = require('form-data');
                let payload = new FormData();
                payload.append('data', JSON.stringify(data))
                const blob = new Blob([pdf], { type: 'application/pdf' });
                payload.append('files.proposal', blob, 'document.pdf');

                cy.request({
                    method: 'POST',
                    url: `${Cypress.env('API_URL')}api/web/techspace/submission-forms/submit`,
                    headers: {
                        'Authorization': 'Bearer ' + cookieToken.value,
                        'Content-Type': 'multipart/form-data',
                        'Accept-Encoding': 'gzip, deflate, br'
                    },
                    body: payload,
                    failOnStatusCode: false

                }).then(response => {
                    const text = new TextDecoder().decode(response.body);

                    const jsonData = JSON.parse(text);
                    expect(response.status).to.be.equal(400)
                    cy.fixture('WEB/submission/responseSchemaForSubmittingOutsideAllowedTime.json').then(schema => {
                        expect(jsonData).to.be.jsonSchema(schema)
                    })
                    expect(jsonData).to.deep.equal(responseData)
                })
            });
        });
    });

    after('Rollback to previous setting', () => {
        const rollbackSetting = {
            openRegistration: previousOpenRegistration,
            closeRegistration: previousCloseRegistration,
            openProposal: previousOpenProposal,
            closeProposal: previousCloseProposal,
        }
        adjustTimeSetting(rollbackSetting)
    })
})
