describe('Login Page', () => {
  it('Are all elements present on login page?', () => {
    cy.visit('http://localhost:8080');
    cy.get('h1').contains('Staff Purchase Reimbursement');
    cy.get('button').contains('Log In');
    cy.get('h3').contains('Login Required');
    cy.get('p').contains('To access this application, log in with your IDIR.');
  });
});
