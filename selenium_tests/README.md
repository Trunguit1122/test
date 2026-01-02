# LingoLab Selenium Test Framework (Node.js/TypeScript)

Automated end-to-end testing framework for the LingoLab IELTS practice application using Selenium WebDriver with TypeScript.

## 📁 Project Structure

```
selenium_tests/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest configuration
├── .env.example              # Environment variables template
├── src/
│   ├── config/               # Configuration files
│   │   ├── settings.ts       # App settings & credentials
│   │   ├── messages.ts       # MSG codes from SRS
│   │   ├── routes.ts         # Application routes
│   │   └── index.ts          # Config exports
│   ├── utils/                # Utility functions
│   │   ├── driver.ts         # WebDriver factory
│   │   ├── testData.ts       # Test data generators
│   │   ├── setup.ts          # Jest setup
│   │   └── index.ts          # Utils exports
│   ├── pages/                # Page Object Models
│   │   ├── BasePage.ts       # Base page with common methods
│   │   ├── SignUpPage.ts     # Sign up page
│   │   ├── SignInPage.ts     # Sign in page
│   │   ├── DashboardPage.ts  # Dashboard page
│   │   ├── ProfilePage.ts    # Profile management
│   │   ├── PracticeListPage.ts   # Topic selection
│   │   ├── SpeakingPracticePage.ts  # Speaking practice
│   │   ├── WritingPracticePage.ts   # Writing practice
│   │   ├── ResultPage.ts     # Result display
│   │   ├── PracticeHistoryPage.ts   # Practice history
│   │   ├── TeacherDashboardPage.ts  # Teacher dashboard
│   │   ├── StatisticsPage.ts # Statistics page
│   │   └── index.ts          # Page exports
│   └── tests/                # Test files
│       ├── signup.test.ts    # FUC-001 to FUC-050
│       ├── signin.test.ts    # FUC-051 to FUC-100
│       ├── profile.test.ts   # FUC-101 to FUC-150
│       ├── speaking.test.ts  # FUC-151 to FUC-250
│       ├── writing.test.ts   # FUC-251 to FUC-350
│       ├── teacher.test.ts   # FUC-351 to FUC-450
│       ├── history.test.ts   # FUC-451 to FUC-550
│       ├── statistics.test.ts    # FUC-551 to FUC-650
│       └── result.test.ts    # FUC-651 to FUC-700
└── reports/                  # Test reports output
```

## 🚀 Installation

### Prerequisites

- Node.js 18+
- Chrome or Firefox browser
- ChromeDriver or GeckoDriver

### Setup

```bash
# Navigate to test directory
cd test/selenium_tests

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Install WebDriver

```bash
# For Chrome (using npm)
npm install -g chromedriver

# Or download manually from:
# https://chromedriver.chromium.org/downloads

# For Firefox
npm install -g geckodriver
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Application URLs
BASE_URL=http://localhost:5173
API_URL=http://localhost:3000/api

# Browser settings
BROWSER=chrome
HEADLESS=false

# Timeouts (milliseconds)
IMPLICIT_WAIT=10000
PAGE_LOAD_TIMEOUT=30000
SCRIPT_TIMEOUT=30000

# Test credentials
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=Test@1234
TEST_TEACHER_EMAIL=teacher@example.com
TEST_TEACHER_PASSWORD=Teacher@1234
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Sign up tests
npm run test:signup

# Sign in tests
npm run test:signin

# Speaking practice tests
npm run test:speaking

# Writing practice tests
npm run test:writing

# Teacher dashboard tests
npm run test:teacher

# History tests
npm run test:history

# Statistics tests
npm run test:statistics
```

### Run Smoke Tests (Quick)

```bash
npm run test:smoke
```

### Run with Verbose Output

```bash
npm run test:verbose
```

### Run in Headless Mode

```bash
HEADLESS=true npm test
```

## 📊 Test Reports

Reports are generated in `reports/` directory:

- `test-report.html` - HTML report
- `junit.xml` - JUnit XML report

### View HTML Report

```bash
# After running tests
open reports/test-report.html
```

## 🔧 Test Coverage

| Test Suite | Test Cases | Requirements |
|------------|------------|--------------|
| Sign Up | FUC-001 to FUC-050 | REQ001-REQ005 |
| Sign In | FUC-051 to FUC-100 | REQ006-REQ010 |
| Profile | FUC-101 to FUC-150 | REQ011-REQ014 |
| Speaking | FUC-151 to FUC-250 | REQ020-REQ045 |
| Writing | FUC-251 to FUC-350 | REQ046-REQ070 |
| Teacher | FUC-351 to FUC-450 | REQ071-REQ077 |
| History | FUC-451 to FUC-550 | History features |
| Statistics | FUC-551 to FUC-650 | Statistics features |
| Result | FUC-651 to FUC-700 | Result display |

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { SignInPage, DashboardPage } from '../pages';
import { Settings, Routes } from '../config';
import { getDriver, quitDriver } from '../utils/setup';

describe('Feature Tests', () => {
  let signInPage: SignInPage;

  beforeAll(async () => {
    signInPage = new SignInPage(getDriver());
    await signInPage.goto();
    await signInPage.login(Settings.testUser.email, Settings.testUser.password);
  });

  afterAll(async () => {
    await quitDriver();
  });

  test('Should do something', async () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
```

### Page Object Pattern

```typescript
import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

const Locators = {
  submitButton: By.css('button[type="submit"]'),
  inputField: By.css('input[name="field"]'),
};

export class MyPage extends BasePage {
  async clickSubmit(): Promise<void> {
    await this.click(Locators.submitButton);
  }

  async enterValue(value: string): Promise<void> {
    await this.type(Locators.inputField, value);
  }
}
```

## 🔍 Debugging

### Run Single Test

```bash
npx jest --testNamePattern="FUC-001"
```

### Run with Debug Logging

```bash
DEBUG=selenium-webdriver:* npm test
```

### Take Screenshots on Failure

Screenshots are automatically taken on test failure and saved to `reports/screenshots/`.

## 📌 Best Practices

1. **Use Page Objects** - All page interactions should go through page objects
2. **Explicit Waits** - Use `waitForVisible`, `waitForClickable` instead of hard sleeps
3. **Independent Tests** - Each test should be able to run independently
4. **Clean Up** - Always clean up test data after tests
5. **Meaningful Names** - Use descriptive test names with FUC IDs

## 🤝 Contributing

1. Create page objects for new pages
2. Write tests following the FUC naming convention
3. Ensure tests pass locally before committing
4. Update this README with new test coverage

## 📄 License

MIT License
