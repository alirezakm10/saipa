"use client";
import React, { useEffect } from "react";
import { useAddUserMutation } from "@/redux/services/users/usersApi";
import useToast from "@/hooks/useToast";
import { validationSchema } from "../validationSchema";
import { CreateUser } from "../typescope";
import { redirect } from "next/navigation";
import UserForm from "../userForm/UserForm";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "@/theme";

const AddUser: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();

  const [addUser, { isLoading, isSuccess, data, error }] =
    useAddUserMutation<any>();

  useEffect(() => {
    if (isSuccess) {
      showToast(data?.message, "success");
      redirect("/adminpanel/users");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [isLoading]);

  const handleSubmitForm = (values: any) => {
    addUser({
      ...values,
      is_admin: values.is_admin ? 1 : 0,
      f_name: values.name,
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          افزودن کاربر
        </Typography>
      </Box>
      <UserForm
        isLoading={isLoading}
        validationSchema={validationSchema}
        onSubmit={(values: CreateUser) => handleSubmitForm(values)}
      />
    </>
  );
};

export default AddUser;
