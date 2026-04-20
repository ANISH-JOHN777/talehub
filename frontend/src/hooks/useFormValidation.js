import { useState } from 'react'
import { validators, SchemaValidator } from '../utils/formValidation'
import { showToast } from '../utils/toast'

// Custom hook for form validation
export function useFormValidation(initialData, schema) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validator = new SchemaValidator(schema)

  const validateField = (fieldName, value) => {
    const fieldSchema = schema[fieldName]
    if (!fieldSchema) return null

    const validators_array = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema]
    
    for (let validator_fn of validators_array) {
      const error = validator_fn(value)
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }))
        return error
      }
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: null }))
    return null
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({ ...prev, [name]: finalValue }))

    // Validate on change if field was touched
    if (touched[name]) {
      validateField(name, finalValue)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const validateAll = () => {
    const result = validator.validate(formData)
    setErrors(result.errors)
    return result.isValid
  }

  const reset = () => {
    setFormData(initialData)
    setErrors({})
    setTouched({})
  }

  const getFieldError = (fieldName) => {
    return errors[fieldName] || null
  }

  const isFieldTouched = (fieldName) => {
    return touched[fieldName] || false
  }

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    reset,
    getFieldError,
    isFieldTouched,
  }
}

export default useFormValidation
