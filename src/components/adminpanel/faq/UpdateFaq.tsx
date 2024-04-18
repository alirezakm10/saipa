"use client";
import { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Divider,
  InputLabel,
  Stack,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "@/theme";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useToast from "@/hooks/useToast";
import { useFormik, Formik, Field, Form, FormikValues } from "formik";
import {
  useGetFaqQuery,
  useUpdateFaqsMutation,
  useDeleteFaqMutation,
  useAddFaqMutation,
} from "@/redux/services/faqApi";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface Props {
  id: string;
}

const UpdateFaq: React.FC<Props> = ({ id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // this state use for single update of modified faqs in formik onSubmit
  const [uniqueUpdateId, setUniqueUpdateId] = useState<number>(0);
  const [deletionArray, setDeletionArray] = useState<number[]>([]);

  const showToast = useToast();
  const dispatch = useAppDispatch();
  const {
    data: fetchedfaqs,
    isSuccess,
    isLoading,
    isFetching,
  } = useGetFaqQuery(id);
  const [
    updateFaqs,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateFaqsMutation<any>();

  const [
    addFaq,
    {
      isSuccess: addSuccess,
      isLoading: addLoader,
      data: addResult,
      isError: addErrorBoolean,
      error: addErrorMsg,
    },
  ] = useAddFaqMutation<any>();

  const [
    deleteFaq,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteFaqMutation<any>();
  const deleteHandler = (id: number): void => {
    deleteFaq(id);
  };

  useEffect(() => {
    if (addSuccess) {
      showToast(addResult?.message, "success");
    }
    if (addErrorMsg) {
      const errMsg = addErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [addSuccess, addResult, addErrorMsg]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography component="h1" variant="h4">
            ویرایش سوالات و پاسخ ها
          </Typography>
        </Box>

        <Formik
          initialValues={{
            parent_id: 0,
            faqs: fetchedfaqs?.map((faq: any) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              isModified: false,
              isNew: false,
            })),
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const catchSelectedObj: FormikValues = await values.faqs.filter(
              (value: any) => value.id === uniqueUpdateId
            );
            if (catchSelectedObj[0].isNew === true) {
              addFaq({
                id: id,
                patch: [
                  {
                    answer: catchSelectedObj[0].answer,
                    question: catchSelectedObj[0].question,
                  },
                ],
              });
            } else {
              updateFaqs({
                id: catchSelectedObj[0].id,
                patch: {
                  answer: catchSelectedObj[0].answer,
                  question: catchSelectedObj[0].question,
                },
              });
            }
          }}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                endIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  setFieldValue("faqs", [
                    ...values.faqs,
                    {
                      id: fetchedfaqs[0]?.classification_id,
                      answer: "",
                      question: "",
                      isModified: false,
                      isNew: true,
                    },
                  ])
                }
              >
                افزودن فیلد
              </Button>

              {values.faqs?.map((faq: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    my: 2,
                    transition: ".3s",
                    borderRadius: "10px",
                    p: 2,
                    border: `1px solid ${colors.primary[300]}`,
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  onClick={() => setDeletionArray([...deletionArray, faq.id])}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <ConfirmModal
                      modalTitle={faq.title}
                      description="آیا از حذف مطمئن هستید؟"
                      color="error"
                      icon={<DeleteIcon />}
                      btnTitle="حذف"
                      setter={() => deleteHandler(faq.id)}
                      ctaLoader={deleteLoader}
                    />
                    {faq.isModified && (
                      <LoadingButton
                        size="small"
                        color="success"
                        disabled={updateLoader}
                        loading={updateLoader}
                        loadingPosition="center"
                        // startIcon={<SaveIcon />}
                        variant="contained"
                        type="submit"
                        onClick={() => setUniqueUpdateId(faq.id)}
                      >
                        {faq.isNew === true ? "ثبت" : "بروزرسانی"}
                      </LoadingButton>
                    )}
                  </Stack>
                  <Box>
                    <InputLabel sx={{ my: 1 }}>سوال</InputLabel>
                    <TextField
                      id={idx.toString()}
                      name={`question[${idx}]`}
                      value={faq.question}
                      onChange={(e) => {
                        if (e.target.value !== faq.question) {
                          setFieldValue(`faqs[${idx}].isModified`, true);
                        }
                        setFieldValue(`faqs[${idx}].question`, e.target.value);
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box>
                    <InputLabel sx={{ my: 1 }}>پاسخ</InputLabel>
                    <TextField
                      id={idx.toString()}
                      name={`answer[${idx}]`}
                      value={faq.answer}
                      onChange={(e) => {
                        if (e.target.value !== faq.question) {
                          setFieldValue(`faqs[${idx}].isModified`, true);
                        }
                        setFieldValue(`faqs[${idx}].answer`, e.target.value);
                      }}
                      fullWidth
                      multiline
                    />
                  </Box>
                </Box>
              ))}
            </form>
          )}
        </Formik>
      </>
    );
  }

  return content;
};

export default UpdateFaq;
