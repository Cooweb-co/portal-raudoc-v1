import { email, helpers, numeric, required } from '@vuelidate/validators'

export const MESSAGE_REQUIRED = helpers.withMessage(
  'Este campo es requerido.',
  required,
)

export const MESSAGE_ALPHA_NUM = helpers.withMessage(
  'Este campo no permite caracteres especiales',
  helpers.regex(/^[A-Za-záéíóúüÁÉÍÓÚÜñÑ0-9\s]+$/),
)

export const MESSAGE_ALPHA = helpers.withMessage(
  'Este campo solo permite caracteres alfabeticos',
  helpers.regex(/^[a-zA-Záéíóúüñ ]+$/),
)

export const MESSAGE_NUMERIC = helpers.withMessage(
  'Este campo solo permite caracteres númericos',
  numeric,
)

export const MESSAGE_EMAIL = helpers.withMessage(
  'El correo no es valido',
  email,
)
