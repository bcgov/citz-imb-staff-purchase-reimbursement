describe('Health endpoint', () => {
  it('Check health endpoint', () => {
    cy.request('GET', `/health`)
      .then((response) => {
        expect(response).property('status', 200);
      })
  })
})
