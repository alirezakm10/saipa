"use client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputLabel,
  Paper,
  useTheme,
  Button,
  Switch,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  useGetSiteSettingsQuery,
  useUpdateLogoPhotoMutation,
  useUpdateSiteSettingsMutation,
} from "@/redux/services/settings/siteSettingsApi";
import { tokens } from "@/theme";
import useToast from "@/hooks/useToast";
import usePermission from "@/hooks/usePermission";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Area } from "react-easy-crop";
import ImageDialog from "@/components/shared/ImageDialog";
import ImageCropper from "@/components/shared/ImageCropper";
import NextImage from 'next/image';

const SiteSettings = () => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const showToast = useToast();
  const [imageFile, setImageFile] = React.useState<any>(null);
  const [imageSrc, setImageSrc] = React.useState<any>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const {
    data: siteSettings,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSiteSettingsQuery("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  const [
    updateSiteSettings,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error: updateErrorMsg,
      isError: updateErrorBoolean,
    },
  ] = useUpdateSiteSettingsMutation<any>();

  const [
    updateLogo,
    {
      isSuccess: updateLogoStatus,
      isLoading: updateLogoLoading,
      data: updateLogoResult,
      error: updateLogoError,
    },
  ] = useUpdateLogoPhotoMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (updateErrorMsg) {
      const errMsg = updateErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);





  useEffect(() => {
    if (updateLogoStatus) {
      showToast(updateLogoResult?.message, "success");
      setOpen(false);
    }
    if (updateLogoError) {
      const errMsg = updateLogoError?.data?.message ?? updateLogoError.error;
      showToast(errMsg, "error");
    }
  }, [updateLogoStatus, updateLogoLoading]);

  const handleFileSelect = () => {
    fileInput?.current?.click();
  };

  const onFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          if (typeof reader.result === "string") setImageSrc(reader.result);
        },
        false
      );
      reader.readAsDataURL(e.target.files[0]);
      setImageFile(e.target.files[0]);
    }
    e.target.value = null;
    setOpen(true);
  };

  const uploadImage = () => {
    if (!croppedAreaPixels || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc.toString();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx && croppedAreaPixels) {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const formData = new FormData();

        formData.append("file", blob, imageFile?.name);
        updateLogo(formData);
      }, "image/jpeg");
    }
  };

  console.log("siteSettings", siteSettings);


  return (
    <Paper
      sx={{
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
        p: 1,
      }}
    >
      <ImageDialog
        open={open}
        setOpen={setOpen}
        onConfirm={uploadImage}
        isLoading={updateLogoLoading}
      >
        <ImageCropper
          imageSrc={imageSrc}
          setCroppedAreaPixels={setCroppedAreaPixels}
          aspect={1}
        />
      </ImageDialog>
      <Formik
        initialValues={{
          site_name: siteSettings?.site_name,
          description: siteSettings?.description,
          default_image: siteSettings?.default_image?.id,
          default_language: siteSettings?.default_language,
          favicon: siteSettings?.favicon,
          logo: siteSettings?.logo,
          email: siteSettings?.email,
          cellphone: siteSettings?.cellphone,
          address: siteSettings?.address,
          about_us: siteSettings?.about_us,
          about_us_status: siteSettings?.about_us_status,
          slider_status: siteSettings?.slider_status,
          product_groups_status: siteSettings?.product_groups_status,
          banner_status: siteSettings?.banner_status,
          coworkers_status: siteSettings?.coworkers_status,
          news_status: siteSettings?.news_status,
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          updateSiteSettings(values);
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
                تنظیمات سایت
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>نام سایت</InputLabel>
                <TextField
                  name="site_name"
                  value={values.site_name}
                  type="text"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <input
                    ref={fileInput}
                    type="file"
                    onChange={onFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    endIcon={<AddCircleOutlineIcon />}
                    onClick={handleFileSelect}
                  >
                    افزودن لوگو
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <NextImage
                  src={siteSettings?.site_logo?.download_link}
                  alt={siteSettings?.site_logo?.alt ?? "logo"}
                  loading="lazy"
                  width={100}
                  height={100}
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>ایمیل سایت</InputLabel>
                <TextField
                  name="email"
                  value={values.email}
                  type="email"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>شماره تماس</InputLabel>
                <TextField
                  name="cellphone"
                  value={values.cellphone}
                  type="text"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>آدرس</InputLabel>
                <TextField
                  name="address"
                  value={values.address}
                  type="text"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>درباره ما</InputLabel>
                <TextField
                  name="about_us"
                  value={values.about_us}
                  onChange={handleChange}
                  placeholder="توضیحات مختصر درباره ما را بنویسید..."
                  type="text"
                  minRows={4}
                  multiline
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>توضیخات سابت</InputLabel>
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

              {/* show hide landing sections */}
              <Grid item xs={12} >
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">نمایش و عدم نمایش المان های صفحه نخست</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                        name="about_us_status"
                        checked={values.about_us_status === 1}
                        onChange={(e) => {
                          const newValue = e.target.checked ? 1 : 0;
                          handleChange({
                            target: {
                              name: 'about_us_status',
                              value: newValue,
                            },
                          });
                        }}
                        sx={{
                          '& .MuiSwitch-thumb': {
                            color: values.about_us_status === 1 ? 'green' : '' , // Adjust colors as needed
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: values.about_us_status === 1 ? 'green' : 'red', // Adjust colors as needed
                          },
                        }}
                      />
                      }
                      label="درباره ما"
                    />
                    <FormControlLabel
              control={
                <Switch
                  name="slider_status"
                  checked={values.slider_status === 1}
                  onChange={(e) => {
                    const newValue = e.target.checked ? 1 : 0;
                    handleChange({
                      target: {
                        name: 'slider_status',
                        value: newValue,
                      },
                    });
                  }}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      color: values.slider_status === 1 ? 'green' : '' , // Adjust colors as needed
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: values.slider_status === 1 ? 'green' : 'red', // Adjust colors as needed
                    },
                  }}
                />
              }
              label="نمایش اسلایدر"
            />
            <FormControlLabel
              control={
                <Switch
                  name="product_groups_status"
                  checked={values.product_groups_status === 1}
                  onChange={(e) => {
                    const newValue = e.target.checked ? 1 : 0;
                    handleChange({
                      target: {
                        name: 'product_groups_status',
                        value: newValue,
                      },
                    });
                  }}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      color: values.product_groups_status === 1 ? 'green' : '' , // Adjust colors as needed
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: values.product_groups_status === 1 ? 'green' : 'red', // Adjust colors as needed
                    },
                  }}
                />
              }
              label="نمایش گروه محصولات"
            />
            <FormControlLabel
              control={
                <Switch
                  name="banner_status"
                  checked={values.banner_status === 1}
                  onChange={(e) => {
                    const newValue = e.target.checked ? 1 : 0;
                    handleChange({
                      target: {
                        name: 'banner_status',
                        value: newValue,
                      },
                    });
                  }}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      color: values.banner_status === 1 ? 'green' : '' , // Adjust colors as needed
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: values.banner_status === 1 ? 'green' : 'red', // Adjust colors as needed
                    },
                  }}
                />
              }
              label="نمایش بنر"
            />
            <FormControlLabel
              control={
                <Switch
                  name="coworkers_status"
                  checked={values.coworkers_status === 1}
                  onChange={(e) => {
                    const newValue = e.target.checked ? 1 : 0;
                    handleChange({
                      target: {
                        name: 'coworkers_status',
                        value: newValue,
                      },
                    });
                  }}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      color: values.coworkers_status === 1 ? 'green' : '' , // Adjust colors as needed
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: values.coworkers_status === 1 ? 'green' : 'red', // Adjust colors as needed
                    },
                  }}
                />
              }
              label="نمایش همکاران"
            />
            <FormControlLabel
              control={
                <Switch
                  name="news_status"
                  checked={values.news_status === 1}
                  onChange={(e) => {
                    const newValue = e.target.checked ? 1 : 0;
                    handleChange({
                      target: {
                        name: 'news_status',
                        value: newValue,
                      },
                    });
                  }}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      color: values.news_status === 1 ? 'green' : '' , // Adjust colors as needed
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: values.news_status === 1 ? 'green' : 'red', // Adjust colors as needed
                    },
                  }}
                />
              }
              label="نمایش اخبار"
            />
                  </FormGroup>
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
  );
};

export default SiteSettings;
