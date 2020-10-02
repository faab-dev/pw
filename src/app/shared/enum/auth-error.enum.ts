export enum AuthError {
  REQUIRED = 'required',
  USER_NOT_FOUND = 'auth_user_not_found',
  USER_OR_PASSWORD_NOT_FOUND = 'user_or_password_not_found',
  WS_IS_NOT_AUTHORIZED = 'auth_websocket_is_not_authorized',
  PHONENUMBER_NOT_FOUND = 'auth_phonenumber_not_found',
  TIMEOUT = 'auth_timeout',
  ACTIVE_SESSION_NOT_FOUND = 'auth_phonenumber_not_found',
  INVALIDE_TOKEN = 'auth_invalide_token',
  NO_PERMISSIONS = 'user_has_not_permissions'
}
