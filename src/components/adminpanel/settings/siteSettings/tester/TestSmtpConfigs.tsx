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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useGetSiteSmsSettingsQuery,
  useUpdateSiteSmsSettingsMutation,
  useTestSiteSmtpSettingsMutation,
} from "@/redux/services/settings/siteSettingsApi";
import { tokens } from "@/theme";
import useToast from "@/hooks/useToast";
import usePermission from "@/hooks/usePermission";

const TestSmtpConfigs = () => {
  const showToast = useToast();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  const [
    testSiteSmtpSettings,
    {
      isSuccess: testStatus,
      isLoading: testLoader,
      data: testResult,
      error: testErrorMsg,
      isError: testErrorBoolean,
    },
  ] = useTestSiteSmtpSettingsMutation<any>();

  useEffect(() => {
    if (testStatus) {
      showToast(testResult?.message, "success");
    }
    if (testErrorMsg) {
      const errMsg = testErrorMsg.data.message ?? testErrorMsg?.error;
      showToast(errMsg, "error");
    }
  }, [testStatus, testResult, testErrorMsg]);

  return (
    <Paper
      sx={{
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
        p: 1,
      }}
    >
      <Formik
        initialValues={{
          receiver: "",
          title: "",
          body: "",
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          console.log("Values of smtp config   : ", values);
          testSiteSmtpSettings(values);
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
                تست پیکربندی سرور ایمیل
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>دریافت کننده</InputLabel>
                <TextField
                  name="receiver"
                  value={values.receiver}
                  type="email"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>موضوع</InputLabel>
                <TextField
                  name="title"
                  value={values.title}
                  type="text"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>متن</InputLabel>
                <TextField
                  name="body"
                  value={values.body}
                  type="text"
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
                      disabled={testLoader}
                      loading={testLoader}
                      loadingPosition="center"
                      variant="contained"
                      type="submit"
                    >
                      تست
                    </LoadingButton>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default TestSmtpConfigs;
