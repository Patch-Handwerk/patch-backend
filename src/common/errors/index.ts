import { ErrorResponseDto } from 'src/modules/auth/dto/error-response.dto';

type ErrorResponseType = Pick<ErrorResponseDto, 'message' | 'translationCode'>;

/**
 * The objective of this file is to centralize all error messages and codes in
 * one place, so that they can be easily managed and updated. This also helps
 * to ensure consistency in error responses across the application.
 *
 * Each error is defined with a unique error code and a corresponding message.
 * The error codes can be used by the frontend to handle specific error cases
 * in a more granular way, while the messages provide a human-readable
 * description of the error for debugging and logging purposes.
 *
 * Each error code is defined in UPPER_SNAKE_CASE format to maintain consistency
 * and improve readability, and MUST be defined in Tolgee as well for
 * localization purposes under the "errors" namespace. Do note that, if an error
 * code is not defined in Tolgee, the frontend will receive the error and display
 * the error code itselfas the message, which damages user experience.
 *
 * Example usage:
 * throw new UnauthorizedException(errorsList.invalidCredentials);
 */
const errorsList: Record<string, ErrorResponseType> = {
  invalidCredentials: {
    message: 'Invalid credentials',
    translationCode: 'INVALID_CREDENTIALS',
  },
  emailNotVerified: {
    message: 'Email not verified',
    translationCode: 'EMAIL_NOT_VERIFIED',
  },
  awaitingAdminApproval: {
    message: 'Awaiting admin approval',
    translationCode: 'AWAITING_ADMIN_APPROVAL',
  },
  userRegistrationRejected: {
    message: 'User registration rejected by admin',
    translationCode: 'USER_REGISTRATION_REJECTED',
  },
};

export { errorsList };
