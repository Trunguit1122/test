import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Practice History Page Locators
 */
const Locators = {
  // Filters
  skillFilter: By.css('.skill-filter, select[name="skill"]'),
  dateRangeFilter: By.css('.date-range-filter, [data-filter="date"]'),
  startDateInput: By.css('input[name="startDate"]'),
  endDateInput: By.css('input[name="endDate"]'),
  applyFilterBtn: By.css('button.apply-filter, [data-action="apply-filter"]'),
  clearFilterBtn: By.css('button.clear-filter, [data-action="clear-filter"]'),
  
  // History list
  historyTable: By.css('.history-table, table'),
  historyRow: By.css('.history-row, tbody tr'),
  noDataMessage: By.css('.no-data, .empty-state'),
  
  // Table columns
  dateColumn: By.css('td.date, [data-column="date"]'),
  skillColumn: By.css('td.skill, [data-column="skill"]'),
  topicColumn: By.css('td.topic, [data-column="topic"]'),
  scoreColumn: By.css('td.score, [data-column="score"]'),
  actionColumn: By.css('td.action, [data-column="action"]'),
  
  // Actions
  viewDetailBtn: By.css('button.view-detail, [data-action="view"]'),
  compareBtn: By.css('button.compare, [data-action="compare"]'),
  deleteBtn: By.css('button.delete, [data-action="delete"]'),
  
  // Comparison
  compareCheckbox: By.css('input.compare-checkbox, [data-compare]'),
  startCompareBtn: By.css('button.start-compare, [data-action="start-compare"]'),
  comparisonPanel: By.css('.comparison-panel, [data-section="comparison"]'),
  
  // Pagination
  pagination: By.css('.pagination'),
  pageInfo: By.css('.page-info'),
  prevPage: By.css('button.prev-page, [data-action="prev"]'),
  nextPage: By.css('button.next-page, [data-action="next"]'),
  
  // Loading
  loadingSpinner: By.css('.loading, .spinner'),
  
  // Confirm modal
  confirmModal: By.css('.confirm-modal, [role="dialog"]'),
  confirmDeleteBtn: By.css('button.confirm-delete, [data-action="confirm"]'),
  cancelDeleteBtn: By.css('button.cancel-delete, [data-action="cancel"]'),
};

/**
 * Practice History Page Object
 */
export class PracticeHistoryPage extends BasePage {
  /**
   * Navigate to history page
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.HISTORY);
  }

  /**
   * Filter by skill
   */
  async filterBySkill(skill: 'speaking' | 'writing' | 'all'): Promise<void> {
    await this.selectByValue(Locators.skillFilter, skill);
    await this.wait(500);
  }

  /**
   * Set date range filter
   */
  async setDateRange(startDate: string, endDate: string): Promise<void> {
    await this.type(Locators.startDateInput, startDate);
    await this.type(Locators.endDateInput, endDate);
  }

  /**
   * Apply filters
   */
  async applyFilters(): Promise<void> {
    await this.click(Locators.applyFilterBtn);
    await this.wait(500);
  }

  /**
   * Clear filters
   */
  async clearFilters(): Promise<void> {
    await this.click(Locators.clearFilterBtn);
    await this.wait(500);
  }

  /**
   * Get history rows
   */
  async getHistoryRows(): Promise<any[]> {
    return this.findElements(Locators.historyRow);
  }

  /**
   * Get history count
   */
  async getHistoryCount(): Promise<number> {
    const rows = await this.getHistoryRows();
    return rows.length;
  }

  /**
   * Check if no data message is shown
   */
  async isNoDataDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.noDataMessage);
  }

  /**
   * View detail of first item
   */
  async viewFirstItem(): Promise<void> {
    const viewButtons = await this.findElements(Locators.viewDetailBtn);
    if (viewButtons.length > 0) {
      await viewButtons[0].click();
    }
  }

  /**
   * View detail by index
   */
  async viewItemByIndex(index: number): Promise<void> {
    const viewButtons = await this.findElements(Locators.viewDetailBtn);
    if (index < viewButtons.length) {
      await viewButtons[index].click();
    }
  }

  /**
   * Select items for comparison
   */
  async selectForCompare(indices: number[]): Promise<void> {
    const checkboxes = await this.findElements(Locators.compareCheckbox);
    for (const index of indices) {
      if (index < checkboxes.length) {
        await checkboxes[index].click();
      }
    }
  }

  /**
   * Start comparison
   */
  async startCompare(): Promise<void> {
    await this.click(Locators.startCompareBtn);
  }

  /**
   * Check if comparison panel is visible
   */
  async isComparisonPanelVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.comparisonPanel);
  }

  /**
   * Delete first item
   */
  async deleteFirstItem(): Promise<void> {
    const deleteButtons = await this.findElements(Locators.deleteBtn);
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
    }
  }

  /**
   * Confirm delete
   */
  async confirmDelete(): Promise<void> {
    await this.click(Locators.confirmDeleteBtn);
  }

  /**
   * Cancel delete
   */
  async cancelDelete(): Promise<void> {
    await this.click(Locators.cancelDeleteBtn);
  }

  /**
   * Check if confirm modal is shown
   */
  async isConfirmModalShown(): Promise<boolean> {
    return this.isDisplayed(Locators.confirmModal);
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

  /**
   * Check if has next page
   */
  async hasNextPage(): Promise<boolean> {
    return this.isEnabled(Locators.nextPage);
  }

  /**
   * Check if has prev page
   */
  async hasPrevPage(): Promise<boolean> {
    return this.isEnabled(Locators.prevPage);
  }

  /**
   * Wait for history to load
   */
  async waitForHistoryToLoad(): Promise<void> {
    await this.waitForInvisible(Locators.loadingSpinner);
  }

  /**
   * Check if loading
   */
  async isLoading(): Promise<boolean> {
    return this.isDisplayed(Locators.loadingSpinner);
  }
}
