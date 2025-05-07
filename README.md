# Slots Game

A simple slots game built with PixiJS and TypeScript featuring horizontal spinning reels, sound effects, and animations.

## Prerequisites

Before running this project, you need to have Node.js and Yarn installed on your system.

## Installation

Clone the repository and install dependencies:

```bash
yarn
```

## Running the Application

Start the development server:

```bash
yarn start
```

The application will be available at http://localhost:9000 in your browser.

## Running Tests

### Unit Tests

Run the unit tests:

```bash
yarn test:unit
```

### End-to-End Tests
E2E Tests are based on TestCafe

Make sure the application is running before executing E2E tests:

```bash
# Start the application (if not already running)
yarn start

# In a separate terminal, run E2E tests
yarn test:e2e

# For debugging E2E tests with browser UI
yarn test:debug:e2e
```

## Project Test Structure
- `tests/` - Test files
  - `unit/` - Unit tests
  - `e2e/` - End-to-end tests
  