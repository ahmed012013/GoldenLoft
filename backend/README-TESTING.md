# Integration Testing Guide

This project includes a comprehensive suite of E2E (End-to-End) integration tests using **Jest**, **Supertest**, and a **Dockerized Postgres Database**.

## Prerequisites

1.  **Docker Desktop** must be installed and running.
2.  **Node.js** and **npm** must be installed.

## Test Structure

- **Test Database**: A dedicated Postgres container is used to ensure data isolation. It runs on port `5433` to avoid conflicts with development databases.
- **Test Files**: Located in `backend/test/`.
  - `auth.e2e-spec.ts`: Tests Registration, Login, and various error states.
  - `birds.e2e-spec.ts`: Tests CRUD operations, complex updates, deletions, and **access control**.
  - `lofts.e2e-spec.ts`: Tests Lofts management.
- **Cleanup**: Tests automatically clean up the database before each run using `prisma.deleteMany()`.

## How to Run Tests

### Option 1: Automated Script (Recommended)

We have provided a PowerShell script that handles everything for you (starting DB, running migrations, running tests):

```powershell
# From the backend directory
.\run-integration-tests.ps1
```

### Option 2: Manual Execution

1.  **Start the Test Database**:

    ```bash
    # From the project root
    docker-compose -f docker-compose.test.yml up -d
    ```

2.  **Run Migrations**:

    ```bash
    # From the backend directory
    # Set DATABASE_URL to the test DB
    $env:DATABASE_URL="postgresql://test_user:test_password@localhost:5433/goldenloft_test?schema=public"
    npx prisma migrate deploy
    ```

3.  **Run Tests**:
    ```bash
    npm run test:e2e
    ```

## Coverage Goal

These tests are designed to cover key business logic and edge cases, aiming for >50% integration coverage.
