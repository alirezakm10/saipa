"use client";
import { useState, useEffect } from "react";
import {
  useGetNewQuery,
  useUpdateNewMutation,
} from "@/redux/services/news/newsApi";
import {
  TextField,
  Typography,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  InputLabel,
  FormControlLabel,
  FormLabel,
  Paper,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@/components/shared/editor/tinymc/Editor";
import CategoryBox from "../newsModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setNews,
  selectedNews
} from "@/redux/features/news/newsSlice";
import useToast from "@/hooks/useToast";
import { Calendar, DateObject } from "react-multi-date-picker";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { motion, AnimatePresence } from "framer-motion";
import { btnVariants } from "../../shop/classification/animationVariants";
import { tokens } from "@/theme";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { KeywordsBox } from "../../sharedAdminModules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { selectedEditorContent, setEditorContent } from "@/redux/features/editorSlice";
import { newsSchema } from "../newsSchema";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';


interface Props {
  id: string;
}

const UpdateNews: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState<DateObject>(new DateObject());
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords)
  const editorContent = useAppSelector(selectedEditorContent)


  const { data: fetchedNew, isSuccess, isLoading } = useGetNewQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [
    updateNew,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateNewMutation<any>();
  const news = useAppSelector(selectedNews);



  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      router.push('/adminpanel/news')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setEditorContent(fetchedNew?.body))
      dispatch(setNews(fetchedNew));
    }
  }, [isSuccess]);



  useEffect(() => {
    if (isSuccess) {
      console.log('fetched news: ', fetchedNew)
    }
  }, [fetchedNew])




  useEffect(() => {
    return () => {
      dispatch(setEditorContent(''))
    }
  }, [])

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
            ویرایش خبر
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
              title: fetchedNew?.title,
              status: fetchedNew?.status,
              short_description: fetchedNew?.short_description,
              meta_title: fetchedNew?.seo.meta_title,
              meta_description: fetchedNew?.seo.meta_description,
            }}
            enableReinitialize={true}
            validationSchema={newsSchema}
            onSubmit={async (values) => {

              updateNew({
                id,
                patch: {
                  ...values,
                  classification_id: news?.category_id ? news?.category_id : fetchedNew?.category_id,
                  body: editorContent,
                  keywords: selectedKeys, images: pickedFiles.length > 0 ? pickedFiles : fetchedNew?.photos, publish_time: new DateObject(date)
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
                        color: !news?.category_id && !fetchedNew?.category_id ? 'red' : ''
                      }}
                    >دسته انتخاب شده: {news?.category_name ? news?.category_name : fetchedNew?.category_name}</Typography>
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
                  <Grid item xs={12} md={12}>
                    <Typography component="h1" variant="h5">
                      {`نام دسته : ${news?.category_name
                        ? news?.category_name
                        : "هنوز دسته ای انتخاب نکرده اید"
                        }`}
                    </Typography>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InputLabel sx={{ my: 1 }}>نام پست</InputLabel>
                    <TextField
                      name="title"
                      value={values?.title} // Use the title state as the value
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
                  <Grid item xs={12} md={4}>
                    <InputLabel sx={{ my: 1 }}>نام متا</InputLabel>
                    <TextField
                      name="meta_title"
                      value={values?.meta_title} // Use the title state as the value
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
                  <Grid item xs={12} md={4}>
                    <InputLabel sx={{ my: 1 }}>توضیحات متا</InputLabel>
                    <TextField
                      name="meta_description"
                      value={values?.meta_description} // Use the title state as the value
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
                  <Grid item xs={12} md={4}>
                    <InputLabel sx={{ my: 1 }}>خلاصه نوشته</InputLabel>
                    <TextField
                      name="short_description"
                      value={values?.short_description} // Use the title state as the value
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

                  <Grid xs={12} item>
                    {fetchedNew?.photos?.length > 0 && (
                      <Typography component="h1" variant="h4">
                        عکس ها پیشین
                      </Typography>
                    )}
                    <Grid container justifyContent="center">
                      {fetchedNew?.photos?.map(
                        (image: any, index: number) => (
                          <Grid
                            item
                            key={index}
                            sx={{
                              m: 2,
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: `0px 0px 10px ${colors.themeAccent[500]}`,
                              width: "200px",
                              height: "200px",
                              borderRadius: "10px",
                              ":hover": {
                                boxShadow: `3px 0 20px ${colors.blue[500]}`,
                              },
                            }}
                          >
                            <Image
                              src={image.download_link}
                              alt={image.name}
                              loading="lazy"
                              style={{
                                filter: `dropShadow(5px 4px 10px)`,
                                objectFit: "cover",
                                objectPosition: "center center",
                              }}
                              draggable={false}
                              width={200}
                              height={200}
                            />
                          </Grid>
                        )
                      )}
                    </Grid>

                    <Grid item xs={12} >
                    <LoadingButton
                      size="small"
                      disabled={updateLoader}
                      loading={updateLoader}
                      loadingPosition="center"
                      // startIcon={<SaveIcon />}
                      variant="contained"
                      type="submit"
                      sx={{ my: 2 }}
                    >
                      بروزرسانی
                    </LoadingButton>
                  </Grid>
                  </Grid>


                </Grid>
              </Form>
            )}
          </Formik>





        </Paper>

        {/* end of form grid */}

        {/*  start of form grid */}

        <Grid container spacing={2} sx={{ position: "relative" }}>
          <Grid xs={12} md={9} item>
            <Editor fetchedContent={fetchedNew} />
          </Grid>
          <Grid xs={12} md={3} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <CategoryBox selectedId={news?.category_id} />
              </Grid>
              <Grid xs={12} item>
                <KeywordsBox keywords={fetchedNew?.seo?.keywords} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/*  end of form grid */}
      </>
    );
  }

  return content;
};

export default UpdateNews;
