import React, { useState } from "react";
import { CustomFormProps } from "../movie.type";

const CustomForm: React.FC<CustomFormProps> = ({
  fields,
  onSubmit,
  submitButtonText,
  formData,
  setFormData,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map(field => [field.name, false]))
  );

  const [errorVisible, setErrorVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map(field => [field.name, false]))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const field = fields.find(f => f.name === name);
    if (field) {
      const isValid = field.validation(value);
      setErrors(prevErrors => ({ ...prevErrors, [name]: !isValid }));
      if (isValid) {
        setErrorVisible(prev => ({ ...prev, [name]: false }));
      }
    }
  };

  const handleFocus = (field: string) => {
    setErrorVisible((prev) => ({ ...prev, [field]: false }));
  };

  const handleBlur = (field: string) => {
    setErrorVisible((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      fields.map((field) => [field.name, !field.validation(formData[field.name])])
    );

    setErrors(newErrors);
    const updatedErrorVisibility = Object.fromEntries(
      fields.map((field) => [field.name, true])
    );

    setErrorVisible(updatedErrorVisibility);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            className="w-full p-3 rounded bg-dark text-white outline-none focus:outline-white"
            onChange={handleChange}
            onFocus={() => handleFocus(field.name)}
            onBlur={() => handleBlur(field.name)}
          />
          {errors[field.name] && errorVisible[field.name] && (
            <p className="text-red-500 text-xs">{field.errorMessage}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-primary text-white hover:bg-opacity-80 transition py-3 rounded-md"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default CustomForm;
