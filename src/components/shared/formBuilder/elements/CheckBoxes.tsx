'use client'
import React, { HTMLProps, useEffect } from "react";
import { Field, ErrorMessage, FieldProps, FormikProps } from "formik";
import { InputOption } from "../FormController";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useField } from "formik";


interface CheckBoxesProps {
  label: string;
  name: string;
  options?: InputOption[];
}

const Checkboxes: React.FC<CheckBoxesProps> = (props) => {
  const { label, name, options, ...rest } = props;
  const [field, meta] = useField(name);



  return (
 <>
      <Field name={name}>
        {(formik: FieldProps["form"]) => {
          const { field }: any = formik;
          return options?.map((option,idx) => {
            return (
              <FormGroup key={idx}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      {...rest}
                      id={option.key}
                      value={option.value}
                    />
                  }
                  label={label}
                />
              </FormGroup>
            );
          });
        }}
      </Field>
      <ErrorMessage name={name} />
      </>
  );
};

export default Checkboxes;
