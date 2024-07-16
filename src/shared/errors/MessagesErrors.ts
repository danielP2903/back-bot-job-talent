export enum MessagesError {
  INTERNAL_EXCEPTION = 'Error interno del servidor, intente mas tarde',
  TOO_MANY_REQUESTS = 'You have exceeded the maximum allowed requests per minute. Please try again in 1 minute',
  TOKEN_NOT_FOUND = 'Por favor provea un JWT válido',
  TOKEN_INVALID = 'Token no válido',
  FORBIDDEN_RESOURCE = 'No tienes permisos para acceder a este recurso',
  MAXIMUM_FIVE_QUESTIONS_BY_INTERVIEW = 'Solo es permitidos 5 preguntas por entrevista',
  USER_ALREADY_EXIST = 'Usuario ya existe',
  INVALID_CREDENTIALS = 'Usuario o contraseña invalidos',
  USER_NOT_FOUND = 'Usuario no existe',
}
