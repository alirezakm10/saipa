"use client";
import { useState, useEffect, useRef } from "react";
import { useGetCommentQuery, useUpdateCommentMutation, useAddCommentMutation } from "@/redux/services/comments/commentsApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";



const AddComment: React.FC = () => {
  const showToast = useToast()
  const router = useRouter()



  const [
    addComment,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddCommentMutation<any>()


  const formik = useFormik({
    initialValues: {
      name: '',
      duration: '',
      description: '',
    },
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values) => {
      addComment(values);
    },
  });

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
    if(addResult?.product?.id){
      router.push(`/adminpanel/shop/guarantee/updateguarantee${addResult?.product?.id}`)
    }
  }, [addStatus, addResult, error]);



 
 return (
      <>
        <Typography variant="h4" component="h1">
        افزودن گارانتی
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} my={2} component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid item xs={12} md={4}>
            <TextField
              label='نام گارانتی'
              id="name"
              name="name"
              value={formik.values.name} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label='مدت زمان (روز)'
              id="duration"
              name="duration"
              value={formik.values.duration} // Use the title state as the value
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

export default AddComment;
