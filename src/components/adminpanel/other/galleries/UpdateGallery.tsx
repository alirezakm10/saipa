"use client";
import { useEffect } from "react";
import {
  useGetGalleryQuery,
  useUpdateGalleryMutation,
} from "@/redux/services/other/galleriesApi";
import {
  TextField,
  Typography,
  Grid,
  InputLabel,
  Box,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import useToast from "@/hooks/useToast";
import { Form, Formik, useFormik } from "formik";
import { tokens } from "@/theme";
import Dropzone from "@/components/shared/uploader/Dropzone";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeywordsBox } from "../../sharedAdminModules"
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice"
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Props {
  id: string;
}

const UpdateGallery: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords);

  const { data: fetchedGallery, isSuccess, isLoading } = useGetGalleryQuery(id,{
    refetchOnMountOrArgChange: true
  });
  const [
    updateGallery,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateGalleryMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
      router.push('/adminpanel/other/galleries')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess){ 
      console.log('this is fetched gallery data: ', fetchedGallery)
    }
  }, [isSuccess]);

  let content;

  if (isSuccess) {
    content = (
      <>
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
              id: fetchedGallery?.id,
              title: fetchedGallery?.title,
              description: fetchedGallery?.description,
              meta_title: fetchedGallery?.seo?.meta_title,
              meta_description: fetchedGallery?.seo?.meta_description,
              slug: fetchedGallery?.seo?.slug,
              images: pickedFiles,
            }}
            // enableReinitialize={true}
            onSubmit={async (values) => {
              updateGallery({ id, patch: {...values,images:pickedFiles.length>0 ? pickedFiles : fetchedGallery?.images,keywords:selectedKeys} });
            }}
          >
            {({ handleChange, values }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    mb: 1,
                    borderBottom: "1px solid primary[300]",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    بروزرسانی گالری
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>نام گالری</InputLabel>
                    <TextField
                      name="title"
                      value={values?.title}
                      type="text"
                      onChange={handleChange}
                      fullWidth
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>نام متا</InputLabel>
                    <TextField
                      name="meta_title"
                      value={values?.meta_title}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>توضیحات متا</InputLabel>
                    <TextField
                      name="meta_description"
                      value={values.meta_description}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                      minRows={6}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>توضیحات گالری</InputLabel>
                    <TextField
                      name="description"
                      value={values?.description}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <InputLabel sx={{ my: 1 }}>انتخاب کلمات کلیدی</InputLabel>
                    <KeywordsBox keywords={fetchedGallery?.seo?.keywords} />
                  </Grid>

                  <Grid xs={12} item >
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن فایل شاخص
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} />
                </Grid>

                  <Grid xs={12} item>
                    {fetchedGallery?.images?.length > 0 && (
                      <Typography component="h1" variant="h4">
                        عکس ها پیشین
                      </Typography>
                    )}
                    <Grid container justifyContent="center">
                      {fetchedGallery?.images?.map(
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

export default UpdateGallery;
