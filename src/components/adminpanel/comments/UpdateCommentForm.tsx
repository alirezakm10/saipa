'use client'
import { LoadingButton } from "@mui/lab";
import { TextField, Box } from "@mui/material";
import { useFormik } from "formik";
import { useUpdateCommentMutation } from "@/redux/services/comments/commentsApi";
import { useEffect } from "react";
import useToast from "@/hooks/useToast";


interface Props {
    comment:any;
}

const UpdateCommentForm:React.FC<Props> = ({ comment }) => {
  const showToast = useToast()

  const formik = useFormik({
    initialValues: {
      body:comment?.body
    },
    validationSchema: false, // Add your validation schema here
    onSubmit: (values) => {
     addComment({id:comment.id,patch: values})
    },
  });

  const [
    addComment,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateCommentMutation<any>();



  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  
    return (
      <Box
      sx={{display:'flex', flexDirection:'column', gap:1, p:1,  width:'90vw'}}
        autoComplete="off"
        component='form' onSubmit={formik.handleSubmit} >
        <TextField
          name='body'
          label='دیدگاه'
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          minRows={4}
          multiline
          fullWidth
        />
        <LoadingButton
          size="small"
          loading={updateLoader}
          loadingPosition="center"
          variant="contained"
          type="submit"
        >
          بروزرسانی
        </LoadingButton>
      </Box>
    );
  };

  export default UpdateCommentForm