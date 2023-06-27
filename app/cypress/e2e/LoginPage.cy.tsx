describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Are all elements present on login page?', () => {
    cy.get('h1').contains('Staff Purchase Reimbursement');
    cy.get('button').contains('Log In');
    cy.get('h3').contains('Login Required');
    cy.get('p').contains('To access this application, log in with your IDIR.');
  });

  it('Log In process gets to Home page.', () => {
    // Log In Process
    cy.get('button').click();
    cy.origin(Cypress.env('auth_base_url'), () => {
      cy.contains('IDIR').click();
    });
    cy.origin(Cypress.env('auth_logon_url'), () => {
      cy.get('input[name="user"]').click();
      cy.get('input[name="user"]').type(Cypress.env('test_username'));
      cy.get('input[name="password"]').click();
      cy.get('input[name="password"]').type(Cypress.env('test_password'));
      cy.get('input[name="btnSubmit"').click();
    });
    // Should be at home page
    cy.get('h2').contains('Reimbursement Requests');
    cy.get('td').contains('No requests available.');
    // Should not have admin view
    cy.get('span').contains('Admin view').should('not.exist');
  });
});
