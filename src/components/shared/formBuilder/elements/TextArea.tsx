import React from "react"
import { Field, ErrorMessage } from "formik"
import { FormikProps } from "../FormController"

function TextArea({ label, name, ...rest }: FormikProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field as="textarea" id={name} name={name} {...rest} />
      <ErrorMessage name={name} />
    </div>
  )
}
export default TextArea