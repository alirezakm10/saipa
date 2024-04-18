import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGetRolesQuery } from "@/redux/services/roles/roleApi";
import { OptionType } from "./typescope";
import { useReferTicketMutation } from "@/redux/services/tickets/ticketApi";
import useToast from "@/hooks/useToast";
import usePermission from "@/hooks/usePermission";

interface Props {
  size?: "small" | "medium";
  width?: string;
  error?: any;
  label?: string;
  defaultValue?: OptionType | null | undefined;
  name?: string;
  errorFormik?: boolean;
  helperText?: string | boolean;
  hasPermission?: boolean;
  handleAutocompleteChange?: (event: any, newValue: any) => void;
}

const AutocompleteRoleInput: React.FC<Props> = ({
  size,
  width,
  defaultValue,
  error,
  label,
  name = "",
  errorFormik,
  helperText,
  hasPermission = true,
  handleAutocompleteChange,
}) => {
  const showToast = useToast();
  const [value, setValue] = useState<OptionType | null | undefined>(
    defaultValue || null
  );
  const {
    data: rolesList,
    isSuccess: rolesSuccess,
    isLoading: rolesLoading,
    isError: rolesErrorStatus,
    error: rolesError,
  } = useGetRolesQuery("", {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error) {
      setValue(defaultValue);
    }
  }, [error]);

  useEffect(() => {
    if (rolesError) {
      const error: any = rolesError;
      showToast(error.data?.message, "error");
    }
  }, [rolesLoading, rolesSuccess, rolesError]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (event: any, newValue: any) => {
    if (handleAutocompleteChange) {
      handleAutocompleteChange(event, newValue);
    }
    setValue(newValue);
  };

  return (
    <Autocomplete
      value={value}
      size={size}
      onChange={handleChange}
      loading={rolesLoading}
      disabled={!hasPermission}
      id="role"
      options={rolesList?.length > 0 ? rolesList : []}
      sx={{ width: width }}
      getOptionLabel={(option: OptionType) => option.name || ""}
      noOptionsText={"نتیجه ای یافت نشد."}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          name={name}
          {...params}
          label={label || ""}
          error={errorFormik || false}
          helperText={helperText || ""}
        />
      )}
    />
  );
};

export default AutocompleteRoleInput;
