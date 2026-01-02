import { By, WebElement } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Progress Page Locators for Real FE (LingoLab-FE)
 * This is the actual progress/history page at /student/progress
 */
const Locators = {
  // Page elements
  pageHeading: By.xpath('//h1[contains(text(), "Your Progress Analytics") or contains(text(), "Progress")]'),
  loadingSpinner: By.css('.animate-spin, [class*="Loader"]'),
  
  // Filter Section
  filterSection: By.xpath('//div[contains(@class, "bg-white") and .//label[contains(text(), "Task Type")]]'),
  taskTypeSelect: By.xpath('//label[contains(text(), "Task Type")]/following-sibling::div//select'),
  dateRangeSelect: By.xpath('//label[contains(text(), "Date Range")]/following-sibling::div//select'),
  comparisonModeSelect: By.xpath('//label[contains(text(), "Comparison Mode")]/following-sibling::div//select'),
  updateButton: By.xpath('//button[contains(text(), "Update") or .//svg]'),
  
  // KPI Cards
  kpiSection: By.xpath('//div[contains(@class, "grid") and contains(@class, "md:grid-cols-3")]'),
  currentBandCard: By.xpath('//p[contains(text(), "Current Band Score")]/ancestor::div[contains(@class, "bg-white")]'),
  currentBandValue: By.xpath('//p[contains(text(), "Current Band Score")]/following-sibling::h3'),
  tasksCompletedCard: By.xpath('//p[contains(text(), "Tasks Completed")]/ancestor::div[contains(@class, "bg-white")]'),
  tasksCompletedValue: By.xpath('//p[contains(text(), "Tasks Completed")]/following-sibling::h3'),
  targetScoreCard: By.xpath('//p[contains(text(), "Target Score")]/ancestor::div[contains(@class, "bg-white")]'),
  targetScoreValue: By.xpath('//p[contains(text(), "Target Score")]/following-sibling::h3'),
  bandChangeIndicator: By.xpath('//div[contains(@class, "bg-green-100") or contains(@class, "bg-red-100")]'),
  
  // Score History Chart
  scoreHistorySection: By.xpath('//h3[contains(text(), "Score History Trend")]/ancestor::div[contains(@class, "bg-white")]'),
  chartContainer: By.xpath('//div[contains(@class, "bg-slate-50") and contains(@class, "rounded-lg")]'),
  chartBars: By.xpath('//div[contains(@class, "bg-slate-50")]//div[contains(@class, "bg-purple")]'),
  viewDetailsLink: By.xpath('//button[contains(text(), "View Details")]'),
  
  // AI Insights Section
  aiInsightsSection: By.xpath('//h3[contains(text(), "AI Error Insights")]/ancestor::div[contains(@class, "bg-white")]'),
  insightItems: By.xpath('//div[contains(@class, "bg-white")]//div[contains(@class, "group")]'),
  grammarInsight: By.xpath('//span[contains(text(), "Grammar")]'),
  vocabularyInsight: By.xpath('//span[contains(text(), "Vocabulary")]'),
  coherenceInsight: By.xpath('//span[contains(text(), "Coherence")]'),
  viewFullReportBtn: By.xpath('//button[contains(text(), "View Full AI Report")]'),
  
  // Performance Summary
  performanceSection: By.xpath('//h3[contains(text(), "Performance Summary")]/ancestor::div[contains(@class, "bg-white")]'),
  strengthsList: By.xpath('//h4[contains(text(), "Top Strengths")]/following-sibling::ul'),
  strengthItems: By.xpath('//h4[contains(text(), "Top Strengths")]/following-sibling::ul//li'),
  focusAreasList: By.xpath('//h4[contains(text(), "Focus Areas")]/following-sibling::ul'),
  focusAreaItems: By.xpath('//h4[contains(text(), "Focus Areas")]/following-sibling::ul//li'),
  
  // Recent Submissions Table
  recentSubmissionsSection: By.xpath('//h3[contains(text(), "Recent Submissions")]/ancestor::div[contains(@class, "bg-white")]'),
  viewAllLink: By.xpath('//button[contains(text(), "View All")]'),
  submissionsTable: By.xpath('//table'),
  tableHeaders: By.xpath('//thead//th'),
  tableRows: By.xpath('//tbody//tr'),
  noSubmissionsMessage: By.xpath('//td[contains(text(), "No submissions yet")]'),
  
  // Table row elements
  taskCell: By.xpath('.//td[1]'),
  dateCell: By.xpath('.//td[2]'),
  scoreCell: By.xpath('.//td[3]'),
  viewButton: By.xpath('.//td[4]//button'),
};

/**
 * Progress Page Object for Real FE (LingoLab-FE)
 * Path: /student/progress
 */
export class ProgressPage extends BasePage {
  /**
   * Navigate to progress page
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.PROGRESS);
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    try {
      // Wait for loading spinner to disappear
      await this.waitForInvisible(Locators.loadingSpinner, 10000);
    } catch {
      // Spinner may not exist or already gone
    }
    // Wait for page heading
    await this.waitForVisible(Locators.pageHeading, 5000);
  }

  /**
   * Check if page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      const heading = await this.isDisplayed(Locators.pageHeading);
      return heading;
    } catch {
      return false;
    }
  }

  /**
   * Check if loading
   */
  async isLoading(): Promise<boolean> {
    return this.isDisplayed(Locators.loadingSpinner);
  }

  // ==================== Filter Methods ====================

  /**
   * Select task type filter
   */
  async selectTaskType(taskType: string): Promise<void> {
    const select = await this.findElement(Locators.taskTypeSelect);
    await select.click();
    await this.wait(200);
    
    const option = await this.findElement(By.xpath(`//option[contains(text(), "${taskType}")]`));
    await option.click();
  }

  /**
   * Select date range filter
   */
  async selectDateRange(dateRange: string): Promise<void> {
    const select = await this.findElement(Locators.dateRangeSelect);
    await select.click();
    await this.wait(200);
    
    const option = await this.findElement(By.xpath(`//option[contains(text(), "${dateRange}")]`));
    await option.click();
  }

  /**
   * Select comparison mode
   */
  async selectComparisonMode(mode: string): Promise<void> {
    const select = await this.findElement(Locators.comparisonModeSelect);
    await select.click();
    await this.wait(200);
    
    const option = await this.findElement(By.xpath(`//option[contains(text(), "${mode}")]`));
    await option.click();
  }

  /**
   * Click Update button to apply filters
   */
  async applyFilters(): Promise<void> {
    await this.click(Locators.updateButton);
    await this.wait(500);
  }

  /**
   * Check if filter section is visible
   */
  async isFilterSectionVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.filterSection);
  }

  // ==================== KPI Methods ====================

  /**
   * Get current band score
   */
  async getCurrentBandScore(): Promise<string> {
    try {
      return await this.getText(Locators.currentBandValue);
    } catch {
      return 'N/A';
    }
  }

  /**
   * Get tasks completed count
   */
  async getTasksCompletedCount(): Promise<string> {
    try {
      return await this.getText(Locators.tasksCompletedValue);
    } catch {
      return '0';
    }
  }

  /**
   * Get target score
   */
  async getTargetScore(): Promise<string> {
    try {
      return await this.getText(Locators.targetScoreValue);
    } catch {
      return '7';
    }
  }

  /**
   * Check if band change indicator is shown
   */
  async isBandChangeShown(): Promise<boolean> {
    return this.isDisplayed(Locators.bandChangeIndicator);
  }

  /**
   * Check if KPI section is visible
   */
  async isKPISectionVisible(): Promise<boolean> {
    try {
      const current = await this.isDisplayed(Locators.currentBandCard);
      const tasks = await this.isDisplayed(Locators.tasksCompletedCard);
      const target = await this.isDisplayed(Locators.targetScoreCard);
      return current || tasks || target;
    } catch {
      return false;
    }
  }

  // ==================== Chart Methods ====================

  /**
   * Check if score history chart is visible
   */
  async isScoreHistoryChartVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.scoreHistorySection);
  }

  /**
   * Get chart bar count
   */
  async getChartBarCount(): Promise<number> {
    try {
      const bars = await this.findElements(Locators.chartBars);
      return bars.length;
    } catch {
      return 0;
    }
  }

  /**
   * Click view details on chart
   */
  async clickViewDetails(): Promise<void> {
    await this.click(Locators.viewDetailsLink);
  }

  // ==================== AI Insights Methods ====================

  /**
   * Check if AI insights section is visible
   */
  async isAIInsightsVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.aiInsightsSection);
  }

  /**
   * Get insight items count
   */
  async getInsightItemsCount(): Promise<number> {
    try {
      const items = await this.findElements(Locators.insightItems);
      return items.length;
    } catch {
      return 0;
    }
  }

  /**
   * Click view full AI report
   */
  async clickViewFullAIReport(): Promise<void> {
    await this.click(Locators.viewFullReportBtn);
  }

  // ==================== Performance Summary Methods ====================

  /**
   * Check if performance summary is visible
   */
  async isPerformanceSummaryVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.performanceSection);
  }

  /**
   * Get strengths count
   */
  async getStrengthsCount(): Promise<number> {
    try {
      const items = await this.findElements(Locators.strengthItems);
      return items.length;
    } catch {
      return 0;
    }
  }

  /**
   * Get focus areas count
   */
  async getFocusAreasCount(): Promise<number> {
    try {
      const items = await this.findElements(Locators.focusAreaItems);
      return items.length;
    } catch {
      return 0;
    }
  }

  // ==================== Submissions Table Methods ====================

  /**
   * Check if recent submissions section is visible
   */
  async isRecentSubmissionsVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.recentSubmissionsSection);
  }

  /**
   * Get submission rows
   */
  async getSubmissionRows(): Promise<WebElement[]> {
    try {
      return await this.findElements(Locators.tableRows);
    } catch {
      return [];
    }
  }

  /**
   * Get submissions count
   */
  async getSubmissionsCount(): Promise<number> {
    const rows = await this.getSubmissionRows();
    // Check if it's the "no submissions" message row
    if (rows.length === 1) {
      try {
        const text = await rows[0].getText();
        if (text.includes('No submissions yet')) {
          return 0;
        }
      } catch {}
    }
    return rows.length;
  }

  /**
   * Check if no submissions message is shown
   */
  async isNoSubmissionsMessageShown(): Promise<boolean> {
    return this.isDisplayed(Locators.noSubmissionsMessage);
  }

  /**
   * Alias for getSubmissionsCount (for backward compatibility)
   */
  async getSubmissionCount(): Promise<number> {
    return this.getSubmissionsCount();
  }

  /**
   * Alias for isNoSubmissionsMessageShown
   */
  async hasNoDataMessage(): Promise<boolean> {
    return this.isNoSubmissionsMessageShown();
  }

  /**
   * Alias for getChartBarCount
   */
  async hasChartBars(): Promise<boolean> {
    const count = await this.getChartBarCount();
    return count > 0;
  }

  /**
   * Get first submission data
   */
  async getFirstSubmissionData(): Promise<{task: string, date: string, score: string} | null> {
    return this.getSubmissionData(0);
  }

  /**
   * Click view all submissions
   */
  async clickViewAll(): Promise<void> {
    await this.click(Locators.viewAllLink);
  }

  /**
   * View submission by index (0-based)
   */
  async viewSubmissionByIndex(index: number): Promise<void> {
    const rows = await this.getSubmissionRows();
    if (index < rows.length) {
      const viewBtn = await rows[index].findElement(Locators.viewButton);
      await viewBtn.click();
    }
  }

  /**
   * View first submission
   */
  async viewFirstSubmission(): Promise<void> {
    await this.viewSubmissionByIndex(0);
  }

  /**
   * Get submission data by index
   */
  async getSubmissionData(index: number): Promise<{task: string, date: string, score: string} | null> {
    try {
      const rows = await this.getSubmissionRows();
      if (index >= rows.length) return null;
      
      const row = rows[index];
      const task = await row.findElement(Locators.taskCell).getText();
      const date = await row.findElement(Locators.dateCell).getText();
      const score = await row.findElement(Locators.scoreCell).getText();
      
      return { task, date, score };
    } catch {
      return null;
    }
  }

  /**
   * Get all table headers
   */
  async getTableHeaders(): Promise<string[]> {
    try {
      const headers = await this.findElements(Locators.tableHeaders);
      return Promise.all(headers.map(h => h.getText()));
    } catch {
      return [];
    }
  }
}

export default ProgressPage;
