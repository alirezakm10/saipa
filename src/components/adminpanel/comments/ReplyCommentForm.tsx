'use client'
import { LoadingButton } from "@mui/lab";
import { TextField, Box } from "@mui/material";
import { useFormik } from "formik";
import { useAddCommentMutation } from "@/redux/services/comments/commentsApi";
import { useEffect } from "react";
import useToast from "@/hooks/useToast";


interface Props {
    comment:any;
}

const ReplyCommentForm:React.FC<Props> = ({ comment }) => {
  const showToast = useToast()

  const formik = useFormik({
    initialValues: {
      body:'',
      parent_id:comment.id
    },
    validationSchema: false, // Add your validation schema here
    onSubmit: (values) => {
     addComment(values)
    },
  });

  const [
    addComment,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddCommentMutation<any>();



  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);

  
    return (
      <Box
      sx={{display:'flex', flexDirection:'column', gap:1, p:1, width:'90vw'}}
        autoComplete="off"
        component='form' onSubmit={formik.handleSubmit} >
        <TextField
          name='body'
          label='پاسخ'
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          minRows={4}
          multiline
          fullWidth
        />

        <LoadingButton
          size="small"
          loading={addLoader}
          loadingPosition="center"
          variant="contained"
          type="submit"
        >
          پاسخ
        </LoadingButton>
      </Box>
    );
  };

  export default ReplyCommentForm