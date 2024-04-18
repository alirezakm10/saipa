"use client";
import React, { useEffect } from "react";
import { Formik, Field, Form } from "formik";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  InputLabel,
  TextareaAutosize,
  Paper,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useGetShopSettingsQuery,
  useUpdateShopSettingsMutation,
} from "@/redux/services/settings/shopSettingsApi";
import { tokens } from "@/theme";
import {
  measurementUnits,
  weightUnits,
  currencyUnits,
} from "./shopSettingsStatus";
import useToast from "@/hooks/useToast";
import {
  getWeightTitle,
  getMeasureTitle,
  getCurrencyTitle,
} from "./shopSettingsStatus";
import usePermission from "@/hooks/usePermission";

const ShopSettings = () => {
  const showToast = useToast();
  const {
    data: shopSettings,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetShopSettingsQuery("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();


  const [
    updateShopSettings,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error: updateErrorMsg,
      isError: updateErrorBoolean,
    },
  ] = useUpdateShopSettingsMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (updateErrorMsg) {
      const errMsg = updateErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

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
          description: shopSettings?.description,
          email_sender: shopSettings?.email_sender,
          sms_sender: shopSettings?.sms_sender,
          currency: String(shopSettings?.currency),
          weight_unit: String(shopSettings?.weight_unit),
          dimension_unit: String(shopSettings?.dimension_unit),
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          updateShopSettings(values)
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
                تنظیمات فروشگاه
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>ایمیل اطلاع رسانی</InputLabel>
                <TextField
                  name="email_sender"
                  value={values.email_sender}
                  type="email"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>شماره موبایل (پیامک)</InputLabel>
                <TextField
                  name="sms_sender"
                  value={values.sms_sender}
                  type="text"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>توضیخات فروشگاه</InputLabel>
                <TextField
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="توضیحات مختصر فروشگاه خود را بنویسید..."
                  type="text"
                  minRows={4}
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl>
                  <FormLabel>واحد پول</FormLabel>
                  <RadioGroup
                    name="currency"
                    value={values.currency}
                    onChange={handleChange}
                  >
                    {Object.values(currencyUnits).map((currencyUnit, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={currencyUnit}
                        control={<Radio />}
                        label={getCurrencyTitle(Number(currencyUnit))}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl>
                  <FormLabel>واحد وزن</FormLabel>
                  <RadioGroup
                    name="weight_unit"
                    value={values.weight_unit}
                    onChange={handleChange}
                  >
                    {Object.values(weightUnits).map((weightUnit, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={weightUnit}
                        control={<Radio />}
                        label={getWeightTitle(Number(weightUnit))}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl>
                  <FormLabel>واحد ابعاد</FormLabel>
                  <RadioGroup
                    name="dimension_unit"
                    value={values.dimension_unit}
                    onChange={handleChange}
                  >
                    {Object.values(measurementUnits).map((measureUnit, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={measureUnit}
                        control={<Radio />}
                        label={getMeasureTitle(Number(measureUnit))}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
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
                  {hasPermission("SettingShop.edit") && (
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
  );
};

export default ShopSettings;
