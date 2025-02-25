describe('Login Page', () => {
  it('Wrong login data', () => {
    cy.visit('http://localhost:3000/');
    cy.viewport(1600, 900);

    cy.intercept('**/token?*').as('loginRequest');

    cy.get('[data-test=login]').type('wrongweb');
    cy.get('[data-test=password]').type('123456');

    cy.get('[data-test=login-btn]').click();

    cy.wait('@loginRequest');
    cy.wait(1000);

    cy.url().should('include', '/auth/login');
  });

  it('Right login data', () => {
    cy.visit('http://localhost:3000/');
    cy.viewport(1600, 900);

    cy.intercept('**/token?*').as('loginRequest');

    cy.get('[data-test=login]').type('web');
    cy.get('[data-test=password]').type('12345');

    cy.get('[data-test=login-btn]').click();

    cy.wait('@loginRequest');
    cy.wait(1000);

    cy.url().should('include', '/general');
  });
});
