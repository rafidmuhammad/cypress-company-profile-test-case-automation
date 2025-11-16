export function checkTypeForAllPages(url, fixture, page, target, lan = 'id') {
    cy.fixture(fixture).then(schema => {
        cy.request({
            method: 'GET',
            url: `${url}?filters[type][$eq]=${target}&pagination[page]=${page}&locale=${lan}`,
        }).then(res => {
            let currentPage = res.body.meta.pagination.page
            let totalPage = res.body.meta.pagination.pageCount

            if (currentPage < totalPage) {
                checkTypeForAllPages(url, fixture, (currentPage += 1), target)
            }
            expect(res.status).to.equal(200)
            expect(res.body).to.be.jsonSchema(schema)
            cy.wrap(res.body.data).each((item) => {
                expect(item.attributes.type).to.equal(target)
            })


        })
    })
}