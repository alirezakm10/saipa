"use client";
import { useState, useEffect, useRef } from "react";
import { useGetDiscountQuery, useUpdateDiscountMutation } from "@/redux/services/shop/discountApi";
import {
  TextField,
  Typography,
  Grid,
  InputLabel,
  Box,
  useTheme,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { tokens } from "@/theme";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const UpdateDiscount: React.FC<Props> = ({ id }) => {
  const theme = useTheme()
  const router = useRouter()
  const colors = tokens(theme.palette.mode)
  const showToast = useToast()
  const dispatch = useAppDispatch()
  const [date, setDate] = useState<DateObject>(new DateObject())
  const {
    data: fetchedDiscount,
    isSuccess,
    isLoading,
  } = useGetDiscountQuery(id)
  const [
    updateDiscount,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateDiscountMutation<any>()
  const guarantee = useAppSelector(selectedContent)

  const formik = useFormik({
    initialValues: {
      type: fetchedDiscount?.type,
      status:fetchedDiscount?.status,
      amount: fetchedDiscount?.amount,
      code: fetchedDiscount?.code,
      minimum_purchase_amount: fetchedDiscount?.minimum_purchase_amount,
      expiration_date:new DateObject(date)
      .convert(english, english_en)
      .format()
    },
    enableReinitialize:true,
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values) => {
      updateDiscount({ id, patch: { ...values } })
    },
  })

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
      router.push('/adminpanel/shop/discount')
    }
    if (error) {
      const errMsg = error.data.message
      showToast(errMsg, "error")
    }
  }, [updateStatus, updateResult, error])

  useEffect(() => {
    if (isSuccess) dispatch(setContent(fetchedDiscount))
  }, [isSuccess])

  let content;

  if (isSuccess) {
    content = (
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
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            ویرایش کد تخفیف
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
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} sm={4}>
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


          <Grid item xs={12} sm={4}>
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


          <Grid xs={12} sm={12} item>
            <InputLabel sx={{ my: 1 }} >تاریخ انقضا</InputLabel>
            <Calendar
              format="YYYY/MM/DD HH:mm:ss"
              value={date}
              onChange={(date: DateObject) => setDate(date)}
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
            <Grid sx={{px:1}} xs={12}>
              <LoadingButton
                size="small"
                disabled={updateLoader}
                loading={updateLoader}
                loadingPosition="center"
                // startIcon={<SaveIcon />}
                variant="contained"
                sx={{ my: 2 }}
                type="submit"
              >
                بروزرسانی
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }

  return content;
};

export default UpdateDiscount;
