import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Sign Up Page Locators - Updated for Real FE
 * FE uses react-hook-form with Zod validation
 * Structure: <div><Label/><Input/><p class="text-destructive"/></div>
 */
const Locators = {
  // Input fields
  lastnameInput: By.css('input#lastname'),
  firstnameInput: By.css('input#firstname'),
  emailInput: By.css('input#email'),
  passwordInput: By.css('input#password'),
  signUpButton: By.css('button[type="submit"]'),
  signInLink: By.css('a[href="/signin"]'),
  
  // Error messages - Error <p> is inside same parent div as input
  // Selector: find p.text-destructive that is inside same container as the input
  lastnameError: By.xpath('//input[@id="lastname"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  firstnameError: By.xpath('//input[@id="firstname"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  emailError: By.xpath('//input[@id="email"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  passwordError: By.xpath('//input[@id="password"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  
  // Generic error message selector
  anyError: By.css('p.text-destructive'),
  
  // Toast notifications (sonner)
  toast: By.css('[data-sonner-toast]'),
  toastTitle: By.css('[data-sonner-toast] [data-title]'),
  toastDescription: By.css('[data-sonner-toast] [data-description]'),
  toastContent: By.css('[data-sonner-toast]'),
  successToast: By.css('[data-sonner-toast][data-type="success"]'),
  errorToast: By.css('[data-sonner-toast][data-type="error"]'),
};

/**
 * Sign Up Page Object
 * Based on REQ001-REQ005
 * Updated for Mock FE structure (lastname + firstname fields, no confirmPassword)
 */
export class SignUpPage extends BasePage {
  /**
   * Navigate to sign up page
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.SIGN_UP);
  }

  /**
   * Enter lastname
   */
  async enterLastname(lastname: string): Promise<void> {
    await this.type(Locators.lastnameInput, lastname);
  }

  /**
   * Enter firstname
   */
  async enterFirstname(firstname: string): Promise<void> {
    await this.type(Locators.firstnameInput, firstname);
  }

  /**
   * Enter email
   */
  async enterEmail(email: string): Promise<void> {
    await this.type(Locators.emailInput, email);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.type(Locators.passwordInput, password);
  }

  /**
   * Click sign up button
   */
  async clickSignUp(): Promise<void> {
    await this.click(Locators.signUpButton);
  }

  /**
   * Register user (Mock FE version - no confirmPassword field)
   */
  async register(email: string, password: string, lastname = 'Test', firstname = 'User'): Promise<void> {
    await this.enterLastname(lastname);
    await this.enterFirstname(firstname);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignUp();
  }

  /**
   * Check if sign up button is enabled
   */
  async isSignUpButtonEnabled(): Promise<boolean> {
    return this.isEnabled(Locators.signUpButton);
  }

  /**
   * Check if sign up button is disabled
   */
  async isSignUpButtonDisabled(): Promise<boolean> {
    return this.isDisabled(Locators.signUpButton);
  }

  /**
   * Check if lastname error is displayed
   */
  async isLastnameErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.lastnameError);
  }

  /**
   * Check if firstname error is displayed
   */
  async isFirstnameErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.firstnameError);
  }

  /**
   * Check if email error is displayed
   */
  async isEmailErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.emailError);
  }

  /**
   * Get email error message
   */
  async getEmailErrorMessage(): Promise<string> {
    try {
      return this.getText(Locators.emailError);
    } catch {
      return '';
    }
  }

  /**
   * Get lastname error message
   */
  async getLastnameErrorMessage(): Promise<string> {
    try {
      return this.getText(Locators.lastnameError);
    } catch {
      return '';
    }
  }

  /**
   * Get firstname error message
   */
  async getFirstnameErrorMessage(): Promise<string> {
    try {
      return this.getText(Locators.firstnameError);
    } catch {
      return '';
    }
  }

  /**
   * Check if password error is displayed
   */
  async isPasswordErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.passwordError);
  }

  /**
   * Get password error message
   */
  async getPasswordErrorMessage(): Promise<string> {
    try {
      return this.getText(Locators.passwordError);
    } catch {
      return '';
    }
  }

  /**
   * Check if toast is displayed (sonner)
   */
  async isToastDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.toast, 5000);
  }

  /**
   * Get toast message - try multiple selectors
   */
  async getToastMessage(): Promise<string> {
    try {
      // First try to get toast text content
      const toast = await this.waitForVisible(Locators.toast, 3000);
      return toast.getText();
    } catch {
      return '';
    }
  }

  /**
   * Wait for success toast (sonner)
   */
  async waitForSuccessToast(timeout = 10000): Promise<boolean> {
    try {
      await this.waitForVisible(Locators.toast, timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for error toast
   */
  async waitForErrorToast(timeout = 10000): Promise<boolean> {
    try {
      await this.waitForVisible(Locators.toast, timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click sign in link
   */
  async clickSignInLink(): Promise<void> {
    await this.click(Locators.signInLink);
  }

  /**
   * Click outside (to trigger blur validation)
   */
  async clickOutside(): Promise<void> {
    await this.pressTab();
  }
}
