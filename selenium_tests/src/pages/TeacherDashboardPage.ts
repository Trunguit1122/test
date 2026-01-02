import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Teacher Dashboard Page Locators - Updated for Real FE
 * Based on LingoLab-FE/src/pages/teacher/TeacherDashboard.tsx
 */
const Locators = {
  // Page elements
  pageTitle: By.xpath('//p[contains(text(), "Welcome back")]'),
  loadingSpinner: By.css('.animate-spin'),
  
  // Header buttons
  createTaskBtn: By.xpath('//button[contains(., "Create New Task")]'),
  addStudentBtn: By.xpath('//button[contains(., "Add Student")]'),
  
  // Stats cards (sidebar)
  statsCard: By.css('.bg-white.rounded-xl'),
  totalStudentsCard: By.xpath('//p[contains(text(), "Total Students")]/following-sibling::p'),
  activeTasksCard: By.xpath('//p[contains(text(), "Active Tasks")]/following-sibling::p'),
  averageGradeCard: By.xpath('//p[contains(text(), "Average Grade")]/following-sibling::p'),
  
  // My Courses section
  coursesSection: By.xpath('//h2[contains(text(), "My Courses")]'),
  courseCard: By.css('.w-64.rounded-xl'),
  
  // Student Management table
  studentManagementSection: By.xpath('//h2[contains(text(), "Student Management")]'),
  studentTable: By.css('table'),
  studentRow: By.css('tbody tr'),
  studentNameCell: By.css('td:first-child'),
  viewStudentBtn: By.xpath('//button[.//svg[contains(@class, "lucide-eye")]]'),
  
  // Pending Reviews table
  pendingReviewsSection: By.xpath('//h2[contains(text(), "Pending Reviews")]'),
  pendingTable: By.xpath('//h2[contains(text(), "Pending Reviews")]/following-sibling::div//table'),
  reviewBtn: By.xpath('//button[contains(text(), "Review")]'),
  
  // Student Progress section
  progressSection: By.xpath('//h2[contains(text(), "Student Progress")]'),
  progressCircle: By.css('svg circle'),
  
  // Upcoming Deadlines section  
  deadlinesSection: By.xpath('//h2[contains(text(), "Upcoming Deadlines")]'),
  
  // Quick Actions section
  quickActionsSection: By.xpath('//h2[contains(text(), "Quick Actions")]'),
  
  // No data messages
  noStudentsMessage: By.xpath('//td[contains(text(), "No students found")]'),
  noPendingMessage: By.xpath('//td[contains(text(), "No pending reviews")]'),
  noCoursesMessage: By.xpath('//p[contains(text(), "No courses created")]'),
};

/**
 * Teacher Dashboard Page Object for Real FE
 * Maps to UC11-UC19, UC31-UC36 (Teacher Use Cases)
 */
export class TeacherDashboardPage extends BasePage {
  /**
   * Navigate to teacher dashboard
   */
  async goto(): Promise<void> {
    await this.navigateTo(Routes.TEACHER_DASHBOARD);
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for loading spinner to disappear
    try {
      await this.waitForInvisible(Locators.loadingSpinner, 10000);
    } catch {
      // Spinner might not be visible
    }
    // Wait for page title
    await this.waitForVisible(Locators.pageTitle, 10000);
  }

  /**
   * Wait for data to load (alias for waitForPageLoad)
   */
  async waitForDataToLoad(): Promise<void> {
    await this.waitForPageLoad();
  }

  /**
   * Check if page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    return this.isDisplayed(Locators.pageTitle);
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoading(): Promise<boolean> {
    return this.isDisplayed(Locators.loadingSpinner);
  }

  // ==================== Stats Methods ====================

  /**
   * Get total students count from stats card
   */
  async getTotalStudents(): Promise<number> {
    try {
      const text = await this.getText(Locators.totalStudentsCard);
      return parseInt(text.replace(/\D/g, ''), 10) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get active tasks count
   */
  async getActiveTasks(): Promise<number> {
    try {
      const text = await this.getText(Locators.activeTasksCard);
      return parseInt(text.replace(/\D/g, ''), 10) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get average grade
   * Alias for getAverageScore
   */
  async getAverageScore(): Promise<number> {
    try {
      const text = await this.getText(Locators.averageGradeCard);
      return parseFloat(text) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Alias for backward compatibility
   */
  async getTotalAttempts(): Promise<number> {
    return this.getActiveTasks();
  }

  // ==================== Course Methods ====================

  /**
   * Check if courses section is visible
   */
  async isCoursesSectionVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.coursesSection);
  }

  /**
   * Get course cards
   */
  async getCourseCards(): Promise<any[]> {
    return this.findElements(Locators.courseCard);
  }

  /**
   * Get course count
   */
  async getCourseCount(): Promise<number> {
    const cards = await this.getCourseCards();
    return cards.length;
  }

  // ==================== Student Management Methods ====================

  /**
   * Check if student management section is visible
   */
  async isStudentManagementVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.studentManagementSection);
  }

  /**
   * Get student rows
   */
  async getStudentRows(): Promise<any[]> {
    try {
      return await this.findElements(Locators.studentRow);
    } catch {
      return [];
    }
  }

  /**
   * Get student count
   */
  async getStudentCount(): Promise<number> {
    const rows = await this.getStudentRows();
    // Check if first row is "no students" message
    if (rows.length === 1) {
      try {
        const text = await rows[0].getText();
        if (text.includes('No students')) return 0;
      } catch {
        // Continue
      }
    }
    return rows.length;
  }

  /**
   * Search for student (placeholder - Real FE may not have inline search)
   */
  async searchStudent(query: string): Promise<void> {
    // Real FE doesn't have search on dashboard
    // Just wait
    await this.wait(300);
  }

  /**
   * View first student details
   */
  async viewFirstStudent(): Promise<void> {
    const rows = await this.getStudentRows();
    if (rows.length > 0) {
      // Click on the row itself
      await rows[0].click();
    }
  }

  /**
   * Check if student detail is visible (navigated to student page)
   */
  async isStudentDetailVisible(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('/teacher/students/');
  }

  // ==================== Pending Reviews Methods ====================

  /**
   * Check if pending reviews section is visible
   */
  async isPendingReviewsVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.pendingReviewsSection);
  }

  /**
   * Get pending review rows (attempt rows)
   */
  async getAttemptRows(): Promise<any[]> {
    try {
      const pendingTable = await this.findElement(Locators.pendingTable);
      return await pendingTable.findElements(By.css('tbody tr'));
    } catch {
      return [];
    }
  }

  /**
   * View first attempt/review
   */
  async viewFirstAttempt(): Promise<void> {
    const reviewBtns = await this.findElements(Locators.reviewBtn);
    if (reviewBtns.length > 0) {
      await reviewBtns[0].click();
    }
  }

  // ==================== Action Methods ====================

  /**
   * Click Create New Task button
   */
  async clickCreateTask(): Promise<void> {
    await this.click(Locators.createTaskBtn);
  }

  /**
   * Click Add Student button
   */
  async clickAddStudent(): Promise<void> {
    await this.click(Locators.addStudentBtn);
  }

  // ==================== Filter Methods (Placeholder) ====================
  
  /**
   * Filter by skill - Real FE may not have this on dashboard
   */
  async filterBySkill(skill: 'speaking' | 'writing' | 'all'): Promise<void> {
    // Not available on Real FE dashboard
    await this.wait(300);
  }

  // ==================== Export Methods (Placeholder) ====================

  /**
   * Export as CSV - may not be available
   */
  async exportAsCSV(): Promise<void> {
    // Not available on Real FE dashboard
  }

  /**
   * Export as PDF - may not be available
   */
  async exportAsPDF(): Promise<void> {
    // Not available on Real FE dashboard
  }

  // ==================== Pagination Methods (Placeholder) ====================

  /**
   * Go to next page - Student table shows limited rows
   */
  async goToNextPage(): Promise<void> {
    // Not available on Real FE dashboard (shows first 5 students)
  }

  /**
   * Go to previous page
   */
  async goToPrevPage(): Promise<void> {
    // Not available
  }
}
