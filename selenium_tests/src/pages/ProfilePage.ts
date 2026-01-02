import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Profile Page Locators - Updated for Mock FE
 */
const Locators = {
  // Display name - Mock FE has First Name and Last Name inputs (no name attribute)
  // Use label to find inputs
  firstNameInput: By.xpath('//label[contains(text(), "First Name")]/following-sibling::input'),
  lastNameInput: By.xpath('//label[contains(text(), "Last Name")]/following-sibling::input'),
  displayNameError: By.css('.display-name-error, [data-error="displayName"]'),
  
  // Avatar
  avatarInput: By.css('input[type="file"], input[name="avatar"]'),
  avatarPreview: By.css('.avatar-preview, img.avatar'),
  uploadButton: By.css('button.upload, [data-action="upload"]'),
  
  // Bio/Learning goals
  bioTextarea: By.xpath('//label[contains(text(), "Bio")]/following-sibling::textarea'),
  
  // Password change - Mock FE has separate password section
  currentPasswordInput: By.xpath('//label[contains(text(), "Current Password")]/following-sibling::input'),
  newPasswordInput: By.xpath('//label[contains(text(), "New Password") and not(contains(text(), "Confirm"))]/following-sibling::input'),
  confirmNewPasswordInput: By.xpath('//label[contains(text(), "Confirm New Password")]/following-sibling::input'),
  changePasswordButton: By.xpath('//button[contains(text(), "Change Password")]'),
  passwordSection: By.css('.password-section, [data-section="password"]'),
  expandPasswordBtn: By.css('button.expand-password, [data-toggle="password"]'),
  
  // Errors
  currentPasswordError: By.css('.current-password-error, [data-error="currentPassword"]'),
  newPasswordError: By.css('.new-password-error, [data-error="newPassword"]'),
  confirmPasswordError: By.css('.confirm-password-error, [data-error="confirmNewPassword"]'),
  
  // Buttons - Mock FE has "Save Changes" and "Cancel"
  saveButton: By.xpath('//button[contains(text(), "Save Changes")]'),
  cancelButton: By.xpath('//button[contains(text(), "Cancel")]'),
  
  // Messages - Mock FE uses toast (sonner)
  successMessage: By.css('[data-sonner-toast]'),
  errorMessage: By.css('[data-sonner-toast]'),
};

/**
 * Profile Page Object
 * Based on REQ011-REQ014
 */
export class ProfilePage extends BasePage {
  /**
   * Navigate to profile page
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.PROFILE);
  }

  /**
   * Get display name - Mock FE uses First Name + Last Name
   */
  async getDisplayName(): Promise<string> {
    const firstName = await this.getValue(Locators.firstNameInput);
    const lastName = await this.getValue(Locators.lastNameInput);
    return `${firstName} ${lastName}`.trim();
  }

  /**
   * Update display name - Mock FE uses First Name + Last Name
   */
  async updateDisplayName(name: string): Promise<void> {
    const parts = name.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    
    await this.clear(Locators.firstNameInput);
    await this.type(Locators.firstNameInput, firstName);
    
    await this.clear(Locators.lastNameInput);
    await this.type(Locators.lastNameInput, lastName);
    
    await this.clickSave();
  }

  /**
   * Clear display name - Mock FE uses First Name + Last Name
   */
  async clearDisplayName(): Promise<void> {
    await this.clear(Locators.firstNameInput);
    await this.clear(Locators.lastNameInput);
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(filePath: string): Promise<void> {
    await this.uploadFile(Locators.avatarInput, filePath);
  }

  /**
   * Check if avatar is uploaded
   */
  async isAvatarUploaded(): Promise<boolean> {
    try {
      const src = await this.getAttribute(Locators.avatarPreview, 'src');
      return src !== null && src.length > 0 && !src.includes('default');
    } catch {
      return false;
    }
  }

  /**
   * Expand password section
   */
  async expandPasswordSection(): Promise<void> {
    try {
      await this.click(Locators.expandPasswordBtn);
    } catch {
      // Section may already be expanded
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    await this.expandPasswordSection();
    await this.type(Locators.currentPasswordInput, currentPassword);
    await this.type(Locators.newPasswordInput, newPassword);
    await this.type(Locators.confirmNewPasswordInput, confirmPassword);
    await this.click(Locators.changePasswordButton);
  }

  /**
   * Click save button
   */
  async clickSave(): Promise<void> {
    await this.click(Locators.saveButton);
  }

  /**
   * Check if current password input is visible
   */
  async isCurrentPasswordVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.currentPasswordInput);
  }

  /**
   * Check if new password input is visible
   */
  async isNewPasswordVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.newPasswordInput);
  }

  /**
   * Check if confirm new password input is visible
   */
  async isConfirmNewPasswordVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.confirmNewPasswordInput);
  }

  /**
   * Check if display name error is displayed
   */
  async isDisplayNameErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.displayNameError);
  }

  /**
   * Check if new password error is displayed
   */
  async isNewPasswordErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.newPasswordError);
  }

  /**
   * Check if confirm password error is displayed
   */
  async isConfirmPasswordErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.confirmPasswordError);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.successMessage);
  }

  /**
   * Wait for success message
   */
  async waitForSuccessMessage(): Promise<void> {
    await this.waitForVisible(Locators.successMessage);
  }

  /**
   * Check if error is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.errorMessage);
  }

  /**
   * Check if change password button is disabled
   */
  async isChangePasswordButtonDisabled(): Promise<boolean> {
    return this.isDisabled(Locators.changePasswordButton);
  }
}
