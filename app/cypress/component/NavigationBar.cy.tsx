import React from 'react';
import NavigationBar from '../../src/components/bcgov/NavigationBar';

describe('<NavigationBar />', () => {
  it('renders', () => {
    cy.mount(<NavigationBar />);
    cy.get('h1').contains('Staff Purchase Reimbursement');
  });
});
