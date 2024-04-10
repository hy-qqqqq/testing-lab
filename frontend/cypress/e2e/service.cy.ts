describe('Todo Website Sevice Testing', () => {
  const todo_name = 'test'
  const todo_desc = '1234'

  it('After user input and press the Add Todo button, the new todo item should be added on the page', () => {
    // arrange
    cy.visit('/')

    // act
    cy.get('#name').type(todo_name)
    cy.get('#description').type(todo_desc)
    cy.get('.Form > button').click()

    // assert
    cy.get('.Card').contains(todo_name)
  })

  it('After user press the Delete button, the todo item should not be on the page', () => {
    // arrange
    cy.visit('/')

    // act
    cy.get('.Card-button__delete').click()

    // assert
    cy.contains('h1', todo_name).should('not.exist')
  })
})
