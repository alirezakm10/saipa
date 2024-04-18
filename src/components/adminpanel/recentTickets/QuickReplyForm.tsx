"use client";
import { LoadingButton } from "@mui/lab";
import { TextField, Box } from "@mui/material";
import { useFormik } from "formik";
import { useAddCommentMutation } from "@/redux/services/comments/commentsApi";
import React, { useEffect } from "react";
import useToast from "@/hooks/useToast";
import { useResponseToTicketMutation } from "@/redux/services/tickets/ticketApi";

interface Props {
  id: number;
}

const QuickReplyForm: React.FC<Props> = ({id}) => {
  const showToast = useToast();
  
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: false, // Add your validation schema here
    onSubmit: (values) => {
      sendMessage({id , body : values});
    },
  });
  const [
    sendMessage,
    {
      isSuccess: sendMessageSuccess,
      isLoading: sendMessageLoading,
      data: sendMessageResult,
      error: sendMessageErrorStatus,
    },
  ] = useResponseToTicketMutation();

  React.useEffect(() => {
    if (sendMessageSuccess) {
      const successMsg = sendMessageResult?.message;
      showToast(successMsg, "success");
      formik.setFieldValue("content", "");
    }
    if (sendMessageErrorStatus) {
      const error: any = sendMessageErrorStatus;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [sendMessageErrorStatus, sendMessageSuccess]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        width: "250px",
      }}
      autoComplete="off"
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <TextField
        name="content"
        label="پاسخ"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        minRows={4}
        multiline
        fullWidth
      />

      <LoadingButton
        size="small"
        loading={sendMessageLoading}
        loadingPosition="center"
        variant="contained"
        type="submit"
      >
        پاسخ
      </LoadingButton>
    </Box>
  );
};

export default QuickReplyForm;
