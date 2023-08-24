describe("Feature Signup", () => {
  it("should be able to signup a new user", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get("#username").type("bert");
    cy.get("#mail").type("bert@bert.com");
    cy.get("#password").type("abcd1234{enter}");
    cy.location("pathname").should("eq", "/");
  });
});
