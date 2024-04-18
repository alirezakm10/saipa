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
  useTheme
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
  useAddFaqsMutation
} from "@/redux/services/faqApi";
import {
  setContent,
  selectedContent
} from "@/redux/features/contents/contentsSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { addFaqSchema } from "./addFaqSchema";
import { useRouter } from 'next/navigation'

const AddFaq = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [deletionArray, setDeletionArray] = useState<number[]>([])
  const showToast = useToast();
  const router = useRouter()
  // first we send title in an async action to api to create parent faq and api give us an id and we have access to that id from awaited variable
  // then we put the id inside second rtk method addFaq which api can add single or multiple faq and send down id as url params and formik faqs state as request body
  const [
    addFaqs,
    {
      isSuccess: addFaqsStatus,
      isLoading: addFaqsLoader,
      data: addFaqsResult,
      error: addFaqsErrorMsg,
      isError: addFaqsErrorBoolean
    },
  ] = useAddFaqsMutation<any>()

  //  single or multiple add faq api mutation
  const [
    addFaq,
    {
      isSuccess: addFaqStatus,
      isLoading: addFaqLoader,
      data: addFaqResult,
      error: addFaqErrorMsg,
      isError: addFaqErrorBoolean
    }
  ] = useAddFaqMutation<any>();

  // error controling for async add parent faq
  useEffect(() => {
    if (addFaqsErrorMsg) {
      const errMsg = addFaqsErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [addFaqsErrorMsg])

  // final toast alerts
  useEffect(() => {
    const waitForAlert = () => setTimeout(() => {
      router.push('/adminpanel/faq/faq-list')

    }, 2000);
    if (addFaqStatus) {
      showToast(addFaqResult?.message, "success");
      waitForAlert()
    }

    if (addFaqErrorMsg) {
      const errMsg = addFaqErrorMsg.data.message;
      showToast(errMsg, "error");
    }

    return () => {
      clearTimeout(waitForAlert())
    }

  }, [addFaqStatus, addFaqResult, addFaqErrorMsg])




  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          my: 2,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          افزودن سوال و پاسخ
        </Typography>
      </Box>
      <Formik
        initialValues={{
          title: '',
          faqs: [{
            id: 1,
            answer: '',
            question: ''
          }],
          isModified: false
        }}
        validationSchema={addFaqSchema}
        // enableReinitialize={true}
        onSubmit={async (values) => {
          const createdFaqParent: any = await addFaqs({ title: values.title })
          addFaq({ id: createdFaqParent.data.data.id, patch: values.faqs })
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors, handleBlur, touched, handleChange }) => (<form
          onSubmit={handleSubmit}
        >
          {values.isModified &&
            <Box sx={{ position: 'sticky', top: '5px', zIndex: 1, my: 2, display: 'flex', gap: 1 }} >
              <LoadingButton
                color='success'
                disabled={addFaqsLoader}
                loading={addFaqsLoader}
                loadingPosition="center"
                // startIcon={<SaveIcon />}
                variant="contained"
                type='submit'
              >
                ذخیره
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={() => setFieldValue('faqs', [])}
              >
                ریست
              </Button>
            </Box>
          }


          <Box>
            <InputLabel sx={{ my: 1 }}>نام لیست</InputLabel>
            <TextField
              id='title'
              name='title'
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && errors.title ? true : false}
              fullWidth
            />
          </Box>
          <Button
            variant='outlined'
            color='primary'
            sx={{ mt: 2 }}
            endIcon={<AddCircleOutlineIcon />}
            onClick={() => setFieldValue('faqs', [...values.faqs, { id: values.faqs.length + 1, answer: '', question: '' }])}
          >
            افزودن فیلد
          </Button>
          {values.faqs?.map((faq: any, idx: number) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', gap: 1, my: 2,
                transition: '.3s',
                borderRadius: '10px', p: 2,
                border: `1px solid ${colors.primary[300]}`,
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
              onClick={() => setDeletionArray([...deletionArray, faq.id])}
            >
              <Stack direction='row' justifyContent='space-between' >
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setFieldValue('faqs', [...values.faqs.filter(value => value.id !== faq.id)])
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Stack>
              <Box>
                <InputLabel sx={{ my: 1 }}>سوال</InputLabel>
                <TextField
                  id={faq.id}
                  name={`faqs[${idx}].question`}
                  value={faq.question}
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('isModified', true)
                  }}
                  fullWidth
                />
              </Box>
              <Box>
                <InputLabel sx={{ my: 1 }}>پاسخ</InputLabel>
                <TextField
                  id={faq.id}
                  name={`faqs[${idx}].answer`}
                  value={faq.answer}
                  onChange={(e) => {
                    handleChange(e)
                    setFieldValue('isModified', true)
                  }}
                  fullWidth
                  multiline
                />
              </Box>
            </Box>
          ))}
        </form>)}
      </Formik>
    </>
  );
};

export default AddFaq;
