"use client";
import { useState, useEffect, useRef } from "react";
import { useAddSliderMutation } from "@/redux/services/other/slidersApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
  InputLabel,
  Box,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { Form, Formik } from "formik";
import { tokens } from "@/theme"
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { useRouter } from "next/navigation";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';


interface Props {
  id: string;
}

const AddSlider: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)

  const [
    addSlider,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddSliderMutation<any>();
  const guarantee = useAppSelector(selectedContent);

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success")
      router.push('/adminpanel/other/sliders')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);

  return (
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
            type: id,
            title: "",
            description: "",
            status: "0",
          }}
          onSubmit={async (values, { setFieldValue }) => {
            addSlider({...values,items:pickedFiles});
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
                    افزودن فایل شاخص
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} metaEditorIdentifier="slider" />
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
                      disabled={addLoader}
                      loading={addLoader}
                      loadingPosition="center"
                      variant="contained"
                      type="submit"
                    >
                      ذخیره
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
};

export default AddSlider;
