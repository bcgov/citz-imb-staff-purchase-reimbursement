import React from 'react'
import App from '../../src/App'

describe('<App />', () => {
  it('renders', () => {
    cy.mount(<App />)
    cy.get('h1').contains('Vite + React');
  })
})
