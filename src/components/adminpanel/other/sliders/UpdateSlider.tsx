"use client";
import { useState, useEffect, useRef } from "react";
import {
  useGetSliderQuery,
  useUpdateSliderMutation,
} from "@/redux/services/other/slidersApi";
import {
  TextField,
  Typography,
  Grid,
  InputLabel,
  Box,
  useTheme,
  Paper,
  Button
} from "@mui/material";
import { LoadingButton, Masonry } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useToast from "@/hooks/useToast";
import { Form, Formik } from "formik";
import { tokens } from "@/theme";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeywordsBox } from "../../sharedAdminModules";
interface Props {
  id: string;
}
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';


const UpdateSlider: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const dispatch = useAppDispatch()
  const pickedFiles = useAppSelector(selectPickedForMainAttach)


  const { data: fetchedSlider, isSuccess, isLoading } = useGetSliderQuery(id);
  const [
    updateSldier,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateSliderMutation<any>();

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
      router.push('/adminpanel/other/sliders')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

useEffect(() => {
  if(isSuccess){
    console.log('this is fetchedSldiuer: ', fetchedSlider )
  }
},[fetchedSlider, isSuccess])

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
              type: fetchedSlider?.type,
              title: fetchedSlider?.title,
              description: fetchedSlider?.description,
              status: fetchedSlider?.status,
              items: pickedFiles.length > 0 ? pickedFiles : fetchedSlider?.items,
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              updateSldier({ id, patch: values });
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
                    بروزرسانی اسلایدر
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>نام اسلایدر</InputLabel>
                    <TextField
                      name="title"
                      value={values?.title}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel sx={{ my: 1 }}>توضیحات اسلایدر</InputLabel>
                    <TextField
                      name="description"
                      value={values?.description}
                      type="text"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} item >
                    <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                      افزودن عکس شاخص
                    </Button>
                  </Grid>
                  <Grid xs={12} item >
                    <DynamicAttachPreview fileType={['image']} metaEditorIdentifier="slider" />
                  </Grid>

                  <Grid xs={12} item>
                    {fetchedSlider?.items.length > 0 && (
                      <Typography component="h1" variant="h4">
                        عکس ها پیشین
                      </Typography>
                    )}
                    <Grid container justifyContent="center">
                      {fetchedSlider?.items?.map(
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
                              border: image.file.is_default === 1 ? '5px solid green' : '',
                              ":hover": {
                                boxShadow: `3px 0 20px ${colors.blue[500]}`,
                              },
                            }}
                          >
                            <Image
                              src={image.file.download_link}
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

export default UpdateSlider;
