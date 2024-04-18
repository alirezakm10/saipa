"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputLabel,
  Paper,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useGetSiteSmsSettingsQuery,
  useUpdateSiteSmsSettingsMutation,
} from "@/redux/services/settings/siteSettingsApi";
import { tokens } from "@/theme";
import useToast from "@/hooks/useToast";
import TestSmsConfigs from "./tester/TestSmsConfigs";
import usePermission from "@/hooks/usePermission";

const SiteSmsSettings = () => {
  const showToast = useToast();
  const {
    data: siteSmsSettings,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSiteSmsSettingsQuery("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (isSuccess) {
      console.log("Shop settings: ", siteSmsSettings);
    }
  }, [siteSmsSettings]);

  const [
    updateSiteSmsSettings,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error: updateErrorMsg,
      isError: updateErrorBoolean,
    },
  ] = useUpdateSiteSmsSettingsMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (updateErrorMsg) {
      const errMsg = updateErrorMsg.data.message ?? updateErrorMsg.error ;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  return (
    <>
      <Paper
        sx={{
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          p: 1,
        }}
      >
        <Formik
          initialValues={{
            driver: siteSmsSettings?.driver,
            token: siteSmsSettings?.token,
            sender: siteSmsSettings?.sender,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            console.log("Values of shop settings to submit: ", values);
            updateSiteSmsSettings(values);
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pb: 1,
                  mb: 1,
                  borderBottom: "1px solid primary[300]",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  تنظیمات پیام رسان
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputLabel sx={{my:1}} >وب سرویس پیامک</InputLabel>
                  <FormControl fullWidth>
                  {isLoading ?  <Skeleton variant="rectangular"
                      sx={{
                        width:'100%' ,
                        height:'55px',
                        borderRadius:'4px',
                      }}
                      />:  
                      <Select
                      defaultValue={siteSmsSettings?.driver}
                      value={values?.driver}
                      name="driver"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>کاوه نگار</MenuItem>
                    </Select>}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }}>شماره</InputLabel>
                  <TextField
                    name="sender"
                    value={values.sender}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <Box
                    sx={{
                      position: "sticky",
                      top: "5px",
                      zIndex: 1,
                      my: 2,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {hasPermission("Setting.edit") && (
                      <LoadingButton
                        color="success"
                        disabled={updateLoader}
                        loading={updateLoader}
                        loadingPosition="center"
                        variant="contained"
                        type="submit"
                      >
                        ذخیره
                      </LoadingButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      <Paper
        sx={{
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          mt : 1,
          p: 1,
        }}
      >
        <TestSmsConfigs />
      </Paper>
    </>
  );
};

export default SiteSmsSettings;
