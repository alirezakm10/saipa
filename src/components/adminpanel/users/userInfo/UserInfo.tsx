"use client";
import React, { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";

import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/services/users/usersApi";
import useToast from "@/hooks/useToast";
import { updateValidationSchema, validationSchema } from "../validationSchema";
import { CreateUser } from "../typescope";
import { redirect, useParams } from "next/navigation";
import UserForm from "../userForm/UserForm";

const UserInfo: React.FC = () => {
  const showToast = useToast();
  const { id } = useParams();

  const {
    data: fetchedUser,
    isSuccess,
    isLoading,
    error: fetchUserError,
  } = useGetUserQuery(id);

  const [
    updateUser,
    {
      isSuccess: updateStatus,
      isLoading: updateLoading,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateUserMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      redirect("/adminpanel/users");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg , "error");
    }
  }, [updateStatus, updateLoading]);

  const handleSubmitForm = (values: any) => {
    updateUser({
      id,
      body: {
        ...values,
        is_admin: values.is_admin ? 1 : 0,
        f_name: values.name,
      },
    });
  };
  

  let content;

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="100vh"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (fetchUserError) {
    const error : any = fetchUserError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
       {error?.data?.message ?? error.error}
      </Box>
    );
  }

  if (isSuccess) {
    content = (
      <UserForm
        isLoading={updateLoading}
        validationSchema={updateValidationSchema}
        formValues={fetchedUser}
        editMode={true}
        onSubmit={(values: CreateUser) => handleSubmitForm(values)}
      />
    );
  }

  return content;
};

export default UserInfo;
