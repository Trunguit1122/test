import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Practice List Page Locators
 */
const Locators = {
  // Part selection
  partTabs: By.css('.part-tabs, [role="tablist"]'),
  partTab: (part: number) => By.css(`[data-part="${part}"], button:contains("Part ${part}")`),
  
  // Topic list
  topicList: By.css('.topic-list, [data-list="topics"]'),
  topicCard: By.css('.topic-card, [data-card="topic"]'),
  topicTitle: By.css('.topic-title'),
  startButton: By.css('button.start, [data-action="start"]'),
  
  // Filters
  filterDropdown: By.css('.filter-dropdown, select.filter'),
  searchInput: By.css('input[type="search"], input.search'),
  
  // Pagination
  pagination: By.css('.pagination'),
  nextPage: By.css('.next-page, [data-action="next"]'),
  prevPage: By.css('.prev-page, [data-action="prev"]'),
  
  // Loading
  loadingSpinner: By.css('.loading, .spinner'),
};

/**
 * Practice List Page Object
 * Shared between Speaking and Writing
 */
export class PracticeListPage extends BasePage {
  /**
   * Navigate to speaking list
   */
  async gotoSpeaking(): Promise<void> {
    await this.navigateTo(Routes.SPEAKING);
  }

  /**
   * Navigate to writing list
   */
  async gotoWriting(): Promise<void> {
    await this.navigateTo(Routes.WRITING);
  }

  /**
   * Select part
   */
  async selectPart(part: number): Promise<void> {
    await this.click(Locators.partTab(part));
    await this.wait(500);
  }

  /**
   * Get topic cards
   */
  async getTopicCards(): Promise<any[]> {
    return this.findElements(Locators.topicCard);
  }

  /**
   * Get topic count
   */
  async getTopicCount(): Promise<number> {
    const cards = await this.getTopicCards();
    return cards.length;
  }

  /**
   * Search for topic
   */
  async searchTopic(keyword: string): Promise<void> {
    await this.type(Locators.searchInput, keyword);
    await this.wait(500);
  }

  /**
   * Select first topic
   */
  async selectFirstTopic(): Promise<void> {
    const cards = await this.getTopicCards();
    if (cards.length > 0) {
      await cards[0].click();
    }
  }

  /**
   * Click start on first topic
   */
  async startFirstTopic(): Promise<void> {
    const startButtons = await this.findElements(Locators.startButton);
    if (startButtons.length > 0) {
      await startButtons[0].click();
    }
  }

  /**
   * Select topic by index
   */
  async selectTopicByIndex(index: number): Promise<void> {
    const cards = await this.getTopicCards();
    if (index < cards.length) {
      await cards[index].click();
    }
  }

  /**
   * Check if loading
   */
  async isLoading(): Promise<boolean> {
    return this.isDisplayed(Locators.loadingSpinner);
  }

  /**
   * Wait for topics to load
   */
  async waitForTopicsToLoad(): Promise<void> {
    await this.waitForVisible(Locators.topicList);
    await this.wait(500);
  }

  /**
   * Check if has pagination
   */
  async hasPagination(): Promise<boolean> {
    return this.isDisplayed(Locators.pagination);
  }

  /**
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    await this.click(Locators.nextPage);
  }

  /**
   * Go to previous page
   */
  async goToPrevPage(): Promise<void> {
    await this.click(Locators.prevPage);
  }
}
