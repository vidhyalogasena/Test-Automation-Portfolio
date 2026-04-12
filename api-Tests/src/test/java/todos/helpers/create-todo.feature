@ignore
Feature: Helper - Create Todo

  Scenario: Create a todo and return response
    Given url 'https://jsonplaceholder.typicode.com/todos'
    And request { userId: 1, title: 'Helper created todo', completed: false }
    When method POST
    Then status 201
    * def createdTodo = response