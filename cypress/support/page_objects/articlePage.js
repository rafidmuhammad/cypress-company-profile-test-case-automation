export class ArticlePage {

    formatDate(dateString, locale) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString(locale, { month: 'short' });
        const year = date.getFullYear();

        const formattedDay = day < 10 ? day.toString() : day;
        const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

        return `${formattedDay} ${formattedMonth} ${year}`;
    }

    validatePagePath(slug) {
        cy.location('pathname').should('equal', '/article')
    }
    checkFilters(locale, data) {
        cy.get('[data-cy="toggle-category"]').each((item, index) => {
            if (index === 0) {
                cy.wrap(item).should('be.visible')
                cy.wrap(item).contains(locale === "id" ? "Semua Kategori" : locale === "en" ? "All Categories" : -1).and('be.visible')
            }
            else if (index !== 0) {
                cy.wrap(item).should('be.visible')
                cy.wrap(item).contains(locale === "id" ? data[index - 1].attributes.name_id : locale === "en" ? data[index - 1].attributes.name_en : -1).and('be.visible')
            }
        })
    }

    checkCards(data, locale) {
        cy.get('[data-cy="article-card-item"]').each((item, index) => {
            const publishedDate = this.formatDate(data[index].attributes.publishedAt, locale)
            cy.wrap(item).should('be.visible')
            cy.wrap(item).find('.LinkCard_bgImg__FVZDu').invoke('attr', 'style').should('contain', 'background-image: url(')
            cy.wrap(item).should('contain', data[index].attributes.title).and('be.visible')
            cy.wrap(item).should('contain', publishedDate).and('be.visible')
        })
    }

    checkNextCards(data, locale) {
        cy.get('#articleList').find('.m-96bdd299.mantine-Grid-col').as("articleListGrid")
        cy.get('@articleListGrid').eq(0).find('[data-cy="article-card-item"]').last().then(item => {
            const publishedDate = this.formatDate(data[0].attributes.publishedAt, locale)
            cy.wrap(item).should('be.visible')
            cy.wrap(item).find('.LinkCard_bgImg__FVZDu').invoke('attr', 'style').should('contain', 'background-image: url(')
            cy.wrap(item).should('contain', data[0].attributes.title).and('be.visible')
            cy.wrap(item).should('contain', publishedDate).and('be.visible')
        })
        cy.get('@articleListGrid').eq(1).find('[data-cy="article-card-item"]').last().then(item => {
            const publishedDate = this.formatDate(data[1].attributes.publishedAt, locale)
            cy.wrap(item).should('be.visible')
            cy.wrap(item).find('.LinkCard_bgImg__FVZDu').invoke('attr', 'style').should('contain', 'background-image: url(')
            cy.wrap(item).should('contain', data[1].attributes.title).and('be.visible')
            cy.wrap(item).should('contain', publishedDate).and('be.visible')
        })
    }

    clickLoadMore() {
        cy.get('[data-cy="load-more-button"]').click()
    }

    clickOtherCategory(locale) {
        cy.get(locale === "id" ? '[data-cy="toggle-category"]' : locale === "en" ? '[data-cy="toggle-category"]' : -1).eq(1).click()
    }

    clickCategoryByName(name) {
        cy.get('[data-cy="toggle-category"]').contains(name).click()
    }

    clickOneOfTheCards() {
        cy.get('[data-cy="article-card-item"]').first().click()
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

    clickSearchField() {
        cy.get('[data-cy="input-search-article"]').click()
    }
    searchArticle(title) {
        cy.get('[data-cy="input-search-article"]').type(title)
    }
    checkNotFoundArticleMessage(title, locale) {
        cy.get('[data-cy="empty-text"]').should('contain', locale === "id" ? `Maaf, pencarian Anda untuk kata "${title}" tidak dapat ditemukan` : locale === "en" ? `Sorry, your search for the words "${title}" could not be found` : -1)
    }
    checkNotFoundCategoryMessage(title, locale) {
        cy.get('[data-cy="empty-text"]').should('contain', locale === "id" ? `Maaf, pencarian Anda untuk kategori "${title}" tidak dapat ditemukan` : locale === "en" ? `Sorry, your search for the category "${title}" could not be found` : -1)
    }
    checkSearchResult(title) {
        cy.get('[data-cy="article-card-item"]').each((item) => {
            cy.wrap(item).should('contain', title).and('be.visible')
        })
    }
}

export const onArticlePage = new ArticlePage()