"use client";
import { useEffect } from "react";
import { useAddChartMutation, useGetChartQuery } from "@/redux/services/other/organizationCharts/organizationChartsApi";
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
import { Form, Formik } from "formik";
import { tokens } from "@/theme";
import Image from "next/image"
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';



const OrganizationChart: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const dispatch = useAppDispatch();

  const {
    data: fetchedChart,
    isSuccess,
    isLoading,
  } = useGetChartQuery('');

  const [
    addChart,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddChartMutation<any>();
  const guarantee = useAppSelector(selectedContent);

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success")
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);





  let content;

  if (isSuccess) {
    content = (
      <Paper
        sx={{
          position: 'relative',
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          p: 1
        }}
      >
        <Formik
          initialValues={{
            title: fetchedChart?.title,
            file: '',
          }}
          onSubmit={async (values, { setFieldValue }) => {
            setFieldValue('file', pickedFiles[0].id)
            addChart(values)
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 1,
                  mb: 1,
                  borderBottom: '1px solid primary[300]',
                }}
              >
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                  چارت سازمانی
                </Typography>
              </Box>
              <Grid container spacing={2} >
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }}>نام</InputLabel>
                  <TextField
                    name='title'
                    value={values?.title}
                    type='text'
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} item >
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن عکس چارت
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} />
                </Grid>

                <Grid xs={12} item >
                  {fetchedChart?.file &&
                    <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                  }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "auto",
                          width: "340px",
                          height: "340px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={fetchedChart?.file?.download_link}
                          alt={fetchedChart?.file?.alt}
                          loading="lazy"
                          fill
                          style={{
                            filter: `dropShadow(5px 4px 10px)`,
                            objectFit: "cover",
                            objectPosition: 'center center'
                          }}
                          draggable={false}
                        />
                      </Box>
                    </Box>
                  }
                </Grid>
                <Grid xs={12} item>
                  <Box sx={{ position: 'sticky', top: '5px', zIndex: 1, my: 2, display: 'flex', gap: 1 }}>
                    <LoadingButton
                      color="success"
                      disabled={addLoader}
                      loading={addLoader}
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
    )
  }

  return content
};

export default OrganizationChart;
