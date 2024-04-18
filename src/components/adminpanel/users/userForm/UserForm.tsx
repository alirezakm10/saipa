import React, { useEffect } from "react";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  useTheme,
} from "@mui/material";
import { tokens } from "@/theme";
import { useFormik } from "formik";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import { CreateUser } from "../typescope";
import { useRouter } from "next/navigation";
interface Props {
  isLoading: boolean;
  formValues?: any;
  validationSchema: any;
  editMode?: boolean;
  onSubmit: (values: CreateUser) => void;
}

const UserForm: React.FC<Props> = ({
  isLoading,
  formValues,
  validationSchema,
  editMode = false,
  onSubmit,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleDate = (date: DateObject) => {
    formik.setFieldValue("birthdate", date);
  };

  const formik = useFormik<CreateUser>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: false,
      f_name: "",
      family: "",
      father_name: "",
      birthdate: "",
      phone: "",
      mobile: "",
      national_code: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const date = new DateObject({
        date: values.birthdate,
        format: "YYYY/MM/DD",
        calendar: persian,
        locale: persian_fa,
      });
      onSubmit({
        ...values,
        birthdate: values.birthdate
          ? new DateObject(date).convert(gregorian, gregorian_en).format()
          : "",
      });
    },
  });

  useEffect(() => {

    if (formValues) {
      formik.setValues({
        ...formik.values,
        name: formValues.name || "",
        email: formValues.email || "",
        is_admin: formValues.is_admin == 1 ? true : false,
        f_name: formValues.name || "",
        family: formValues.profile?.family || "",
        father_name: formValues.profile?.father_name || "",
        birthdate: formValues.profile?.birthdate
          ? new DateObject(formValues.profile?.birthdate)
              ?.convert(persian, persian_fa)
              .format()
          : "",
        phone: formValues.profile?.phone || "",
        mobile: formValues.mobile || "",
        national_code: formValues.profile?.national_code || "",
      });
    }
  }, [formValues]);

  return (
    <Paper
      sx={{
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
      }}
    >
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
                      {editMode ? <EditIcon /> : <AccountCircleIcon />}
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
                      {editMode ? <EditIcon /> : <AccountCircleIcon />}
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
                id="email"
                autoComplete="username"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editMode ? <EditIcon /> : <EmailIcon />}
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
                label="موبایل"
                placeholder=" 0912xxxxxxx "
                name="mobile"
                autoComplete="username"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editMode ? <EditIcon /> : <PhoneAndroidIcon />}
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
                sx={{ my: 1, width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editMode ? <EditIcon /> : null}
                    </InputAdornment>
                  ),
                }}
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
                //  value={date}
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
                            {editMode ? <EditIcon /> : <CalendarMonthIcon />}
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
                placeholder="021XXXXXXX"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editMode ? <EditIcon /> : <PhoneIcon />}
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
                sx={{ my: 1, width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {editMode ? <EditIcon /> : null}
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.father_name}
              />
            </Grid>
            {!formValues || formValues?.is_admin !== 1 ? (
              <Grid item xs={12}>
                <FormGroup
                  style={{
                    paddingRight: "30px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    style={{
                      direction: "ltr",
                      justifyContent: "flex-end",
                    }}
                    control={
                      <Switch
                        color="success"
                        name="is_admin"
                        checked={formik.values?.is_admin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    }
                    label="ادمین"
                  />
                </FormGroup>
              </Grid>
            ) : null}
          </Grid>

          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={
              editMode
                ? () => router.back()
                : () => router.push("/adminpanel")
            }
          >
            انصراف
          </Button>

          <LoadingButton
            size="small"
            disabled={isLoading}
            loading={isLoading}
            loadingPosition="center"
            type="submit"
            variant="contained"
            sx={{ my: 2, mx: 1 }}
          >
            ثبت
          </LoadingButton>
        </form>
      </CardContent>
    </Paper>
  );
};

export default UserForm;
