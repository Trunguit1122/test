import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Speaking Practice Page Locators
 */
const Locators = {
  // Question display
  questionText: By.css('.question-text, .topic-question, h2.question'),
  partIndicator: By.css('.part-indicator, [data-part]'),
  questionNumber: By.css('.question-number'),
  timer: By.css('.timer, [data-timer]'),
  
  // Recording controls
  startRecordingBtn: By.css('button.start-recording, button.record, [data-action="record"]'),
  stopRecordingBtn: By.css('button.stop-recording, button.stop, [data-action="stop"]'),
  recordingIndicator: By.css('.recording-indicator, .recording'),
  
  // Audio playback
  audioPlayer: By.css('audio, .audio-player'),
  playButton: By.css('button.play, [data-action="play"]'),
  pauseButton: By.css('button.pause, [data-action="pause"]'),
  
  // Progress
  progressBar: By.css('.progress-bar, progress'),
  
  // Navigation
  nextQuestionBtn: By.css('button.next-question, button.next, [data-action="next"]'),
  prevQuestionBtn: By.css('button.prev-question, button.prev, [data-action="prev"]'),
  
  // Submit
  submitBtn: By.css('button.submit, button[type="submit"], [data-action="submit"]'),
  
  // Microphone permission
  micPermissionModal: By.css('.mic-permission, .permission-modal'),
  allowMicBtn: By.css('button.allow-mic, [data-action="allow"]'),
  denyMicBtn: By.css('button.deny-mic, [data-action="deny"]'),
  
  // Messages
  errorMessage: By.css('.error-message, .error, [role="alert"]'),
  warningMessage: By.css('.warning-message, .warning'),
  
  // Loading
  loadingSpinner: By.css('.loading, .spinner'),
  
  // Exit
  exitBtn: By.css('button.exit, [data-action="exit"]'),
  confirmExitModal: By.css('.confirm-exit, .exit-modal'),
  confirmExitBtn: By.css('button.confirm-exit, [data-action="confirm-exit"]'),
  cancelExitBtn: By.css('button.cancel-exit, [data-action="cancel-exit"]'),
};

/**
 * Speaking Practice Page Object
 * Based on REQ020-REQ045
 */
export class SpeakingPracticePage extends BasePage {
  /**
   * Navigate to speaking practice
   */
  async goto(topicId?: number): Promise<void> {
    if (topicId) {
      await this.navigateTo(`${Routes.SPEAKING_PRACTICE}/${topicId}`);
    } else {
      await this.navigateTo(Routes.SPEAKING);
    }
  }

  /**
   * Get question text
   */
  async getQuestionText(): Promise<string> {
    return this.getText(Locators.questionText);
  }

  /**
   * Get current part
   */
  async getCurrentPart(): Promise<string> {
    return this.getText(Locators.partIndicator);
  }

  /**
   * Get timer value
   */
  async getTimerValue(): Promise<string> {
    return this.getText(Locators.timer);
  }

  /**
   * Start recording
   */
  async startRecording(): Promise<void> {
    await this.click(Locators.startRecordingBtn);
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<void> {
    await this.click(Locators.stopRecordingBtn);
  }

  /**
   * Check if recording
   */
  async isRecording(): Promise<boolean> {
    return this.isDisplayed(Locators.recordingIndicator);
  }

  /**
   * Check if start recording button is visible
   */
  async isStartRecordingVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.startRecordingBtn);
  }

  /**
   * Check if stop recording button is visible
   */
  async isStopRecordingVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.stopRecordingBtn);
  }

  /**
   * Play recorded audio
   */
  async playAudio(): Promise<void> {
    await this.click(Locators.playButton);
  }

  /**
   * Pause audio
   */
  async pauseAudio(): Promise<void> {
    await this.click(Locators.pauseButton);
  }

  /**
   * Check if audio player is visible
   */
  async isAudioPlayerVisible(): Promise<boolean> {
    return this.isDisplayed(Locators.audioPlayer);
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
   * Record and submit (full flow)
   */
  async recordAnswer(durationMs: number = 5000): Promise<void> {
    await this.startRecording();
    await this.wait(durationMs);
    await this.stopRecording();
    await this.wait(500);
  }

  /**
   * Check if microphone permission modal is shown
   */
  async isMicPermissionModalShown(): Promise<boolean> {
    return this.isDisplayed(Locators.micPermissionModal);
  }

  /**
   * Click allow microphone
   */
  async allowMicrophone(): Promise<void> {
    await this.click(Locators.allowMicBtn);
  }

  /**
   * Click deny microphone
   */
  async denyMicrophone(): Promise<void> {
    await this.click(Locators.denyMicBtn);
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
   * Wait for page to load
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForVisible(Locators.questionText);
  }
}
