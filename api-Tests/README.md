# API Test Automation - JSONPlaceholder Todos using Karate

## Overview
This project contains API tests for the JSONPlaceholder `/todos` endpoint
written using Karate. Tests cover CRUD operations, error handling, filtering,
schema validation and response headers.

---

## Tech Stack
- Java 20.0.1
- Maven 3.9.14
- Karate 1.4.0

---

## Project Structure

```
src/test/java/
├── karate-config.js             # Global configuration - baseUrl
└── todos/
├── TodosTest.java            # Test runner with parallel execution
├── todos.feature             # Test scenarios
├── helpers/
│   └── create-todo.feature   # Reusable helper feature
└── data/
└── todos.json            # Test data
```

---

## Setup

1. Clone the repository
```bash
git clone <repo-url>
cd api-Tests
```

2. Make sure Java and Maven are installed
```bash
java -version
mvn --version
```

3. Install dependencies
```bash
mvn clean install -DskipTests
```

---

## Running Tests

```bash
mvn test
```

After running tests an HTML report is generated at:
```
target/karate-reports/karate-summary.html
```
Open this in a browser to view detailed results.

---

## Test Scenarios

| Scenario | Description |
|----------|-------------|
| End to end CRUD flow | Happy path covering POST GET PUT PATCH and DELETE in sequence |
| Error handling | 404 for non existent resource and empty body POST behaviour |
| Filter todos by userId | Query parameter filtering with array assertions |
| Schema and response headers validation | JSON schema validation and Content-Type header check |
| Helper feature and test data setup | Reusable helper called via `call read()` with schema assertion |
| Scenario Outline - multiple todo fetch | Data driven test fetching todos by different IDs |

---

## Approach

### BDD Style Scenarios
All scenarios follow Given/When/Then structure. Karate has built-in step
definitions so no separate step definition files are needed unlike
traditional Cucumber. This keeps the project lean without sacrificing
readability.

### Global Configuration
`karate-config.js` holds the base URL and any environment level config.
If the base URL changes you update it in one place and all scenarios
pick it up automatically.

### Test Data
Test data lives in `todos/data/todos.json` and is loaded in the
`Background` section making it available to all scenarios. This keeps
test data separate from test logic.

### Helper Features
`helpers/create-todo.feature` is a reusable scenario marked with
`@ignore` so it does not run on its own. It is called from the main
feature using `call read()` demonstrating how Karate handles reusability
without needing Java helper classes.

### Parallel Execution
Tests run in parallel using Karate's built in parallel runner configured
in `TodosTest.java` with 5 threads. This reduces execution time as the
suite grows and is already configured for CI/CD use.

### Test Runner
`TodosTest.java` is the entry point. Maven finds this class when
`mvn test` is executed and uses it to run the feature files in parallel.

---

## CI/CD Integration

Tests run via `mvn test` making them straightforward to add to any
CI/CD pipeline. A GitHub Actions example:

```yaml
name: Karate API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Java
        uses: actions/setup-java@v3
        with:
          java-version: '20'
          distribution: 'temurin'
      - run: mvn test
```

---

## Assumptions

**JSONPlaceholder write operations** — POST PUT PATCH and DELETE are
simulated and do not persist data server side. Write operation tests
validate the response in isolation rather than chaining with subsequent
read requests. Existing IDs between 1 and 200 are used for GET PUT
PATCH and DELETE scenarios.

**Empty POST body** — JSONPlaceholder accepts POST requests without
required fields and returns 201. This is documented as a known API
behaviour rather than treated as a test failure.

**Step definitions** — Karate provides built in step definitions so no
separate steps folder is needed. This is intentional and documented in
the steps folder README.

---

## Challenges

**Karate dependency resolution**
The `io.karatelabs` group ID was not available on Maven Central. Switched
to `com.intuit.karate` which resolved correctly. Worth noting as the
official Karate documentation references the newer group ID.

**Adopting Karate from scratch**
First time using Karate within a time constrained task. The built in DSL
is straightforward once the structure is understood but getting familiar
with fuzzy matching syntax and the `call read()` pattern took some time
initially.

---

## What I Would Add Given More Time

**CI/CD report publishing**
Would extend the GitHub Actions workflow to publish the Karate HTML
report as a pipeline artifact so results are visible directly in the
pull request without running locally.

**Environment switching**
Would extend `karate-config.js` to support multiple environments such
as dev staging and production by reading an environment variable and
switching the base URL accordingly.

**Contract testing**
Schema validation scenarios already act as lightweight contract tests
ensuring the API response structure remains consistent. Formal contract
testing using a dedicated tool like Pact could be introduced for more
robust provider verification across deployments.

---

## Notes
JSONPlaceholder is a free public API used for testing. It intentionally
simulates realistic API behaviour without persisting any data. Tests are
designed around this constraint and assumptions are documented above.
```
