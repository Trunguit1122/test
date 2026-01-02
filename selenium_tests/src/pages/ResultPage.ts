import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { Routes } from '../config';

/**
 * Result Page Locators
 */
const Locators = {
  // Score display
  overallScore: By.css('.overall-score, [data-score="overall"]'),
  fluencyScore: By.css('.fluency-score, [data-score="fluency"]'),
  pronunciationScore: By.css('.pronunciation-score, [data-score="pronunciation"]'),
  grammarScore: By.css('.grammar-score, [data-score="grammar"]'),
  vocabularyScore: By.css('.vocabulary-score, [data-score="vocabulary"]'),
  coherenceScore: By.css('.coherence-score, [data-score="coherence"]'),
  taskResponseScore: By.css('.task-response-score, [data-score="task-response"]'),
  lexicalResourceScore: By.css('.lexical-resource-score, [data-score="lexical"]'),
  
  // Band score
  bandScore: By.css('.band-score, [data-band]'),
  
  // Feedback
  feedbackSection: By.css('.feedback, [data-section="feedback"]'),
  strengths: By.css('.strengths, [data-feedback="strengths"]'),
  improvements: By.css('.improvements, [data-feedback="improvements"]'),
  
  // Detailed feedback
  detailedFeedback: By.css('.detailed-feedback, [data-section="detailed"]'),
  expandFeedbackBtn: By.css('button.expand-feedback, [data-action="expand"]'),
  
  // Answer display
  answerSection: By.css('.answer-section, [data-section="answer"]'),
  userAnswer: By.css('.user-answer'),
  sampleAnswer: By.css('.sample-answer'),
  
  // Speaking specific
  audioPlayback: By.css('audio.answer-audio, .audio-playback'),
  transcription: By.css('.transcription, [data-section="transcription"]'),
  
  // Writing specific
  correctedText: By.css('.corrected-text, [data-section="corrected"]'),
  highlightedErrors: By.css('.highlighted-errors, [data-highlight]'),
  
  // Actions
  retryBtn: By.css('button.retry, [data-action="retry"]'),
  backToListBtn: By.css('button.back-to-list, [data-action="back"]'),
  shareBtn: By.css('button.share, [data-action="share"]'),
  downloadBtn: By.css('button.download, [data-action="download"]'),
  
  // Loading
  loadingSpinner: By.css('.loading, .spinner'),
  
  // Messages
  errorMessage: By.css('.error-message, .error, [role="alert"]'),
};

/**
 * Result Page Object
 * Based on REQ071-REQ077
 */
export class ResultPage extends BasePage {
  /**
   * Navigate to result page
   */
  async goto(attemptId: number): Promise<void> {
    await this.navigateTo(`${Routes.RESULT}/${attemptId}`);
  }

  /**
   * Get overall score
   */
  async getOverallScore(): Promise<number> {
    const text = await this.getText(Locators.overallScore);
    return parseFloat(text);
  }

  /**
   * Get band score
   */
  async getBandScore(): Promise<number> {
    const text = await this.getText(Locators.bandScore);
    return parseFloat(text);
  }

  /**
   * Get fluency score
   */
  async getFluencyScore(): Promise<number> {
    const text = await this.getText(Locators.fluencyScore);
    return parseFloat(text);
  }

  /**
   * Get pronunciation score
   */
  async getPronunciationScore(): Promise<number> {
    const text = await this.getText(Locators.pronunciationScore);
    return parseFloat(text);
  }

  /**
   * Get grammar score
   */
  async getGrammarScore(): Promise<number> {
    const text = await this.getText(Locators.grammarScore);
    return parseFloat(text);
  }

  /**
   * Get vocabulary score
   */
  async getVocabularyScore(): Promise<number> {
    const text = await this.getText(Locators.vocabularyScore);
    return parseFloat(text);
  }

  /**
   * Get coherence score
   */
  async getCoherenceScore(): Promise<number> {
    const text = await this.getText(Locators.coherenceScore);
    return parseFloat(text);
  }

  /**
   * Get task response score
   */
  async getTaskResponseScore(): Promise<number> {
    const text = await this.getText(Locators.taskResponseScore);
    return parseFloat(text);
  }

  /**
   * Get lexical resource score
   */
  async getLexicalResourceScore(): Promise<number> {
    const text = await this.getText(Locators.lexicalResourceScore);
    return parseFloat(text);
  }

  /**
   * Check if feedback is displayed
   */
  async isFeedbackDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.feedbackSection);
  }

  /**
   * Get strengths text
   */
  async getStrengthsText(): Promise<string> {
    return this.getText(Locators.strengths);
  }

  /**
   * Get improvements text
   */
  async getImprovementsText(): Promise<string> {
    return this.getText(Locators.improvements);
  }

  /**
   * Expand detailed feedback
   */
  async expandDetailedFeedback(): Promise<void> {
    await this.click(Locators.expandFeedbackBtn);
  }

  /**
   * Check if detailed feedback is displayed
   */
  async isDetailedFeedbackDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.detailedFeedback);
  }

  /**
   * Get user answer
   */
  async getUserAnswer(): Promise<string> {
    return this.getText(Locators.userAnswer);
  }

  /**
   * Get sample answer
   */
  async getSampleAnswer(): Promise<string> {
    return this.getText(Locators.sampleAnswer);
  }

  /**
   * Play answer audio
   */
  async playAnswerAudio(): Promise<void> {
    const audio = await this.findElement(Locators.audioPlayback);
    await this.executeScript('arguments[0].play()', audio);
  }

  /**
   * Check if transcription is displayed
   */
  async isTranscriptionDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.transcription);
  }

  /**
   * Get transcription text
   */
  async getTranscriptionText(): Promise<string> {
    return this.getText(Locators.transcription);
  }

  /**
   * Check if corrected text is displayed
   */
  async isCorrectedTextDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.correctedText);
  }

  /**
   * Get corrected text
   */
  async getCorrectedText(): Promise<string> {
    return this.getText(Locators.correctedText);
  }

  /**
   * Click retry
   */
  async clickRetry(): Promise<void> {
    await this.click(Locators.retryBtn);
  }

  /**
   * Click back to list
   */
  async clickBackToList(): Promise<void> {
    await this.click(Locators.backToListBtn);
  }

  /**
   * Click share
   */
  async clickShare(): Promise<void> {
    await this.click(Locators.shareBtn);
  }

  /**
   * Click download
   */
  async clickDownload(): Promise<void> {
    await this.click(Locators.downloadBtn);
  }

  /**
   * Check if error is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(Locators.errorMessage);
  }

  /**
   * Wait for results to load
   */
  async waitForResultsToLoad(): Promise<void> {
    await this.waitForVisible(Locators.overallScore);
  }

  /**
   * Check if loading
   */
  async isLoading(): Promise<boolean> {
    return this.isDisplayed(Locators.loadingSpinner);
  }
}
