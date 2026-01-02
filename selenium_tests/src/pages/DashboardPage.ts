import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Dashboard Page Locators
 */
const Locators = {
  // Navigation
  navSpeaking: By.css('a[href*="speaking"], nav a:contains("Speaking")'),
  navWriting: By.css('a[href*="writing"], nav a:contains("Writing")'),
  navHistory: By.css('a[href*="history"], nav a:contains("History")'),
  navStatistics: By.css('a[href*="statistics"], a[href*="stats"]'),
  navProfile: By.css('a[href*="profile"]'),
  
  // User menu - Mock FE uses sidebar logout
  userMenu: By.css('.user-menu, .avatar, [aria-label="User menu"]'),
  profileDropdown: By.css('.profile-dropdown, .user-dropdown'),
  // Mock FE: Logout button trong sidebar có text "Sign Out"
  logoutButton: By.xpath('//button[contains(text(), "Sign Out")]'),
  
  // Welcome
  welcomeMessage: By.css('.welcome-message, h1'),
  
  // Quick actions
  startSpeakingBtn: By.css('button.start-speaking, a.start-speaking'),
  startWritingBtn: By.css('button.start-writing, a.start-writing'),
  
  // Stats cards
  totalAttempts: By.css('.total-attempts, [data-stat="attempts"]'),
  averageScore: By.css('.average-score, [data-stat="average"]'),
};

/**
 * Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.DASHBOARD);
  }

  /**
   * Navigate to speaking
   */
  async navigateToSpeaking(): Promise<void> {
    await this.click(Locators.navSpeaking);
  }

  /**
   * Navigate to writing
   */
  async navigateToWriting(): Promise<void> {
    await this.click(Locators.navWriting);
  }

  /**
   * Navigate to history
   */
  async navigateToHistory(): Promise<void> {
    await this.click(Locators.navHistory);
  }

  /**
   * Navigate to statistics
   */
  async navigateToStatistics(): Promise<void> {
    await this.click(Locators.navStatistics);
  }

  /**
   * Navigate to profile
   */
  async navigateToProfile(): Promise<void> {
    await this.click(Locators.navProfile);
  }

  /**
   * Open profile dropdown
   */
  async openProfileDropdown(): Promise<void> {
    await this.click(Locators.userMenu);
  }

  /**
   * Logout - Mock FE has logout button directly in sidebar
   */
  async logout(): Promise<void> {
    // Mock FE: Click logout button trực tiếp (không cần dropdown)
    await this.click(Locators.logoutButton);
    await this.wait(1000); // Wait for navigation
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getText(Locators.welcomeMessage);
  }

  /**
   * Click start speaking
   */
  async clickStartSpeaking(): Promise<void> {
    await this.click(Locators.startSpeakingBtn);
  }

  /**
   * Click start writing
   */
  async clickStartWriting(): Promise<void> {
    await this.click(Locators.startWritingBtn);
  }
}
