import React from "react"
import { Field, ErrorMessage } from "formik"
import { FormikProps } from "../FormController"

function Select({ label, name, options, ...rest }:FormikProps ) {
  return (
    <div>
      {/* <label htmlFor={name}>{label}</label>
      <Field as="select" id={name} name={name} {...rest}>
        {options?.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          )
        })}
      </Field>
      <ErrorMessage name={name} /> */}
    </div>
  )
}

export default Select