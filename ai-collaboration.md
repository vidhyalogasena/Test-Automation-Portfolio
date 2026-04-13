# AI Collaboration

## Overview
Claude (Sonnet 4.6) was used throughout this task as a productivity tool
for guidance, debugging, code generation and documentation. This file
documents how AI was used, where output was validated or modified and
the approach taken to balance productivity with quality.

---

## AI Tool Used
Claude Sonnet 4.6 by Anthropic

---

## How AI Was Used

### Test Code Generation
Claude was used to generate Karate feature files based on a list of test
scenarios provided. Rather than writing each scenario from scratch the
approach was to describe the requirements and refine the output based on
what the API actually supports.

Claude was also used to review Cypress test code for quality and
maintainability — highlighting repetitive elements and suggesting
improvements to keep the code clean.

### Debugging
Claude was used to investigate failing tests by sharing error messages
and code snippets. This helped identify root causes faster than working
through errors manually.

### Documentation
Both README files were written with Claude's help. The approach was to
ask clarifying questions first before generating any content to make
sure the output was accurate and project specific rather than generic.

---

## Prompt That Generated Useful Test Code

**Prompt:**
> "I have a list of generic API test scenarios covering different testing
> areas. Can you review each one and carefully select the ones that are
> applicable for the JSONPlaceholder API, explaining why certain scenarios
> cannot be applied given the API's limitations and constraints?"

The list provided was:
- Input Validation Tests
- Authentication and Authorization Tests
- HTTP Method Tests
- Response Validation Tests
- JSON API
- XML API
- XML Schema Validation
- JSON Schema Validation
- Validate Response Headers
- End-to-End CRUD Flow
- Database Integrity Test Cases

**What Claude did:**
Reviewed each scenario against JSONPlaceholder's capabilities and
identified which were achievable. Authentication, XML and database
integrity tests were ruled out with clear reasoning — JSONPlaceholder
has no auth mechanism, only supports JSON and does not persist data.
The remaining applicable scenarios were used as the basis for the
final feature file covering CRUD flow, error handling, filtering,
schema validation and response headers.

This saved time by avoiding scenarios that would produce misleading
results and kept the test suite focused on what the API genuinely
supports.

---

## Prompt That Required Significant Refinement

This was an iterative conversation around maintaining login state
across multiple Cypress tests.

**Initial prompt:**
> "How do I maintain login state across multiple test cases in Cypress
> without logging in repeatedly for each test?"

**What Claude did:**
Suggested using `cy.session()` with cookie based validation to cache
login state. The implementation looked like:

```javascript
cy.session("login", () => {
    cy.visit("/");
    LoginPage.login(data.username, data.password);
}, {
    validate() {
        cy.getCookie("session-username").should("exist");
    }
});
```

**What happened:**
When implemented this caused intermittent failures. The session was
being created correctly on the first run but during restoration
the validation was checking the URL on a blank page which failed
every time causing the session to recreate rather than restore.

**Follow up prompt:**
> "The cy.session() approach is causing intermittent failures during
> session restoration. Can you suggest a simpler alternative that
> still keeps the tests clean and avoids repeating login steps?"

**What Claude did:**
Suggested simplifying to a `beforeEach` login approach and noted
that `cy.session()` could be revisited as a future improvement
once the test suite grows. This was the right call — the simpler
approach was more reliable for this specific application and the
trade off was documented in the README.

---

## Prompt Used to Generate README Documentation

**Prompt:**
> "Based on the task requirements can you create a README that covers
> setup instructions, project structure, testing approach, assumptions,
> challenges and what would be improved given more time. Keep the
> language clear and straightforward without overcomplicating it.
> If anything is unclear please ask before proceeding."

**What Claude did:**
Asked clarifying questions about versions, folder structure, actual
challenges faced and future improvements before writing anything.
This meant the output reflected the real project rather than a
generic template. The content was reviewed and sections were reworded
where the phrasing didn't match how things actually happened.

---

## How AI Was Used to Identify Edge Cases

During exploratory testing of Sauce Demo an edge case was discovered
where the app allows checkout with an empty cart resulting in a $0
order. Claude was used to discuss how to assert this correctly —
whether to assert the correct expected behaviour or document the
actual broken behaviour.

The decision was to assert the correct expected behaviour and let
the test fail intentionally to document the bug. Claude also helped
think through the different Sauce Demo user types and what each one
was designed to test — identifying that `error_user` has a frozen
lastName field and that `performance_glitch_user` introduces a login
delay requiring an extended assertion timeout.

---

## Where AI Output Was Modified

| Situation | AI Suggestion | What Was Changed |
|-----------|--------------|-----------------|
| cy.session() | Cookie based session validation | Removed entirely, simplified to beforeEach login |
| Error handling | Generic exception suppression | Scoped to specific error messages only |
| Karate dependency | io.karatelabs group ID | Switched to com.intuit.karate after Maven resolution failure |
| calculateTotalAmount() | Separate method returning a value | Merged into checkoutOverview as nested .then() chains due to async limitations |
| README content | Initial draft needed rewording | Sections reworded to accurately reflect what actually happened |

---

## AI as Productivity Tool vs Quality Risk

### Where AI Helped
- Reduced time spent on boilerplate setup for both Cypress and Karate
- Helped diagnose errors faster by explaining what error messages meant
- Generated README structure covering all task requirements
- Suggested Karate fuzzy matching syntax and helper feature patterns
  which were new concepts for this task

### Where AI Introduced Risk
- Suggested an outdated Karate dependency group ID that did not
  resolve on Maven Central
- Provided a cy.session() implementation that worked in theory but
  failed in practice against this specific application
- Initial exception handling was too broad and would have masked
  real errors in other tests if accepted without review

### Approach Taken
AI was treated as a starting point rather than a final answer.
Every suggestion was tested against the actual application before
being accepted. Where suggestions failed the reasoning was understood
before making changes rather than just trying different things until
something worked. This kept the quality of the output in check
while still benefiting from the speed AI provides.

---

## AI Governance and Data Security

- No real credentials or sensitive data were shared with Claude
  at any point
- Only public URLs were used — Sauce Demo and JSONPlaceholder are
  both publicly available demo applications intended for testing
- No internal systems, proprietary code or client data was shared
- All test credentials used in the project are publicly documented
  on the Sauce Demo website and carry no security risk
- Claude was used through the claude.ai interface which is covered
  by Anthropic's usage policies
```