"use client";
import { useEffect, useState } from "react";
import { useAddDiscountMutation } from "@/redux/services/shop/discountApi";
import {
  TextField,
  Typography,
  Grid,
  Box,
  useTheme,
  Paper,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { tokens } from "@/theme";

const AddDiscount: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();
  const [date, setDate] = useState<DateObject>(new DateObject())



  const [
    addDiscount,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddDiscountMutation<any>();

  const formik = useFormik({
    initialValues: {
      type: 1,
      status:1,
      amount: '',
      code: '',
      minimum_purchase_amount: '',
      expiration_date: ''
    },
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values, { setFieldValue }) => {
      setFieldValue('expiration_date',
        new DateObject(date).convert(english, english_en)
          .format()
      )
      addDiscount(values);
    },
  });

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
      router.push('/adminpanel/shop/discount')
    }
    if (error) {
      const errMsg = error.data.message;
      showToast(errMsg, "error");
    }
    if (addResult?.product?.id) {
      router.push(`/adminpanel/shop/discount`)
    }
  }, [addStatus, addResult, error]);

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
          افزودن گارانتی
        </Typography>
      </Box>
      <Paper
        sx={{
          px: 1,
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          mb: 1,
        }}
      >
        <Grid
          container
          spacing={1}
          my={2}
          component="form"
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
         <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel >{`نوع تخفیف ${formik.values.type === 1 ? '(مبلغ)': '(درصد)'}‍`}</InputLabel>
              <Select
                value={formik.values.type}
                name='type'
                label={`نوع تخفیف ${formik.values.type === 1 ? '(مبلغ)': '(درصد)'}‍`}
                onChange={formik.handleChange}
              >
                <MenuItem value={1}>برحسب مبلغ</MenuItem>
                <MenuItem value={2}>برحسب درصد</MenuItem>
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
            <InputLabel >{formik.values.status === 1 ? 'فعال ':' غیر فعال '}‍</InputLabel>
              <Select
                value={formik.values.status}
                name='status'
                label={formik.values.status === 1 ? ' فعال': ' غیرفعال'}
                onChange={formik.handleChange}
              >
                <MenuItem value={0}>غیر فعال</MenuItem>
                <MenuItem value={1}>فعال</MenuItem>
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={12} md={4}>
            <TextField
              label={formik.values.type === 1 ? 'مبلغ':'درصد'}
              id="amount"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="کد تخفیف"
              id="code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              multiline
              fullWidth
            />
          </Grid>


          <Grid item xs={12} md={4}>
            <TextField
              label="حداقل موجودی"
              id="minimum_purchase_amount"
              name="minimum_purchase_amount"
              value={formik.values.minimum_purchase_amount}
              onChange={formik.handleChange}
              placeholder="حداقل موجودی کاربر برای استفاده از کد تخفیف"
              multiline
              fullWidth
            />
          </Grid>


          <Grid xs={12} md={12} item>
            <InputLabel sx={{ my: 1 }} >تاریخ انقضا</InputLabel>
            <Calendar
              format="YYYY/MM/DD HH:mm:ss"
              value={date}
              onChange={(date: DateObject) => {
                setDate(date)
              }}
              calendar={persian}
              locale={persian_fa}
              plugins={[
                <TimePicker
                  key="timePicker"
                  position="bottom"
                  hStep={2}
                  mStep={3}
                  sStep={4}
                />
              ]}
            />
          </Grid>


          <Grid sx={{ px: 1 }} xs={12}>
            <LoadingButton
              size="small"
              disabled={addLoader}
              loading={addLoader}
              loadingPosition="center"
              // startIcon={<SaveIcon />}
              variant="contained"
              sx={{ my: 2 }}
              type="submit"
            >
              ثبت
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>

    </>
  );
};

export default AddDiscount;
