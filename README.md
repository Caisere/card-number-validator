# Card Number Validation API

A lightweight REST API that validates credit/debit card numbers using structural checks and the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) (modulus 10 checksum). The service accepts formatted or unformatted card numbers, normalizes the input, and returns a clear pass/fail result.

Built with **Node.js**, **Express 5**, and **TypeScript**. Interactive API docs are generated from Zod schemas (OpenAPI 3.1) and served with [Scalar](https://github.com/scalar/scalar).

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [CI](#ci)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Validate Card Number](#validate-card-number)
- [Validation Rules](#validation-rules)
- [Design Decisions](#design-decisions)
- [Example Requests](#example-requests)

---

## Features

- Validates card numbers for presence, type, digit-only content, and configurable length bounds
- Strips common formatting characters (spaces and hyphens) before validation
- Applies the Luhn checksum algorithm to detect invalid card numbers
- Versioned API under `/api/v1`
- OpenAPI 3.1 spec at `/openapi.json` and interactive docs at `/docs`
- Centralized error handling with a consistent JSON response shape
- Configurable port, card length limits, and public API URL via environment variables
- Health check endpoint for uptime monitoring
- Unit tests for structural validation and the Luhn checksum (Jest)
- GitHub Actions CI that installs, tests, and builds on `main`

---

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (recommended; CI uses Node 22)
- npm (included with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd card-number-validation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and adjust values if needed:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for details on each setting.

---

## Environment Variables

| Variable          | Required | Default (example)        | Description                                         |
| ----------------- | -------- | ------------------------ | --------------------------------------------------- |
| `PORT`            | Yes      | `3000`                   | Port the HTTP server listens on                     |
| `MIN_CARD_LENGTH` | Yes      | `13`                     | Minimum number of digits after formatting strip     |
| `MAX_CARD_LENGTH` | Yes      | `19`                     | Maximum number of digits after formatting strip     |
| `NODE_ENV`        | Yes      | `development`            | Runtime environment (`development` or `production`) |
| `API_URL`         | Yes      | `http://localhost:3000`  | Public base URL used in the OpenAPI server list     |

The application validates that all required variables are present at startup. If any are missing, the process exits with an error.

When `NODE_ENV` is `production`, the OpenAPI `servers` entry uses `API_URL`. Otherwise it uses `http://localhost:<PORT>`.

---

## Running the Server

### Development (with hot reload)

```bash
npm run dev
```

Uses `tsx watch` to recompile and restart on file changes.

### Production build

```bash
npm run build
npm start
```

Compiles TypeScript to `dist/` and runs the compiled JavaScript with Node.

Once running, the server logs:

```
Server is now running on port http://localhost:3000
```

All application routes are mounted under the `/api/v1` prefix. Docs live at the root (`/docs`, `/openapi.json`).

---

## API Documentation

The OpenAPI document is generated at runtime from route registrations in `src/openApi/` using `@asteasolutions/zod-to-openapi`.

| Resource                         | Description                                      |
| -------------------------------- | ------------------------------------------------ |
| `GET /openapi.json`              | OpenAPI 3.1 JSON document                        |
| `GET /docs`                      | Interactive Scalar API reference UI              |

Open `http://localhost:3000/docs` after starting the server to try requests in the browser.

---

## Testing

The project uses [Jest](https://jestjs.io/) with [`@swc/jest`](https://swc.rs/docs/usage/jest) for fast TypeScript compilation. Tests are unit-level and live alongside the source files they cover.

Tests import `src/config/env.ts`, so a complete `.env` (including `NODE_ENV` and `API_URL`) is required before running them locally.

### Running tests

```bash
npm test
```

This runs all test files matching `**/src/**/*.test.ts`. No separate build step is required.

### Test configuration

Jest is configured in `jest.config.js`:

| Setting           | Value                 | Purpose                                      |
| ----------------- | --------------------- | -------------------------------------------- |
| `testEnvironment` | `node`                | Runs tests in a Node.js environment          |
| `testMatch`       | `**/src/**/*.test.ts` | Discovers test files under `src/`            |
| `transform`       | `@swc/jest`           | Compiles TypeScript via SWC during test runs |

### Test suites

#### `src/validators/card-number.validator.test.ts`

Tests `validateCardNumberStructure` — the first stage of validation before the Luhn check.

| Test case                           | Expected outcome                                                 |
| ----------------------------------- | ---------------------------------------------------------------- |
| Clean digit-only string (16 digits) | Returns `{ success: true, digits: "..." }`                       |
| Spaces in input (`4111 1111 ...`)   | Strips spaces, validates successfully                            |
| Dashes in input (`4111-1111-...`)   | Strips dashes, validates successfully                            |
| `undefined` input                   | Throws: `card number can't be null, undefined or empty`          |
| `null` input                        | Throws: `card number can't be null, undefined or empty`          |
| Empty string                        | Throws: `card number can't be null, undefined or empty`          |
| Non-string type (e.g. a number)     | Throws: `Card number must be a string`                           |
| Letters mixed into digits           | Throws: `Card number must contain digits only`                   |
| Too short (`1234`)                  | Throws: length error using `MIN_CARD_LENGTH` / `MAX_CARD_LENGTH` |
| Too long (20 digits)                | Throws: length error using `MIN_CARD_LENGTH` / `MAX_CARD_LENGTH` |

Length-bound tests read `MIN_CARD_LENGTH` and `MAX_CARD_LENGTH` from your `.env` file.

#### `src/services/luhn.service.test.ts`

Tests `isValidLuhn` — the Luhn (modulus 10) checksum in isolation, without structural or length rules.

| Test case                                      | Expected outcome                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| Known valid number (`4111111111111111`)        | `true`                                                                 |
| Another valid number (`4539148803436467`)      | `true`                                                                 |
| Sequential invalid number (`1234567890123456`) | `false`                                                                |
| Single digit changed on valid number           | `false`                                                                |
| Short numeric string (`"0"`)                   | `true` (checksum math only; length policy is not applied here)         |

Current tests focus on the core validation logic.

---

## CI

GitHub Actions runs on every push and pull request targeting `main` (`.github/workflows/ci.yml`):

1. Checkout the repository
2. Set up Node.js 22 with npm cache
3. Install dependencies (`npm install`)
4. Run tests (`npm test`) with CI-provided env vars
5. TypeScript build (`npm run build`)

---

## Project Structure

```
.
├── .github/workflows/ci.yml            # GitHub Actions: install, test, build
├── src/
│   ├── app.ts                          # Express app, docs routes, API prefix
│   ├── server.ts                       # Entry point — starts the HTTP server
│   ├── config/
│   │   └── env.ts                      # Environment variable loading and validation
│   ├── controllers/
│   │   └── card-validation.controller.ts
│   ├── services/
│   │   ├── card-validation.service.ts  # Orchestrates structural + Luhn validation
│   │   ├── luhn.service.ts             # Luhn (modulus 10) checksum implementation
│   │   └── luhn.service.test.ts
│   ├── validators/
│   │   ├── card-number.validator.ts
│   │   └── card-number.validator.test.ts
│   ├── lib/
│   │   ├── appError.ts                 # Custom application error type
│   │   ├── helpers.ts                  # Formatting and digit-only helpers
│   │   └── zod.ts                      # Zod + OpenAPI extensions
│   ├── middleware/
│   │   ├── error.handler.ts
│   │   └── not-found.ts
│   ├── openApi/
│   │   ├── generate.ts                 # Builds the OpenAPI 3.1 document
│   │   ├── registry.ts                 # Shared OpenAPI registry
│   │   ├── health.route.doc.ts
│   │   └── card/card.validation.doc.ts
│   └── routers/
│       ├── index.ts
│       ├── health-check.ts
│       └── card-number.router.ts
└── jest.config.js
```

The codebase follows a layered architecture: **router → controller → service → validator/helper**, keeping HTTP concerns separate from business logic. OpenAPI docs are registered separately from route handlers.

---

## API Reference

Base URL: `http://localhost:<PORT>/api/v1`

All responses are JSON. Application error responses include a `success` boolean and a `message` string.

---

### Health Check

Check that the API is running.

| Method | Path              |
| ------ | ----------------- |
| `GET`  | `/api/v1/health`  |

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Health Route is working",
  "timestamp": "2026-10-18T12:00:00.000Z"
}
```

`timestamp` is generated with `new Date()` at request time.

---

### Validate Card Number

Validate a card number using structural checks and the Luhn algorithm.

| Method | Path                      |
| ------ | ------------------------- |
| `POST` | `/api/v1/validate-card`   |

#### Request

**Headers**

```
Content-Type: application/json
```

**Body**

| Field        | Type   | Required | Description                                  |
| ------------ | ------ | -------- | -------------------------------------------- |
| `cardNumber` | string | Yes      | Card number; spaces and hyphens are stripped |

**Example**

```json
{
  "cardNumber": "4111-1111-1111-1111"
}
```

#### Success Response — `200 OK`

Returned when the card number passes both structural validation and the Luhn checksum.

```json
{
  "success": true,
  "message": "card verification passed"
}
```

#### Verification Failed — `422 Unprocessable Entity`

Returned when the input is structurally valid but fails the Luhn checksum. The request body was well-formed; the card number did not verify.

```json
{
  "success": false,
  "message": "card verification failed"
}
```

#### Client Error Responses — `400 Bad Request`

Returned when the input fails structural validation before the Luhn check runs.

| Condition                          | Message                                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| Missing, null, or empty value      | `card number can't be null, undefined or empty`              |
| Not a string                       | `Card number must be a string`                               |
| Only whitespace/dashes after strip | `Card number must contain at least one digit`                |
| Contains non-digit characters      | `Card number must contain digits only`                       |
| Outside configured length bounds   | `Card number must be between <MIN> and <MAX> digits`         |

**Example**

```json
{
  "success": false,
  "message": "Card number must contain digits only"
}
```

#### Not Found — `404 Not Found`

Returned for any route that does not exist.

```json
{
  "success": false,
  "message": "Not Found"
}
```

#### Internal Server Error — `500 Internal Server Error`

Returned for unexpected, unhandled errors.

```json
{
  "sucess": false,
  "message": "Internal Server Errro"
}
```

---

## Validation Rules

Validation runs in two stages:

### 1. Structural validation

Applied first in `validateCardNumberStructure`:

1. `cardNumber` must be provided and must be a non-empty string
2. Spaces and hyphens are removed (`4111-1111-1111-1111` → `4111111111111111`)
3. The result must contain at least one digit
4. Only numeric digits (`0–9`) are allowed after stripping
5. Digit count must fall within `MIN_CARD_LENGTH` and `MAX_CARD_LENGTH` (inclusive)

### 2. Luhn checksum

If structural validation passes, the digit string is checked with the Luhn algorithm (modulus 10):

- Digits are processed right to left
- Every second digit is doubled; if doubling produces a value greater than 9, 9 is subtracted
- All resulting values are summed
- The card number is valid if the sum is divisible by 10

---

## Design Decisions

### Layered architecture

HTTP handling (controllers), business logic (services), and input rules (validators) are kept in separate modules. This makes each layer easy to test and change independently.

### Versioned API prefix

Application routes live under `/api/v1` so future breaking changes can be introduced without colliding with `/v1` clients. Documentation endpoints stay at the root (`/docs`, `/openapi.json`).

### OpenAPI generated from Zod

Route contracts are registered in `src/openApi/` with Zod schemas and compiled to OpenAPI 3.1 at startup. Scalar serves an interactive explorer from that spec.

### Structural vs. checksum validation

Structural problems (wrong type, bad characters, invalid length) return **HTTP 400** — these are client input errors. A structurally valid number that fails the Luhn check returns **HTTP 422**, treating checksum failure as a semantically invalid resource rather than a malformed request.

### Formatting tolerance

Card numbers may include spaces or hyphens for readability. These are stripped before validation so clients can send either `4111111111111111` or `4111-1111-1111-1111`.

### Configurable length bounds

Minimum and maximum card lengths are driven by environment variables rather than hard-coded constants. The defaults (`13`–`19`) cover common card issuers while remaining adjustable per deployment.

### Fail-fast environment loading

Required environment variables are validated when the app starts. Missing configuration causes an immediate startup failure instead of a runtime error on the first request.

### Consistent error type

Application errors use a custom `AppError` class with an HTTP status code and message. A single global error handler formats all known errors into the same JSON shape (`success` + `message`).

### TypeScript strict mode

The project uses TypeScript with `strict: true` for stronger type safety across controllers, services, and validators.

---

## Example Requests

### Valid card number (Luhn pass)

```bash
curl -X POST http://localhost:3000/api/v1/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111111"}'
```

```json
{
  "success": true,
  "message": "card verification passed"
}
```

### Formatted card number

```bash
curl -X POST http://localhost:3000/api/v1/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111-1111-1111-1111"}'
```

### Invalid Luhn checksum

```bash
curl -X POST http://localhost:3000/api/v1/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111112"}'
```

```json
{
  "success": false,
  "message": "card verification failed"
}
```

(HTTP status: `422`)

### Missing card number

```bash
curl -X POST http://localhost:3000/api/v1/validate-card \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{
  "success": false,
  "message": "card number can't be null, undefined or empty"
}
```

### Health check

```bash
curl http://localhost:3000/api/v1/health
```

### OpenAPI document

```bash
curl http://localhost:3000/openapi.json
```

---

## Author

Built with 💚💚 by Omoshola

---

## License

ISC

---

Note: This is deployed on Render's free tier, which spins down after 15 minutes of inactivity — the first request may take up to a minute to respond while the service wakes up.
