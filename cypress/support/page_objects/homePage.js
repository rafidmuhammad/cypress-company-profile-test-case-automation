export class HomePage {
    checkUrl() {
        cy.url().should('contain', Cypress.config().baseUrl)
    }

    validatePagePath() {
        cy.location('pathname').should('contain', 'techspaces')
    }

    checkAllElement(isLoggedIn, locale) {
        //NOTE: Validating video
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
        cy.get('video source').should('have.attr', 'src')
        //NOTE: Validating banner button
        if (isLoggedIn) {
            cy.get('[data-cy="banner-button"]', { timeout: 5000 }).should('contain', 'Announcement').and('contain', 'My Account').and('contain', 'TechSpace Conference')
        }
        else {
            cy.get('[data-cy="banner-button"]', { timeout: 5000 }).should('contain', 'Announcement').and('contain', 'Register').and('contain', 'TechSpace Conference')
        }
        //NOTE: Validating home description
        cy.get('[data-cy="/techspaces-welcome"]').scrollIntoView()
        cy.get('[data-cy="/techspaces-welcome"]').should('be.visible')
        cy.wait(1000)
        cy.get('[data-cy="/techspaces-description"]', { timeout: 5000 }).should('be.visible')
        //NOTE: Validating program details
        cy.get('[data-cy="program-card"]').should('be.visible')
        //NOTE: Validating pariticipation info
        cy.get('[data-cy="participation-tab"]').scrollIntoView()
        cy.wait(1000)
        cy.get('[data-cy="participation-tab"]', { timeout: 5000 }).should('be.visible')
        cy.get('[data-cy="participation-detail"]').eq(0).scrollIntoView()
        cy.get('[data-cy="participation-detail"]', { timeout: 5000 }).should('be.visible')
        cy.get('div.ProgramSection_container__Oh2mi [data-cy="register"]').should('be.visible')
        //NOTE: Validating timeline
        cy.contains('Timeline').scrollIntoView()
        cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).should('be.visible')
        cy.get('div.TimelineSection_section__dp2CA [data-cy="register"]').should('be.visible')
        //NOTE: Validating Judges and Mentor
        cy.wait('@judgesAndMentors').its('response.body').then(obj => {
            if (obj.data.length) {
                cy.get('[data-cy="judges-mentor-button"]').eq(0).scrollIntoView()
                cy.get('[data-cy="judges-mentor-button"]').should('be.visible')
                cy.contains('Judge & Mentor').should('be.visible')
                cy.get('[class="MentorCard_card__bFBEF m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]').should('be.visible')
            }
        })
        //NOTE: Validating partner
        cy.get('[data-cy="partners"]').should('be.visible')
    }

    checkBannerButtonCondition(isLoggedIn, locale) {
        if (isLoggedIn) {
            cy.get('[data-cy="banner-button"]').should('contain', 'My Account')
        }
        else {
            cy.get('[data-cy="banner-button"]').should('contain', 'Register')
        }
    }


    checkVideoBanner() {
        cy.get('video').should('be.visible')
        cy.get('video').should('have.attr', 'loop')
        cy.get('video').should('have.attr', 'autoplay')
    }

    clickMyAccount(locale) {
        cy.get('[data-cy="banner-button"] a').eq(1).should('contain', 'My Account').click()
    }

    NavigateToAnnouncementThroughBanner() {
        cy.contains('[data-cy="banner-button"]', 'Announcement')
    }

    NavigateToRegistrationThroughBanner() {
        cy.contains('[data-cy="banner-button"]', 'Register')
    }

    NavigateToConferenceThroughBanner(locale) {
        cy.get('[data-cy="banner-button"]').contains('TechSpace Conference').click()
    }

    clickAnnouncement(locale) {
        cy.contains('a', 'Announcement').click()
    }

    clickConference() {
        cy.contains('a', 'TechSpace Conference').click()
    }

    checkHomepageDescription(body) {
        cy.get('[data-cy="/techspaces-description"]').scrollIntoView()
        cy.get('[data-cy="/techspaces-description"]', { timeout: 5000 }).contains(body.data.attributes.homepageDescription).isVisible()
    }

    checkProgramDetails(body) {
        cy.get('[data-cy="program-card"].WelcomeSection_contentBox__wPPHS', { timeout: 5000 }).each((item, index) => {
            cy.wrap(item, { timeout: 5000 }).scrollIntoView()
            cy.wait(1000)
            cy.wrap(item, { timeout: 5000 }).contains(body.data[index].attributes.title).should('be.visible')
            cy.wrap(item, { timeout: 5000 }).contains(body.data[index].attributes.description).should('be.visible')
        })
    }

    checkToParticipationInfo(body) {
        cy.get('[data-cy="participation-tab"]', { timeout: 6000 }).scrollIntoView()
        cy.get('[data-cy="participation-tab"] button').each((item, indexTabbing) => {
            cy.wrap(item).click({ force: true })
            cy.get('[data-cy="participation-detail"]').each((item, indexData) => {
                cy.wrap(item).should('contain', body.data[indexTabbing].attributes.participationInfos[indexData].title).and('exist')
                cy.wrap(item).should('contain', body.data[indexTabbing].attributes.participationInfos[indexData].description).and('exist')
            })
        })
    }

    clickRegisterNearParticipationInfo() {
        cy.get('[data-cy="register"]').eq(0).click()
    }

    checkTimeline(body) {
        let options = { day: "2-digit", month: "short" };
        cy.wrap(body.data).each((item, index) => {
            let startDate = new Date(item.attributes.startDate)
            const formattedStartDate = new Intl.DateTimeFormat("id-ID", options).format(startDate).replace(/^0+/, '');
            cy.get('[data-cy="timeline-card"]').eq(index).scrollIntoView()
            cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).eq(index).contains(item.attributes.description).isVisible()
            cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).eq(index).contains(item.attributes.title).isVisible()
            if (item.attributes.estimatedTime) {
                let endDate = new Date(item.attributes.endDate)
                const formattedEndDate = new Intl.DateTimeFormat("id-ID", options).format(endDate).replace(/^0+/, '');
                cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).eq(index).contains(item.attributes.estimatedTime).isVisible()
                cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).eq(index).contains(formattedEndDate).isVisible()
            }
            cy.get('[data-cy="timeline-card"]', { timeout: 5000 }).eq(index).contains(formattedStartDate).isVisible()
            cy.get('img', { timeout: 5000 }).isVisible()


        })
    }

    checkJudges(locale) {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspaces/judges-mentors?filters[type][$eq]=Judges&pagination[pageSize]=100`,
        }).then(response => {
            if (response.body.data.length) {
                cy.wait(1000)
                cy.contains('Judge & Mentor').scrollIntoView()
                cy.get('[class="MentorCard_card__bFBEF m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]', { timeout: 5000 }).each((item, index) => {
                    cy.wrap(item).find('img.MentorCard_image__XIGAz', { timeout: 5000 }).invoke('attr', 'src').should('not.be.empty')
                    cy.wrap(item).click()
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.name)
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.position)
                    if (response.body.data[index].attributes.company) {
                        cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.company)
                    }
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').find('svg').isVisible()
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').find('a').invoke('attr', 'href').then(val => {
                        expect(val).to.satisfy(url => {
                            return url === response.body.data[index].attributes.linkedInProfileUrl || url === undefined
                        })
                    })
                })
            }
        })
    }

    checkMentor() {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('API_URL')}api/web/techspaces/judges-mentors?filters[type][$eq]=Mentor&pagination[pageSize]=100`,
        }).then(response => {
            if (response.body.data.length) {
                cy.wait(1000)
                cy.get('[data-cy="judges-mentor-button"]').contains('Mentor').click()
                cy.wait(1000)
                cy.get('[class="MentorCard_card__bFBEF m-e615b15f mantine-Card-root m-1b7284a3 mantine-Paper-root"]').each((item, index) => {
                    cy.wrap(item).find('img.MentorCard_image__XIGAz').invoke('attr', 'src').should('not.be.empty')
                    cy.wrap(item).click()
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.name)
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.position)
                    if (response.body.data[index].attributes.company) {
                        cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').should('be.visible').and('contain', response.body.data[index].attributes.company)
                    }
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').find('svg').isVisible()
                    cy.wrap(item).find('[class="MentorCard_overlayText__GbbNs"]').find('a').invoke('attr', 'href').then(val => {
                        expect(val).to.satisfy(url => {
                            return url === response.body.data[index].attributes.linkedInProfileUrl || url === undefined
                        })
                    })
                })
            }
        })
    }


    checkPartner(body) {
        cy.wrap(body.data).each((element, index) => {
            if (element.attributes.partners.length) {
                cy.get('[data-cy="partners"]').should('contain', element.attributes.name)
                cy.contains(element.attributes.name).parent().find('img').each((item, Imageindex) => {
                    cy.wrap(item).invoke('attr', 'src').should('not.be.empty')
                })
            }
            else {
                cy.get('[data-cy="partners"]').should('not.contain', element.attributes.name)
            }
        })
    }

    clickRegisterBannerButton(locale) {
        cy.get('[data-cy="banner-button"]', { timeout: 5000 }).contains('Register').click()
    }

    clickRegisterButtonParticipation() {
        cy.get('[data-cy="participation-info-group"] [data-cy="register"]', { timeout: 5000 }).click({ force: true })
    }

    clickRegisterButtonTimeline() {
        cy.get('[data-cy="timeline-group"] [data-cy="register"]', { timeout: 5000 }).scrollIntoView()
        cy.wait(1000)
        cy.get('[data-cy="timeline-group"] [data-cy="register"]', { timeout: 5000 }).click({ force: true })
    }

    validateForMoreInformation(locale) {
        cy.contains('h2', 'Have Questions?').as('information').should('be.visible')
        cy.get('@information').parent().find('button').contains('Click here').should('be.visible')
        cy.get('@information').parent().contains('techspaces@techcorp.com')
        cy.get('@information').parent().contains('techcorpid')
        cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').should('be.visible')
        cy.get('@information').parents('[class="m-dee7bd2f mantine-Grid-inner"]').find('img').invoke('attr', 'src').should('not.be.empty')
    }

    checkCountDownTimer(shouldExist, isClosed = false, locale) {
        if (shouldExist) {
            if (isClosed) {
                cy.get('.TimelineSection_wrapperCountdown__CTL_b').as('countDownTimer')
                cy.get('@countDownTimer').should('contain', 'Competition registration has closed')
            }
            else {
                cy.get('.TimelineSection_wrapperCountdown__CTL_b').as('countDownTimer')
                cy.get('@countDownTimer').should('contain', 'Days').and('be.visible')
                cy.get('@countDownTimer').should('contain', 'Hours').and('be.visible')
                cy.get('@countDownTimer').should('contain', 'Minutes').and('be.visible')
                cy.get('@countDownTimer').should('contain', 'Seconds').and('be.visible')
            }
        }
        else {
            cy.get('[data-cy="timeline-group"]').should('not.contain', 'Competition registration has closed')
            cy.get('[data-cy="timeline-group"]').should('not.contain', 'Towards the Closing of the Competition')
        }
    }

    checkModalRegistrationClosed(locale) {
        cy.contains('Sorry, registration is currently closed').should('be.visible')
        cy.get('button').contains('Back').should('be.visible')
    }

    clickCloseModal() {
        cy.get('header').find('button').click()
    }

    clickCompetitionTrack(locale) {
        cy.get('.ProgramSection_menuBar__8F31a').contains('Competition Track').click()
    }

    clickDetailBusinessChallenge(locale) {
        cy.get('[data-cy="participation-info-group"]').contains('Business Challenge').parents('.ProgramSection_cardBoxContent__Ja7co').contains('See Details').click()
    }
}

export const onHomePage = new HomePage()