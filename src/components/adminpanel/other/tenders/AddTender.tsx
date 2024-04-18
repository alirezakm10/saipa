"use client";
import { useEffect } from "react";
import { useAddTenderMutation } from "@/redux/services/other/tenders/tendersApi";
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
import { tokens } from "@/theme";
import Image from "next/image";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useRouter } from "next/navigation";


const AddTender: React.FC = () => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)

  const dispatch = useAppDispatch();

  const [
    addTender,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddTenderMutation<any>()

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
    if (addStatus) {
      showToast(addResult?.message, "success")
      router.push('/adminpanel/other/tenders')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);


  return (
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
          افزودن
        </Typography>
      </Box>
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
            title: '',
            short_description: '',
            body: '',
            is_active: 0,
            type: 1,
            slug: ''
          }}
          onSubmit={async (values, { setFieldValue }) => {
            // Separate images and attachments
            const imageFiles = pickedFiles.filter((file: any) => isImageFile(file));
            const attachmentFiles = pickedFiles.filter((file: any) => isDocumentFile(file));

            // Set form values for images and attachments
            // setFieldValue('images', imageFiles);
            // setFieldValue('attachments', attachmentFiles);

            // Call the API
            addTender({ patch: {...values,imageFiles:imageFiles, attachmentFiles:attachmentFiles} });
          }}
        >
          {({ handleChange, values }) => (
            <Form>
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
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }} >وضعیت نمایش</InputLabel>
                  <Select
                    value={values.is_active}
                    name='is_active'
                    label={values.is_active}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={0}>غیر فعال</MenuItem>
                    <MenuItem value={1}>فعال</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }} >انتخاب نوع</InputLabel>
                  <Select
                    value={values.type}
                    name='type'
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
                <Grid item xs={12} >
                  <InputLabel sx={{ my: 1 }}> توضیحات کوتاه</InputLabel>
                  <TextField
                    name='short_description'
                    value={values.short_description}
                    type='text'
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }}>توضیحات</InputLabel>
                  <TextField
                    name='body'
                    value={values?.body}
                    type='text'
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }}>پیوند یکتا</InputLabel>
                  <TextField
                    name='slug'
                    value={values.slug}
                    type='text'
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
                  <DynamicAttachPreview fileType={['image']} />
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
    </>
  );
};

export default AddTender;
