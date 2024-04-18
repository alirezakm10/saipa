"use client";
import useToast from "@/hooks/useToast";
import { tokens } from "@/theme";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import RoleForm from "./RoleForm";
import { Role } from "./typescope";
import {
  useAddRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "@/redux/services/roles/roleApi";
import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";

const UpdateRole = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { id } = useParams();
  const {
    data: fetchedRole,
    isSuccess: fetchedRoleSuccessStatus,
    isLoading: fetchedRoleLoadingStatus,
    error: fetchRoleError,
  } = useGetRoleQuery(id);

  const [updateRole, { isLoading, isSuccess, data, error }] =
    useUpdateRoleMutation<any>();

  useEffect(() => {
    if (isSuccess) {
      showToast(data?.message, "success");
      redirect("/adminpanel/roles");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [isLoading]);

  const handleSubmitForm = (values: any) => {
    updateRole({ id, body: values });
  };

  let content;
  if (fetchedRoleLoadingStatus) {
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

  if (fetchRoleError) {
    const error:any = fetchRoleError;
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

  if (fetchedRoleSuccessStatus) {
    content = (
      <RoleForm
        isLoading={isLoading}
        formValues={fetchedRole}
        handleSubmit={(values: Role) => handleSubmitForm(values)}
      />
    );
  }
  
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
          ویرایش نقش
        </Typography>
      </Box>
      {content}
    </>
  );
};

export default UpdateRole;
