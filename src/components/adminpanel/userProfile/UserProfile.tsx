"use client";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "@/theme";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import DatePicker, { DateObject } from "react-multi-date-picker";
import React, { useEffect, useRef, useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePhotoMutation,
} from "@/redux/services/profile/profileApi";
import { useFormik } from "formik";
import { CreateUser } from "../users/typescope";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { redirect, useRouter } from "next/navigation";
import useToast from "@/hooks/useToast";
import { updateValidationSchema } from "../users/validationSchema";
import ImageCropper from "../../shared/ImageCropper";
import { Area } from "react-easy-crop";
import UserAvatar from "./UserAvatar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ImageDialog from "../../shared/ImageDialog";

const UserProfile: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [imageFile, setImageFile] = React.useState<any>(null);
  const [imageSrc, setImageSrc] = React.useState<any>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const fileInput = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const formik = useFormik<CreateUser>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      f_name: "",
      family: "",
      father_name: "",
      birthdate: "",
      phone: "",
      mobile: "",
      national_code: "",
    },
    validationSchema: updateValidationSchema,
    onSubmit: (values: any) => {
      const date = new DateObject({
        date: values.birthdate,
        format: "YYYY/MM/DD",
        calendar: persian,
        locale: persian_fa,
      });

      updateProfile({
        ...values,
        birthdate: values.birthdate
          ? new DateObject(date).convert(gregorian, gregorian_en).format()
          : "",
      });
    },
  });

  const {
    data: fetchedProfile,
    isSuccess,
    isLoading,
    error: fetchUserError,
  } = useGetProfileQuery("");

  useEffect(() => {
    if (fetchedProfile) {
      formik.setValues({
        ...formik.values,
        name: fetchedProfile.name || "",
        email: fetchedProfile.email || "",
        f_name: fetchedProfile.name || "",
        family: fetchedProfile.profile?.family || "",
        father_name: fetchedProfile.profile?.father_name || "",
        birthdate: fetchedProfile.profile?.birthdate
          ? new DateObject(fetchedProfile.profile?.birthdate)
              ?.convert(persian, persian_fa)
              .format()
          : "",
        phone: fetchedProfile.profile?.phone || "",
        mobile: fetchedProfile.mobile || "",
        national_code: fetchedProfile.profile?.national_code || "",
      });
    }
  }, [fetchedProfile, isLoading]);

  const [
    updateProfile,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateProfileMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      redirect("/adminpanel");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateLoader]);

  const handleDate = (date: DateObject) => {
    formik.setFieldValue("birthdate", date);
  };

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

  const [
    updateProfileImage,
    {
      isSuccess: updateProfileImageStatus,
      isLoading: updateProfileImageLoading,
      data: updateProfileImageResult,
      error: updateProfileImageError,
    },
  ] = useUpdateProfilePhotoMutation<any>();

  useEffect(() => {
    if (updateProfileImageStatus) {
      showToast(updateProfileImageResult?.message, "success");
      setOpen(false);
    }
    if (updateProfileImageError) {
      const errMsg = updateProfileImageError?.data?.message ?? updateProfileImageError.error;
      showToast(errMsg, "error");
    }
  }, [updateProfileImageStatus, updateProfileImageLoading]);

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
        updateProfileImage(formData);
      }, "image/jpeg");
    }
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
      <Paper
        sx={{
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          mt: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <input
            ref={fileInput}
            type="file"
            onChange={onFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Box my={2} sx={{ position: "relative" }} onClick={handleFileSelect}>
            <UserAvatar width="100px" height="100px" />
            <AddAPhotoIcon
              sx={{
                width: "30px",
                height: "30px",
                padding: "3px",
                borderRadius: "50%",
                position: "absolute",
                top: "70px",
                background: `${colors.primary[900]}`,
                border: `1px solid ${colors.primary[300]}`,
              }}
            />
          </Box>
        </Box>
        <CardContent>
          <form
            style={{
              width: "100%",
            }}
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="نام"
                  name="name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="نام خانوادگی"
                  name="family"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.family}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ایمیل"
                  name="email"
                  autoComplete="username"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="0912xxxxxxx"
                  name="mobile"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="پسورد"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <div
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </div>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="تایید پسورد"
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <div
                          aria-label="toggle confirm_password visibility"
                          onClick={handleClickShowPassword}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </div>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password_confirmation &&
                    Boolean(formik.errors.password_confirmation)
                  }
                  helperText={
                    formik.touched.password_confirmation &&
                    formik.errors.password_confirmation
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="کد ملی"
                  name="national_code"
                  type="text"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.national_code}
                  error={
                    formik.touched.national_code &&
                    Boolean(formik.errors.national_code)
                  }
                  helperText={
                    formik.touched.national_code && formik.errors.national_code
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  // value={}
                  onChange={(date: DateObject) => handleDate(date)}
                  render={(value, openCalendar, onChange) => {
                    return (
                      <TextField
                        onClick={openCalendar}
                        onChange={onChange}
                        onFocus={openCalendar}
                        type="search"
                        value={value || formik.values.birthdate || ""}
                        name="birthdate"
                        label="تاریخ تولد"
                        placeholder="YYYY/MM/DD"
                        variant="outlined"
                        autoComplete="off"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <EditIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ my: 1, width: "100%" }}
                      />
                    );
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{
                    width: "100%",
                  }}
                  calendarPosition="bottom-right"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="شماره تلفن"
                  name="phone"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="نام پدر"
                  name="father_name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EditIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ my: 1, width: "100%" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.father_name}
                />
              </Grid>
            </Grid>
            <LoadingButton
              size="small"
              disabled={updateLoader}
              loading={updateLoader}
              loadingPosition="center"
              type="submit"
              variant="contained"
              sx={{ my: 2, mx: 1 }}
            >
              ثبت
            </LoadingButton>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => router.push("/adminpanel")}
            >
              انصراف
            </Button>
          </form>
        </CardContent>
      </Paper>
    );
  }

  return (
    <>
      <Typography
        variant="h4"
        sx={{ pb: 1, borderBottom: `1px solid ${colors.primary[300]}` }}
      >
        اطلاعات پروفایل
      </Typography>
      {content}

      <ImageDialog
        open={open}
        setOpen={setOpen}
        onConfirm={uploadImage}
        isLoading={updateProfileImageLoading}
      >
        <ImageCropper
          imageSrc={imageSrc}
          setCroppedAreaPixels={setCroppedAreaPixels}
          aspect={1}
        />
      </ImageDialog>
    </>
  );
};

export default UserProfile;
