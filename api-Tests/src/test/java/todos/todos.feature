Feature: Todos API

  # Background runs before every scenario
  # baseUrl comes from karate-config.js
  Background:
    * url baseUrl
    * def todoData = read('classpath:todos/data/todos.json')

  # SCENARIO 1 - End to End CRUD Flow
  # Covers happy path for all HTTP methods in sequence
  # Note: JSONPlaceholder simulates write operations but does not persist data
  # POST response is validated in isolation as the returned ID cannot be fetched afterwards
  Scenario: End to end CRUD flow
    # CREATE
    Given path '/todos'
    And request todoData
    When method POST
    Then status 201
    And match response.id == '#number'
    And match response.title == todoData.title
    And match response.userId == todoData.userId
    And match response.completed == todoData.completed

    # READ - using existing known ID since POST does not persist
    Given path '/todos/1'
    When method GET
    Then status 200
    And match response.id == 1
    And match response.title == '#string'

    # UPDATE - full update
    Given path '/todos/1'
    And request { userId: 1, id: 1, title: 'Updated todo', completed: true }
    When method PUT
    Then status 200
    And match response.title == 'Updated todo'
    And match response.completed == true

    # PARTIAL UPDATE
    Given path '/todos/1'
    And request { completed: false }
    When method PATCH
    Then status 200
    And match response.completed == false

    # DELETE
    Given path '/todos/1'
    When method DELETE
    Then status 200

  # SCENARIO 2 - Error Handling
  # Covers 404 for non existent resource and missing required fields
  Scenario: Error handling for invalid requests
    # Non existent resource
    Given path '/todos/999999'
    When method GET
    Then status 404

    # POST with empty body - JSONPlaceholder accepts this but we validate response
    Given path '/todos'
    And request {}
    When method POST
    Then status 201
    And match response.id == '#number'

  # SCENARIO 3 - Filter todos by userId
  # Validates query parameter filtering returns correct results
  Scenario: Filter todos by userId
    Given path '/todos'
    And param userId = 1
    When method GET
    Then status 200
    # Assert response is an array
    And match response == '#[]'
    # Assert every item belongs to userId 1
    And match each response == { userId: 1, id: '#number', title: '#string', completed: '#boolean' }
    # Assert results are not empty
    And assert response.length > 0

  # SCENARIO 4 - JSON Schema Validation and Response Headers
  # Validates response structure data types and headers
  Scenario: Validate response schema and headers
    Given path '/todos/1'
    When method GET
    Then status 200
    # Validate response headers
    And match header Content-Type contains 'application/json'
    # Validate full schema
    And match response ==
      """
      {
        "userId": "#number",
        "id": "#number",
        "title": "#string",
        "completed": "#boolean"
      }
      """
    # Validate no extra fields exist
    And match response == { userId: '#number', id: '#number', title: '#string', completed: '#boolean' }

  # SCENARIO 5 - Helper Function and Test Data Setup
  # Demonstrates calling a reusable helper feature and test data approach
  Scenario: Create todo using helper and validate response
    # Call helper feature to create a todo
    * def result = call read('classpath:todos/helpers/create-todo.feature')
    * def createdTodo = result.createdTodo

    # Validate the helper returned correct data
    And match createdTodo.id == '#number'
    And match createdTodo.title == 'Helper created todo'
    And match createdTodo.completed == false
    And match createdTodo.userId == 1

    # Validate complete schema of created resource
    And match createdTodo ==
      """
      {
        "userId": "#number",
        "id": "#number",
        "title": "#string",
        "completed": "#boolean"
      }
      """
    # Read multiple user ids
  Scenario Outline: Multiple user id fetch
    Given path '/todos', <id>
    When method GET
    Then status 200
    And match response.id == <id>
    And match response.title == '#string'

    Examples:
      |id|
      |1 |
      |97|
      |37|
      |73|
