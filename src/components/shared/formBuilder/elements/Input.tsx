"use client";
import React, { ReactNode } from "react";
import { useField } from "formik";
import {
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export interface InputProps {
  name: string;
  label: string;
  icon?: ReactNode;
  type: string;
  rest?: any;
}

const Input: React.FC<InputProps> = ({ name, label, icon, type, ...rest }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const hasError = meta.touched && meta.error;

  return (
    <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
        <OutlinedInput
          fullWidth
          type={showPassword ? "password" : 'text'}
          endAdornment={
            <InputAdornment position="end">
              {type === "password" ? (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ) : (
                <>{icon}</>
              )}
            </InputAdornment>
          }
          {...field}
          {...rest}
          label={label}
          error={!!hasError}
        />
  {hasError && 
  <Typography component='p' variant="subtitle2" color='error' mt='2px' >{meta.error}</Typography>
  }
    </FormControl>
  );
};
export default Input;
