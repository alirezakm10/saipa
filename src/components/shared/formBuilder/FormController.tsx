import React, { ReactNode } from "react";
import Input, { InputProps } from "./elements/Input";
import TextArea from "./elements/TextArea";
import Select from "./elements/Select";
import RadioButtons from "./elements/RadioButton";
import CheckBoxes from "./elements/CheckBoxes";

export interface InputOption {
  key: string;
  value: boolean;
}
export interface FormikProps {
  control?:
    | "input"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "muiDateInput";
  type: string;
  label: string;
  name: string;
  icon?: ReactNode;
  options?: InputOption[];
  field?: any;
  rest?: any;
}

const FormikController: React.FC<FormikProps> = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "select":
      return <Select {...rest} />;
    case "radio":
      return <RadioButtons {...rest} />;
    case "checkbox":
      return <CheckBoxes {...rest} />;
    default:
      return null;
  }
};
export default FormikController;
