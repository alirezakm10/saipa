"use client";
import { useState, useEffect, useRef } from "react";
import {
  useAddContentMutation,
} from "@/redux/services/contents/contentApi";
import {
  TextField,
  Typography,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@/components/shared/editor/tinymc/Editor";
import CategoryBox from "./postModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { Calendar, DateObject } from "react-multi-date-picker";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { motion, AnimatePresence } from "framer-motion";
import { btnVariants } from "../shop/classification/animationVariants";
import { tokens } from "@/theme";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice"
import { KeywordsBox } from "../sharedAdminModules";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { Formik, Form } from "formik";
import { selectedEditorContent, setEditorContent } from "@/redux/features/editorSlice";
import { postSchema } from "./postSchema";
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DynamicAttachPreview from "../filemanager/DynamicAttachPreview"


const AddPost: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const dispatch = useAppDispatch()
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords)
  const editorContent = useAppSelector(selectedEditorContent)


  const [
    addContent,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddContentMutation<any>()

  const post = useAppSelector(selectedContent);

  const [date, setDate] = useState<DateObject>(new DateObject())

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);



  useEffect(() => {
    dispatch(setContent({}))

    return () => {
      dispatch(setEditorContent(''))
    }
  }, []);


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
          افزودن نوشته
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
        <Formik
          initialValues={{
            title: '',
            status: '',
            short_description: '',
            meta_title: '',
            meta_description: '',
            slug: '',
          }}
          validationSchema={postSchema}
          onSubmit={async (values) => {
            addContent({
              patch: {
                ...values,
                classification_id: post?.category_id,
                body: editorContent,
                keywords: selectedKeys, images: pickedFiles, publish_time: new DateObject(date)
                  .convert(english, english_en)
                  .format()
              }
            })
          }}
        >
          {({ handleChange, values, touched, getFieldProps, errors, handleBlur, setFieldValue }) => (
            <Form>
              <Grid
                container
                spacing={2}
                my={2}
              >

                <Grid item xs={12} >
                  <Typography
                    component="h1"
                    variant='body1'
                    sx={{
                      color: !post?.category_id ? 'red' : ''
                    }}
                  >دسته انتخاب شده: {post?.category_name}</Typography>
                </Grid>


                <Grid item xs={12} md={12} >
                  <FormControl
                    sx={{
                      border: touched.status &&
                        errors.status ? 'red 1px solid' : '',
                      borderRadius: '10px',
                      p: 1
                    }}
                  >
                    <FormLabel>حالت انتشار</FormLabel>
                    <RadioGroup
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label='پیش نویس'
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label='منتشر شده'
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label='انتشار بر حسب زمان'
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>


                <Grid xs={12} md={12} item>
                  <AnimatePresence>
                    {values.status === '2' && (
                      <motion.div
                        initial={btnVariants.initial}
                        exit={btnVariants.hidden}
                        variants={btnVariants}
                        animate={values.status === '2' ? "visible" : "hidden"}
                      >
                        <Calendar
                          format="YYYY/MM/DD HH:mm:ss"
                          value={
                            new DateObject()
                              .convert(english, english_en)
                              .format("YYYY/MM/DD HH:mm:ss")
                          }
                          onChange={(date: DateObject) => setDate(date)
                          }
                          calendar={persian}
                          locale={persian_fa}
                          plugins={[
                            <TimePicker
                              key="timePicker"
                              position="bottom"
                              hStep={2}
                              mStep={3}
                              sStep={4}
                            />,
                          ]}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Grid>


                <Grid item xs={12} sm={4}>
                  <TextField
                    label="نام پست"
                    name="title"
                    value={values.title} // Use the title state as the value
                    onChange={handleChange}
                    error={
                      touched.title &&
                        errors.title
                        ? true
                        : false
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="نام متا"
                    name='meta_title'
                    value={values.meta_title} // Use the title state as the value
                    onChange={handleChange}
                    error={
                      touched.meta_title &&
                        errors.meta_title
                        ? true
                        : false
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="توضیحات متا"
                    name="meta_description"
                    value={values.meta_description} // Use the title state as the value
                    onChange={handleChange}
                    error={
                      touched.meta_description &&
                        errors.meta_description
                        ? true
                        : false
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="خلاصه نوشته"
                    name="short_description"
                    value={values.short_description} // Use the title state as the value
                    onChange={handleChange}
                    fullWidth
                    error={
                      touched.short_description &&
                        errors.short_description
                        ? true
                        : false
                    }
                    multiline
                  />
                </Grid>

              

                <Grid xs={12} item >
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن عکس شاخص
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} />
                </Grid>

                <Grid item xs={12} >
                  <LoadingButton
                    size="small"
                    disabled={addLoader}
                    color="success"
                    loading={addLoader}
                    loadingPosition="center"
                    // startIcon={<SaveIcon />}
                    type="submit"
                    variant="contained"
                    sx={{ my: 2 }}
                  >
                    ثبت نوشته
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>)}
        </Formik>

      </Paper>

      {/* end of form grid */}

      {/*  start of form grid */}

      <Grid container spacing={2} sx={{ position: "relative" }}>
        <Grid xs={12} md={9} item>
          <Editor />
        </Grid>
        <Grid xs={12} md={3} item>
          <Grid container spacing={2}>
            <Grid xs={12} item>
              <CategoryBox />
            </Grid>
            <Grid xs={12} item>
              <KeywordsBox />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/*  end of form grid */}
    </>
  );
};

export default AddPost;
