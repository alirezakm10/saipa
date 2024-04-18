import React from "react"
import { Field, ErrorMessage } from "formik"
import { FormikProps } from "../FormController"

function RadioButtons({ label, name, options,type, ...rest }: FormikProps) {
  return (
    <div>
      {/* <label>{label}</label>
      <Field name={name}>
        {(formik:FormikProps) => {
          const { field } = formik
          return options?.map(option => {
            return (
              <div key={option.key}>
                <input
                  type="radio"
                  id={option.value}
                  {...field}
                  {...rest}
                  value={option.value}
                  checked={field.value === option.value}
                />
                <label htmlFor={option.value}>{option.key}</label>
              </div>
            )
          })
        }}
      </Field>
      <ErrorMessage name={name} /> */}
    </div>
  )
}

export default RadioButtons