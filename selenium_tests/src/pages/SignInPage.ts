import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Sign In Page Locators - Updated for Real FE
 * Structure: <div><Label/><Input/><p class="text-destructive"/></div>
 */
const Locators = {
  // Input fields
  emailInput: By.css('input#email'),
  passwordInput: By.css('input#password'),
  signInButton: By.css('button[type="submit"]'),
  forgotPasswordLink: By.css('a[href="/forgot-password"]'),
  signUpLink: By.css('a[href="/signup"]'),
  
  // Error messages - Error <p> is inside same parent div as input
  emailError: By.xpath('//input[@id="email"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  passwordError: By.xpath('//input[@id="password"]/ancestor::div[1]//p[contains(@class, "text-destructive")]'),
  
  // Generic error selector
  anyError: By.css('p.text-destructive'),
  
  // Toast notifications (sonner)
  toast: By.css('[data-sonner-toast]'),
  toastTitle: By.css('[data-sonner-toast] [data-title]'),
  toastDescription: By.css('[data-sonner-toast] [data-description]'),
  toastContent: By.css('[data-sonner-toast]'),
  successToast: By.css('[data-sonner-toast][data-type="success"]'),
  errorToast: By.css('[data-sonner-toast][data-type="error"]'),
  
  // Quick login buttons (Mock FE specific - may not exist in Real FE)
  quickLoginTeacher: By.xpath('//button[contains(text(), "Teacher")]'),
  quickLoginStudent: By.xpath('//button[contains(text(), "Student")]'),
};

/**
 * Sign In Page Object
 * Based on REQ006-REQ010
 */
export class SignInPage extends BasePage {
  /**
   * Navigate to sign in page
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.SIGN_IN);
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
   * Click sign in button
   */
  async clickSignIn(): Promise<void> {
    await this.click(Locators.signInButton);
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    console.log(`[SignInPage] Attempting login with: ${email}`);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
    console.log('[SignInPage] Sign in button clicked, waiting for response...');
    // Wait a bit for response
    await this.wait(1000);
  }

  /**
   * Login and wait for dashboard (with better error handling)
   */
  async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
    await this.login(email, password);
    
    // Check current URL after login attempt
    const currentUrl = await this.getCurrentUrl();
    console.log(`[SignInPage] Current URL after login: ${currentUrl}`);
    
    // Try to wait for dashboard, but log if failed
    try {
      await this.waitForUrlContains('/dashboard', 10000);
      console.log('[SignInPage] Successfully redirected to dashboard');
    } catch (error) {
      console.log('[SignInPage] Did not redirect to dashboard, checking for error toast...');
      const hasToast = await this.isToastDisplayed();
      if (hasToast) {
        const msg = await this.getToastMessage();
        console.log(`[SignInPage] Toast message: ${msg}`);
      }
      throw error;
    }
  }

  /**
   * Check if sign in button is enabled
   */
  async isSignInButtonEnabled(): Promise<boolean> {
    return this.isEnabled(Locators.signInButton);
  }

  /**
   * Check if sign in button is disabled
   */
  async isSignInButtonDisabled(): Promise<boolean> {
    return this.isDisabled(Locators.signInButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(Locators.forgotPasswordLink);
  }

  /**
   * Click sign up link
   */
  async clickSignUpLink(): Promise<void> {
    await this.click(Locators.signUpLink);
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
   * Check if toast is displayed
   */
  async isToastDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.toast, 5000);
  }

  /**
   * Get toast message
   */
  async getToastMessage(): Promise<string> {
    try {
      const toast = await this.waitForVisible(Locators.toast, 3000);
      return toast.getText();
    } catch {
      return '';
    }
  }

  /**
   * Wait for success toast
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
   * Quick login as teacher (Mock FE specific)
   */
  async quickLoginTeacher(): Promise<void> {
    await this.click(Locators.quickLoginTeacher);
  }

  /**
   * Quick login as student (Mock FE specific)
   */
  async quickLoginStudent(): Promise<void> {
    await this.click(Locators.quickLoginStudent);
  }

  /**
   * Click outside (trigger blur validation)
   */
  async clickOutside(): Promise<void> {
    await this.pressTab();
  }
}
