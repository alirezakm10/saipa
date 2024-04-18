"use client";
import { useState, useEffect, useRef } from "react";
import {
  useGetTenderQuery,
  useUpdateTenderMutation,
} from "@/redux/services/other/tenders/tendersApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
  InputLabel,
  Box,
  useTheme,
  Paper,
  FormControl,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { Form, Formik, useFormik } from "formik";
import { tokens } from "@/theme"
import Image from "next/image"
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useRouter } from "next/navigation";


interface Props {
  id: string;
}

const UpdateTender: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const showToast = useToast()
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const dispatch = useAppDispatch()
  const { data: fetchedTender, isSuccess, isLoading } = useGetTenderQuery(id);
  const [
    updateTender,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateTenderMutation<any>();

  const isImageFile = (file: any) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.path.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  const isDocumentFile = (file: any) => {
    const documentExtensions = ['pdf', 'docx', 'xlsx'];
    const extension = file.path.split('.').pop()?.toLowerCase();
    return documentExtensions.includes(extension);
  };

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
      router.push('/adminpanel/other/tenders')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess) dispatch(setContent(fetchedTender));
    console.log('tenders: ', fetchedTender)
  }, [isSuccess]);

  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            بروزرسانی
          </Typography>
        </Box>
        <Paper
          sx={{
            position: "relative",
            border: `1px solid ${colors.primary[300]}`,
            borderRadius: "5px",
            p: 1,
          }}
        >
          <Formik
            initialValues={{
              title: fetchedTender?.title,
              short_description: fetchedTender?.short_description,
              body: fetchedTender?.body,
              is_active: fetchedTender?.is_active,
              type: fetchedTender?.type,
              slug: fetchedTender?.slug,
              images: pickedFiles,
              attachments: pickedFiles,
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              const imageFiles = values.images.filter((file: any) => isImageFile(file));
              const attachmentFiles = values.attachments.filter((file: any) => isDocumentFile(file));
          
              // Prepare data for API
              const requestData = {
                id,
                patch: {
                  ...values,
                  images: imageFiles,
                  attachments: attachmentFiles,
                },
              };
          
              // Call the API
              updateTender(requestData);
              // updateTender({ id, patch: values });
            }}
          >
            {({ handleChange, values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>نام</InputLabel>
                    <TextField
                      name="title"
                      value={values?.title}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>وضعیت نمایش</InputLabel>
                    <Select
                      value={values.is_active}
                      name="is_active"
                      label={values.is_active}
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value={0}>غیر فعال</MenuItem>
                      <MenuItem value={1}>فعال</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>انتخاب نوع</InputLabel>
                    <Select
                      value={values.type}
                      name="type"
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value={1}>مزایده</MenuItem>
                      <MenuItem value={2}>مناقصه</MenuItem>
                      <MenuItem value={3}>رویداد</MenuItem>
                      <MenuItem value={4}>اطلاعیه</MenuItem>
                      <MenuItem value={5}>تقویم</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}> توضیحات کوتاه</InputLabel>
                    <TextField
                      name="short_description"
                      value={values.short_description}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>توضیحات</InputLabel>
                    <TextField
                      name="body"
                      value={values?.body}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>پیوند یکتا</InputLabel>
                    <TextField
                      name="slug"
                      value={values.slug}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                      minRows={6}
                    />
                  </Grid>
              
                  <Grid xs={12} item >
                    <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                      افزودن عکس یا سند
                    </Button>
                  </Grid>
                  <Grid xs={12} item >
                    <DynamicAttachPreview fileType={['image','document']} />
                  </Grid>

                  <Grid xs={12} item>
                    {fetchedTender?.images?.length > 0 && (
                      <Typography component="h1" variant="h4">
                        عکس ها پیشین
                      </Typography>
                    )}
                    <Grid container justifyContent="center">
                      {fetchedTender?.images?.map(
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
                  </Grid>

                  <Grid xs={12} item>
                    <Box
                      sx={{
                        position: "sticky",
                        top: "5px",
                        zIndex: 1,
                        my: 2,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <LoadingButton
                        color="success"
                        disabled={updateLoader}
                        loading={updateLoader}
                        loadingPosition="center"
                        variant="contained"
                        type="submit"
                      >
                        بروزرسانی
                      </LoadingButton>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </>
    );
  }

  return content;
};

export default UpdateTender;
