/**
 * Application Routes - Updated for Real FE
 */
export const Routes = {
  // Base
  HOME: '/',
  
  // Auth routes
  SIGN_UP: '/signup',
  SIGN_IN: '/signin',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Student routes - Real FE uses /student prefix
  DASHBOARD: '/student',
  STUDENT_DASHBOARD: '/student',
  PROFILE: '/student/profile',
  PROGRESS: '/student/progress',  // Real FE has progress page
  HISTORY: '/student/progress',   // Map history to progress for compatibility
  PRACTICE_HISTORY: '/student/progress',
  RESULT: '/student/report',
  SCORING: '/student/scoring',
  STATISTICS: '/student/progress',  // Stats in progress page
  
  // Speaking/Writing routes (for compatibility - Real FE may not have these)
  SPEAKING: '/student/speaking',
  SPEAKING_LIST: '/student/speaking',
  SPEAKING_PRACTICE: '/student/speaking/practice',
  WRITING: '/student/writing',
  WRITING_LIST: '/student/writing',
  WRITING_PRACTICE: '/student/writing/practice',

  // Teacher routes
  TEACHER_DASHBOARD: '/teacher',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_REPORTS: '/teacher/reports',
  TEACHER_STATISTICS: '/teacher/statistics',
} as const;

export type Route = typeof Routes[keyof typeof Routes];
