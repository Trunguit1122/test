import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Writing Practice Page Locators
 */
const Locators = {
  // Question display
  questionText: By.css('.question-text, .topic-question, h2.question'),
  taskType: By.css('.task-type, [data-task]'),
  wordCount: By.css('.word-count, [data-word-count]'),
  timer: By.css('.timer, [data-timer]'),
  
  // Writing area
  writingTextarea: By.css('textarea.writing, textarea[name="answer"], .writing-area textarea'),
  
  // Toolbar
  toolbar: By.css('.toolbar, .editor-toolbar'),
  boldBtn: By.css('button.bold, [data-format="bold"]'),
  italicBtn: By.css('button.italic, [data-format="italic"]'),
  underlineBtn: By.css('button.underline, [data-format="underline"]'),
  
  // Progress
  progressBar: By.css('.progress-bar, progress'),
  
  // Navigation
  nextQuestionBtn: By.css('button.next-question, button.next, [data-action="next"]'),
  prevQuestionBtn: By.css('button.prev-question, button.prev, [data-action="prev"]'),
  
  // Submit
  submitBtn: By.css('button.submit, button[type="submit"], [data-action="submit"]'),
  
  // Messages
  errorMessage: By.css('.error-message, .error, [role="alert"]'),
  warningMessage: By.css('.warning-message, .warning'),
  wordCountWarning: By.css('.word-count-warning'),
  
  // Loading
  loadingSpinner: By.css('.loading, .spinner'),
  
  // Exit
  exitBtn: By.css('button.exit, [data-action="exit"]'),
  confirmExitModal: By.css('.confirm-exit, .exit-modal'),
  confirmExitBtn: By.css('button.confirm-exit, [data-action="confirm-exit"]'),
  cancelExitBtn: By.css('button.cancel-exit, [data-action="cancel-exit"]'),
  
  // Auto-save indicator
  autoSaveIndicator: By.css('.auto-save, [data-autosave]'),
};

/**
 * Writing Practice Page Object
 * Based on REQ046-REQ070
 */
export class WritingPracticePage extends BasePage {
  /**
   * Navigate to writing practice
   */
  async goto(topicId?: number): Promise<void> {
    if (topicId) {
      await this.navigateTo(`${Routes.WRITING_PRACTICE}/${topicId}`);
    } else {
      await this.navigateTo(Routes.WRITING);
    }
  }

  /**
   * Get question text
   */
  async getQuestionText(): Promise<string> {
    return this.getText(Locators.questionText);
  }

  /**
   * Get task type
   */
  async getTaskType(): Promise<string> {
    return this.getText(Locators.taskType);
  }

  /**
   * Get timer value
   */
  async getTimerValue(): Promise<string> {
    return this.getText(Locators.timer);
  }

  /**
   * Type answer
   */
  async typeAnswer(text: string): Promise<void> {
    await this.type(Locators.writingTextarea, text);
  }

  /**
   * Clear answer
   */
  async clearAnswer(): Promise<void> {
    await this.clear(Locators.writingTextarea);
  }

  /**
   * Get answer text
   */
  async getAnswerText(): Promise<string> {
    return this.getValue(Locators.writingTextarea);
  }

  /**
   * Get word count
   */
  async getWordCount(): Promise<number> {
    const text = await this.getText(Locators.wordCount);
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Apply bold formatting
   */
  async applyBold(): Promise<void> {
    await this.click(Locators.boldBtn);
  }

  /**
   * Apply italic formatting
   */
  async applyItalic(): Promise<void> {
    await this.click(Locators.italicBtn);
  }

  /**
   * Apply underline formatting
   */
  async applyUnderline(): Promise<void> {
    await this.click(Locators.underlineBtn);
  }

  /**
   * Go to next question
   */
  async goToNextQuestion(): Promise<void> {
    await this.click(Locators.nextQuestionBtn);
  }

  /**
   * Go to previous question
   */
  async goToPrevQuestion(): Promise<void> {
    await this.click(Locators.prevQuestionBtn);
  }

  /**
   * Check if next question button is enabled
   */
  async isNextQuestionEnabled(): Promise<boolean> {
    return this.isEnabled(Locators.nextQuestionBtn);
  }

  /**
   * Check if next question button is disabled
   */
  async isNextQuestionDisabled(): Promise<boolean> {
    return this.isDisabled(Locators.nextQuestionBtn);
  }

  /**
   * Submit practice
   */
  async submit(): Promise<void> {
    await this.click(Locators.submitBtn);
  }

  /**
   * Check if submit button is visible
   */
  async isSubmitVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.submitBtn);
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitEnabled(): Promise<boolean> {
    return this.isEnabled(Locators.submitBtn);
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return this.isDisabled(Locators.submitBtn);
  }

  /**
   * Check if error is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.errorMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(Locators.errorMessage);
  }

  /**
   * Check if word count warning is displayed
   */
  async isWordCountWarningDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.wordCountWarning);
  }

  /**
   * Click exit
   */
  async clickExit(): Promise<void> {
    await this.click(Locators.exitBtn);
  }

  /**
   * Confirm exit
   */
  async confirmExit(): Promise<void> {
    await this.click(Locators.confirmExitBtn);
  }

  /**
   * Cancel exit
   */
  async cancelExit(): Promise<void> {
    await this.click(Locators.cancelExitBtn);
  }

  /**
   * Check if confirm exit modal is shown
   */
  async isConfirmExitModalShown(): Promise<boolean> {
    return this.isDisplayed(Locators.confirmExitModal);
  }

  /**
   * Check if auto-save indicator is visible
   */
  async isAutoSaveVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.autoSaveIndicator);
  }

  /**
   * Wait for page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(Locators.questionText);
  }

  /**
   * Write essay (full flow)
   */
  async writeEssay(text: string): Promise<void> {
    await this.clearAnswer();
    await this.typeAnswer(text);
    await this.wait(1000); // Wait for word count update
  }
}
