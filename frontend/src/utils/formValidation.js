// Form validation utilities
export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return 'Email is required'
    if (!emailRegex.test(value)) return 'Please enter a valid email'
    return null
  },

  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain number'
    return null
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`
    }
    return null
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (!value) return null
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`
    }
    return null
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (!value) return null
    if (value.length > max) {
      return `${fieldName} must not exceed ${max} characters`
    }
    return null
  },

  number: (value) => {
    if (!value) return 'This field is required'
    if (isNaN(value)) return 'Must be a valid number'
    return null
  },

  positiveNumber: (value) => {
    const numberError = validators.number(value)
    if (numberError) return numberError
    if (Number(value) <= 0) return 'Must be a positive number'
    return null
  },

  url: (value) => {
    if (!value) return 'URL is required'
    try {
      new URL(value)
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  },

  phone: (value) => {
    if (!value) return 'Phone is required'
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
    return null
  },

  confirmPassword: (value, confirmValue) => {
    if (value !== confirmValue) return 'Passwords do not match'
    return null
  },
}

// Form error handler class
export class FormValidator {
  constructor() {
    this.errors = {}
  }

  addError(field, message) {
    this.errors[field] = message
  }

  clearError(field) {
    delete this.errors[field]
  }

  clearAll() {
    this.errors = {}
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  getError(field) {
    return this.errors[field] || null
  }

  validate(fieldName, value, validator) {
    const error = validator(value)
    if (error) {
      this.addError(fieldName, error)
    } else {
      this.clearError(fieldName)
    }
    return error
  }

  getErrors() {
    return this.errors
  }
}

// Schema validator for multiple fields
export class SchemaValidator {
  constructor(schema) {
    this.schema = schema
  }

  validate(formData) {
    const errors = {}

    Object.keys(this.schema).forEach((field) => {
      const validators = this.schema[field]
      let fieldValue = formData[field]

      if (Array.isArray(validators)) {
        for (let validator of validators) {
          const error = validator(fieldValue)
          if (error) {
            errors[field] = error
            break
          }
        }
      } else {
        const error = validators(fieldValue)
        if (error) {
          errors[field] = error
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

export default {
  validators,
  FormValidator,
  SchemaValidator,
}
