import { faker } from '@faker-js/faker';

/**
 * Generate test data utilities
 */
export const TestData = {
  /**
   * Generate valid user registration data
   */
  validUser: () => ({
    email: `test_${Date.now()}@example.com`,
    password: 'ValidP@ss123',
    displayName: faker.person.fullName(),
  }),

  /**
   * Generate random email
   */
  generateEmail: (): string => {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
  },

  /**
   * Generate random password
   */
  generatePassword: (length: number = 12): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += chars[Math.floor(Math.random() * chars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    const allChars = chars + upper + numbers + special;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password;
  },

  /**
   * Generate display name
   */
  generateDisplayName: (): string => {
    return faker.person.fullName();
  },

  /**
   * Generate essay text
   */
  generateEssay: (wordCount: number): string => {
    return faker.lorem.words(wordCount);
  },

  /**
   * Generate invalid email formats
   */
  invalidEmails: [
    'invalid',
    'invalid@',
    '@invalid.com',
    'invalid@.com',
    'invalid@domain',
    'invalid @domain.com',
    'invalid@domain .com',
    'invalid@@domain.com',
  ],

  /**
   * Generate weak passwords
   */
  weakPasswords: [
    { password: 'short1!', reason: 'too short' },
    { password: 'nouppercase1!', reason: 'no uppercase' },
    { password: 'NOLOWERCASE1!', reason: 'no lowercase' },
    { password: 'NoNumbers!', reason: 'no number' },
    { password: 'NoSpecial123', reason: 'no special char' },
  ],

  /**
   * Generate valid passwords
   */
  validPasswords: [
    'ValidP@ss123',
    'Str0ng!Pass',
    'MyP@ssw0rd!',
    'Test1234!@#',
  ],

  /**
   * Generate sample writing texts
   */
  writingTexts: {
    underMinimum: 'This is a short text.',
    minimum: Array(150).fill('word').join(' '), // 150 words
    optimal: Array(250).fill('word').join(' '), // 250 words
    aboveRecommended: Array(400).fill('word').join(' '), // 400 words
  },

  /**
   * Generate random string
   */
  randomString: (length: number = 10): string => {
    return faker.string.alphanumeric(length);
  },

  /**
   * Generate random email (alias)
   */
  randomEmail: (): string => {
    return faker.internet.email();
  },
};
