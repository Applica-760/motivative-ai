/**
 * Auth Feature Model
 * Feature-Sliced Design: features/auth/model
 */

export type {
  User,
  AuthService,
  AuthState,
  LoginCredentials,
  SignUpCredentials,
  PasswordResetRequest,
  AuthErrorCode,
} from './types';

export { AuthError, AuthErrorCode as AuthErrorCodes } from './types';
export { AuthProvider, useAuth } from './AuthContext';

// Validation
export type { ValidationResult } from './validation';
export {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateLoginForm,
  validateSignUpForm,
} from './validation';

// Validators
export { AuthValidators } from './validators';
