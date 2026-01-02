/**
 * Message Constants from SRS Document
 * Complete mapping of all MSG codes from BR requirements
 * 
 * Reference: LingoLab SRS v1.0 - December 2025
 * Source: SRS Section 5.5 - Business Rules & Messages
 */
export const Messages = {
  // =============================================
  // UC1: Sign Up (BR1-BR5)
  // =============================================
  
  // MSG-001: Invalid email format (BR2)
  MSG_001: 'Email không hợp lệ. Vui lòng kiểm tra lại (VD: user@example.com).',
  MSG_001_EN: 'Invalid email format. Please check again (e.g., user@example.com).',

  // MSG-002: Email already registered (BR3)
  MSG_002: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.',
  MSG_002_EN: 'This email is already registered. Please sign in or use another email.',

  // MSG-003: Password complexity (BR4)
  MSG_003: 'Mật khẩu phải có 8-32 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
  MSG_003_EN: 'Passwords must be 8-32 characters, containing uppercase, lowercase, number, and special char.',

  // MSG-004: Registration success (BR5)
  MSG_004: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
  MSG_004_EN: 'Registration successful. Please check your email to verify your account.',

  // Password detailed validation (BR4 - detailed messages)
  MSG_096: 'Password must be at least 8 characters',
  MSG_096_EN: 'Mật khẩu phải có ít nhất 8 ký tự',
  MSG_097: 'Password cannot exceed 32 characters',
  MSG_097_EN: 'Mật khẩu không được vượt quá 32 ký tự',
  MSG_098: 'Password must contain at least 1 uppercase letter',
  MSG_098_EN: 'Mật khẩu phải có ít nhất 1 chữ in hoa',
  MSG_099: 'Password must contain at least 1 lowercase letter',
  MSG_099_EN: 'Mật khẩu phải có ít nhất 1 chữ thường',
  MSG_100: 'Password must contain at least 1 number',
  MSG_100_EN: 'Mật khẩu phải có ít nhất 1 chữ số',
  MSG_101: 'Password must contain at least 1 special character',
  MSG_101_EN: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt',

  // =============================================
  // UC2: Sign In (BR6-BR8)
  // =============================================

  // MSG-005: Invalid credentials (BR6)
  MSG_005: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
  MSG_005_EN: 'Invalid email or password. Please try again.',

  // MSG-006: Account inactive/locked (BR7)
  MSG_006: 'Tài khoản của bạn chưa được kích hoạt hoặc đã bị khóa. Vui lòng liên hệ Admin.',
  MSG_006_EN: 'Your account is inactive or locked. Please contact Admin.',

  // MSG-007: Too many failed attempts (BR8)
  MSG_007: 'Quá nhiều lần đăng nhập thất bại. Tài khoản bị khóa 15 phút.',
  MSG_007_EN: 'Too many failed attempts. Account locked for 15 minutes.',

  // =============================================
  // UC3: Forgot/Reset Password (BR9-BR11)
  // =============================================

  // MSG-008: Reset email sent (BR9 - always shown)
  MSG_008: 'Nếu email này tồn tại, đường dẫn đặt lại mật khẩu đã được gửi.',
  MSG_008_EN: 'If this email exists, a password reset link has been sent.',

  // MSG-009: New password same as current (BR11)
  MSG_009: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
  MSG_009_EN: 'The new password cannot be the same as the current password.',

  // =============================================
  // UC4: Update Profile (BR12-BR14)
  // =============================================

  // MSG-010: Display name invalid (BR12)
  MSG_010: 'Tên hiển thị không hợp lệ (rỗng hoặc chứa từ bị cấm).',
  MSG_010_EN: 'Display Name is invalid (Empty or contains prohibited words).',

  // MSG-011: Avatar file invalid (BR13)
  MSG_011: 'File không hợp lệ. Vui lòng tải lên ảnh JPG/PNG dưới 2MB.',
  MSG_011_EN: 'Invalid file. Please upload a JPG/PNG image under 2MB.',

  // =============================================
  // UC8: Record Audio (BR22-BR24)
  // =============================================

  // MSG-012: Microphone permission denied (BR22)
  MSG_012: 'Quyền truy cập microphone bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt.',
  MSG_012_EN: 'Microphone access denied. Please allow access in browser settings.',

  // MSG-013: Recording too short (BR23)
  MSG_013: 'Ghi âm quá ngắn (< 30 giây). Vui lòng thử lại.',
  MSG_013_EN: 'Recording is too short (< 30s). Please try again.',

  // MSG-014: Invalid filename (BR25)
  MSG_014: 'Tên file chứa ký tự không hợp lệ. Chỉ dùng chữ cái, số, \'-\' và \'_\'.',
  MSG_014_EN: 'Filename contains invalid characters. Use only letters, numbers, \'-\', and \'_\'.',

  // =============================================
  // UC10: Submit Speaking (BR27-BR29)
  // =============================================

  // MSG-015: No recording selected (BR27)
  MSG_015: 'Vui lòng chọn một file ghi âm để nộp.',
  MSG_015_EN: 'Please select a recording to submit.',

  // MSG-016: Scoring timeout (BR28)
  MSG_016: 'Dịch vụ chấm điểm quá thời gian. Vui lòng thử lại sau.',
  MSG_016_EN: 'Scoring service timeout. Please try again later.',

  // =============================================
  // UC16: Add Teacher Evaluation (BR36-BR38)
  // =============================================

  // MSG-017: Invalid score (BR36)
  MSG_017: 'Điểm không hợp lệ. Điểm phải từ 0.0 đến 9.0 (bước 0.5).',
  MSG_017_EN: 'Invalid score. The score must be between 0.0 and 9.0 (step 0.5).',

  // MSG-018: Profile updated (BR14)
  MSG_018: 'Cập nhật hồ sơ thành công.',
  MSG_018_EN: 'Profile updated successfully.',

  // =============================================
  // UC5: Select Practice Skill (BR16)
  // =============================================

  // MSG-019: Session expired (BR16)
  MSG_019: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  MSG_019_EN: 'Your session has expired. Please log in again.',

  // =============================================
  // UC13: View Learner Profile (BR33)
  // =============================================

  // MSG-020: Access denied (BR33)
  MSG_020: 'Truy cập bị từ chối. Bạn không có quyền xem tài nguyên này.',
  MSG_020_EN: 'Access denied. You do not have permission to view this resource.',

  // =============================================
  // UC19: Export Reports (BR42-BR45)
  // =============================================

  // MSG-021: Export timeout (BR44)
  MSG_021: 'Xuất báo cáo quá thời gian. Vui lòng chọn khoảng ngày nhỏ hơn.',
  MSG_021_EN: 'Report generation timed out. Please select a smaller date range.',

  // MSG-022: No data to export (BR45)
  MSG_022: 'Không có dữ liệu để xuất.',
  MSG_022_EN: 'No data available to export.',

  // =============================================
  // UC20: Practice Writing (BR46-BR48)
  // =============================================

  // MSG-023: Active session exists (BR48)
  MSG_023: 'Bạn đã có một phiên Writing đang hoạt động. Vui lòng hoàn thành hoặc hủy trước khi bắt đầu mới.',
  MSG_023_EN: 'You already have an active Writing session. Please complete or discard it before starting a new one.',

  // =============================================
  // UC21: Compose Writing (BR49-BR50)
  // =============================================

  // MSG-024: Autosave failed (BR49)
  MSG_024: 'Lưu tự động thất bại. Vui lòng kiểm tra kết nối internet.',
  MSG_024_EN: 'Failed to save your progress. Please check your internet connection.',

  // =============================================
  // UC22: Submit Writing (BR51-BR52)
  // =============================================

  // MSG-025: Essay too short (BR51)
  MSG_025: 'Bài viết quá ngắn. Vui lòng đáp ứng yêu cầu số từ tối thiểu.',
  MSG_025_EN: 'Your essay is too short. Please meet the minimum word count requirement to submit.',

  // MSG-026: Scoring timeout (BR52)
  MSG_026: 'Quá trình chấm điểm đã hết thời gian. Vui lòng kiểm tra internet và thử lại.',
  MSG_026_EN: 'The scoring process timed out. Please check your internet and try again.',

  // =============================================
  // UC23: View AI Scoring (BR53-BR54)
  // =============================================

  // MSG-027: AI Scoring failed (BR54)
  MSG_027: 'Chấm điểm AI thất bại do lỗi hệ thống. Vui lòng yêu cầu chấm lại.',
  MSG_027_EN: 'AI Scoring failed due to a system error. Please request re-scoring.',

  // =============================================
  // UC25: Compare Attempts (BR58-BR62)
  // =============================================

  // MSG-028: Minimum selection (BR58)
  MSG_028: 'Vui lòng chọn ít nhất 2 bài để so sánh.',
  MSG_028_EN: 'Please select at least 2 attempts to compare.',

  // MSG-029: Maximum selection (BR59)
  MSG_029: 'Bạn chỉ có thể so sánh tối đa 5 bài cùng lúc.',
  MSG_029_EN: 'You can only compare a maximum of 5 attempts at a time.',

  // MSG-030: Same skill type (BR60)
  MSG_030: 'Lựa chọn không hợp lệ. Bạn chỉ có thể so sánh các bài cùng kỹ năng (VD: chỉ Writing).',
  MSG_030_EN: 'Invalid selection. You can only compare attempts of the same skill type (e.g., only Writing).',

  // =============================================
  // UC26: Retake Practice (BR63)
  // =============================================

  // MSG-031: Prompt unavailable (BR63)
  MSG_031: 'Đề bài này đã bị vô hiệu hóa hoặc xóa và không thể làm lại.',
  MSG_031_EN: 'This prompt has been disabled or deleted and cannot be retaken.',

  // =============================================
  // Teacher Features (BR76-BR91)
  // =============================================

  // MSG-032: Feedback summary too short (BR76)
  MSG_032: 'Tổng kết phản hồi phải có ít nhất 50 ký tự.',
  MSG_032_EN: 'Feedback summary must be at least 50 characters long.',

  // MSG-033: Feedback sent success (BR76)
  MSG_033: 'Gửi tổng kết phản hồi thành công.',
  MSG_033_EN: 'Feedback summary sent successfully.',

  // MSG-034: Comment too long (BR78)
  MSG_034: 'Bình luận vượt quá giới hạn 1500 ký tự.',
  MSG_034_EN: 'Comment exceeds the maximum limit of 1500 characters.',

  // MSG-035: Edit time limit (BR79)
  MSG_035: 'Bạn chỉ có thể chỉnh sửa bình luận trong 24 giờ sau khi đăng.',
  MSG_035_EN: 'You can only edit comments within 24 hours of posting.',

  // MSG-036: Class capacity (BR80)
  MSG_036: 'Lớp đã đạt số lượng tối đa. Mỗi lớp chỉ có thể có tối đa 200 học viên.',
  MSG_036_EN: 'Class capacity reached. Each class can have a maximum of 200 learners.',

  // MSG-037: Class name duplicate (BR81)
  MSG_037: 'Tên lớp đã tồn tại. Vui lòng chọn tên khác.',
  MSG_037_EN: 'Class names already exist. Please choose a unique name.',

  // MSG-038: Prompt length (BR83)
  MSG_038: 'Đề bài phải có từ 20 đến 500 ký tự.',
  MSG_038_EN: 'Prompt text must be between 20 and 500 characters.',

  // MSG-039: Prompt saved (BR83)
  MSG_039: 'Lưu đề bài thành công.',
  MSG_039_EN: 'Practice prompt saved successfully.',

  // MSG-040: Lock confirmation (BR89)
  MSG_040: 'Bạn có chắc muốn khóa tài khoản học viên này? Họ sẽ không thể đăng nhập.',
  MSG_040_EN: 'Are you sure you want to lock this learner\'s account? They will not be able to log in.',
};

/**
 * Helper function to get message by code
 * @param code - MSG code (e.g., 'MSG_001')
 * @param lang - Language ('vi' or 'en'), defaults to 'en'
 */
export function getMessage(code: MessageCode, lang: 'vi' | 'en' = 'en'): string {
  const key = lang === 'en' ? `${code}_EN` : code;
  return (Messages as Record<string, string>)[key] || (Messages as Record<string, string>)[code] || code;
}

export type MessageCode = keyof typeof Messages;
