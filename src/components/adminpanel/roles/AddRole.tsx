"use client";
import useToast from "@/hooks/useToast";
import { tokens } from "@/theme";
import { Box, Typography, useTheme } from "@mui/material";
import RoleForm from "./RoleForm";
import { Role } from "./typescope";
import { useAddRoleMutation } from "@/redux/services/roles/roleApi";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const AddRole = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const [addRole, { isLoading, isSuccess, data, error }] =
    useAddRoleMutation<any>();

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
  const handleSubmitForm = (values: Role) => {
    addRole(values);
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
          افزودن نقش
        </Typography>
      </Box>
      <RoleForm
        isLoading={isLoading}
        handleSubmit={(values: Role) => handleSubmitForm(values)}
      />
    </>
  );
};

export default AddRole;
