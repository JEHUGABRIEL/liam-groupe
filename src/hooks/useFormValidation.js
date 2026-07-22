import { useState, useCallback } from "react";

const INITIAL_ERRORS = { name: "", email: "", phone: "" };
const INITIAL_TOUCHED = { name: false, email: false, phone: false };


export default function useFormValidation() {
  const [errors, setErrors] = useState({ ...INITIAL_ERRORS });
  const [touched, setTouched] = useState({ ...INITIAL_TOUCHED });

  
  const validateField = useCallback((field, value) => {
    switch (field) {
      case "name":
        return value.trim().length < 2
          ? "Le nom doit contenir au moins 2 caractères"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Adresse email invalide"
          : "";
      case "phone":
        if (value && !/^[\d\s+\-()]{6,20}$/.test(value))
          return "Numéro de téléphone invalide";
        return "";
      default:
        return "";
    }
  }, []);

  
  const handleBlur = useCallback(
    (field, formValues) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, formValues[field]),
      }));
    },
    [validateField]
  );

  
  const validateAll = useCallback(
    (formValues) => {
      const allErrors = {
        name: validateField("name", formValues.name),
        email: validateField("email", formValues.email),
        phone: validateField("phone", formValues.phone),
      };
      setErrors(allErrors);
      setTouched({ name: true, email: true, phone: true });
      return allErrors;
    },
    [validateField]
  );

  
  const resetValidation = useCallback(() => {
    setErrors({ ...INITIAL_ERRORS });
    setTouched({ ...INITIAL_TOUCHED });
  }, []);

  
  const setFieldError = useCallback(
    (field, value) => {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    },
    [validateField]
  );

  const hasErrors = !!(errors.name || errors.email);

  return {
    errors,
    touched,
    hasErrors,
    validateField,
    handleBlur,
    validateAll,
    resetValidation,
    setFieldError,
  };
}
