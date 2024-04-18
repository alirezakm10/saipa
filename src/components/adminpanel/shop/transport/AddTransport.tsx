"use client";
import { useState, useEffect, useRef } from "react";
import { useAddTransportMutation } from "@/redux/services/shop/transportApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PostStatus } from "@/redux/features/contents/contentsSlice";
import Editor from "@/components/shared/editor/tinymc/Editor";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";



const AddTransport: React.FC = () => {
  const showToast = useToast()
  const router = useRouter()



  const [
    addGuarantee,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddTransportMutation<any>()


  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      cost: '',
      minimum_delivery_days: '',
    },
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values) => {
      addGuarantee(values);
    },
  });

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
      router.push(`/adminpanel/shop/transport`)
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);



 
 return (
      <>
        <Typography variant="h3" component="h1">
        افزودن نوع ارسال
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} my={2} component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid item xs={12} md={4}>
            <TextField
              label='نام نوع ارسال'
              id="tilte"
              name="title"
              value={formik.values.title} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>


          <Grid item xs={12} md={4}>
            <TextField
              label='قیمت ارسال'
              id="cost"
              name="cost"
              value={formik.values.cost} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label='مدت زمان (روز)'
              id="minimum_delivery_days"
              name="minimum_delivery_days"
              value={formik.values.minimum_delivery_days} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label='توضیحات'
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
              disabled={addLoader}
              loading={addLoader}
              loadingPosition="center"
              // startIcon={<SaveIcon />}
              variant="contained"
              sx={{ my: 2 }}
              type="submit"
            >
              افزودن
            </LoadingButton>
          </Grid>
        </Grid>
      </>
    )
}

export default AddTransport;
