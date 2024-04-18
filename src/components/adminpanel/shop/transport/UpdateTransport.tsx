"use client";
import { useState, useEffect, useRef } from "react";
import { useGetTransportQuery, useUpdateTransportMutation } from "@/redux/services/shop/transportApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
  InputLabel
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
interface Props {
  id: string;
}

const UpdateTransport: React.FC<Props> = ({ id }) => {
  const showToast = useToast();
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {
    data: fetchedTransport,
    isSuccess,
    isLoading,
  } = useGetTransportQuery(id);
  const [
    updateGuarantee,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateTransportMutation<any>();
  const guarantee = useAppSelector(selectedContent);

  const formik = useFormik({
    initialValues: {
      title: fetchedTransport?.title,
      description: fetchedTransport?.description,
      cost: fetchedTransport?.cost,
      minimum_delivery_days: fetchedTransport?.minimum_delivery_days,
    },
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values) => {
      updateGuarantee({ id, patch: { ...values } });
    },
  });

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess){
      dispatch(setContent(fetchedTransport))
      router.push(`/adminpanel/shop/transport`)
    } 
  }, [isSuccess]);



  let content;

  if (isSuccess) {
    content = (
      <>
        <Typography variant="h3" component="h1">
        ویرایش نوع ارسال
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} my={2} component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid item xs={12} md={4}>
            <InputLabel sx={{ my: 1 }}>نام نوع ارسال</InputLabel>
            <TextField
              label={fetchedTransport?.title}
              id="title"
              name="title"
              value={formik.values.title} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InputLabel sx={{ my: 1 }}> قیمت ارسال</InputLabel>
            <TextField
              label={fetchedTransport?.cost}
              id="cost"
              name="cost"
              value={formik.values.cost} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InputLabel sx={{ my: 1 }}>مدت زمان (روز)</InputLabel>
            <TextField
              label={fetchedTransport?.minimum_delivery_days}
              id="minimum_delivery_days"
              name="minimum_delivery_days"
              value={formik.values.minimum_delivery_days} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InputLabel sx={{ my: 1 }}>توضیحات</InputLabel>
            <TextField
              label={
                fetchedTransport?.description
                  ? fetchedTransport?.description
                  : "تعریف نشده"
              }
              id="description"
              name="description"
              value={formik.values.description} // Use the title state as the value
              onChange={formik.handleChange}
              multiline
              fullWidth
            />
          </Grid>
          <Grid xs={12}>
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
      </>
    );
  }

  return content;
};

export default UpdateTransport;
