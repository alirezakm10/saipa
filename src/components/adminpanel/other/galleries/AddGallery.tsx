"use client";
import { useEffect } from "react";
import { useAddGalleryMutation } from "@/redux/services/other/galleriesApi";
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
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import useToast from "@/hooks/useToast";
import { Form, Formik, useFormik } from "formik";
import { tokens } from "@/theme";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { useRouter } from "next/navigation";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice"
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Image from "next/image";
import { KeywordsBox } from "../../sharedAdminModules";
interface Props {
  id: string;
}

const AddGallery: React.FC = () => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords)

  
  const [
    addGallery,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useAddGalleryMutation<any>()



  useEffect(() => {
    if (addStatus) {
      showToast(updateResult?.message, "success")
       router.push('/adminpanel/other/galleries')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, updateResult, error]);



  return (
    <>
    <Paper
      sx={{
        position:'relative',
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
        p: 1
      }}
    >
      <Formik
        initialValues={{
          title: '',
          description: '',
          meta_title: '',
          meta_description: '',
          slug: ''
        }}
        // enableReinitialize={true}
        onSubmit={async(values,{setFieldValue}) => {
           addGallery({...values,images:pickedFiles,keywords:selectedKeys})
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
                افزودن گالری
              </Typography>
            </Box>
            <Grid container spacing={2} >


              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>نام گالری</InputLabel>
                <TextField
                  name='title'
                  value={values?.title}
                  type='text'
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} >
                <InputLabel sx={{ my: 1 }}>پیوند یکتا</InputLabel>
                <TextField
                  name='slug'
                  value={values?.slug}
                  type='text'
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>نام متا</InputLabel>
                <TextField
                  name='meta_title'
                  value={values?.meta_title}
                  type='text'
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>توضیحات متا</InputLabel>
                <TextField
                  name='meta_description'
                  value={values?.meta_description}
                  type='text'
                  onChange={handleChange}
                  fullWidth
                  minRows={6}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ my: 1 }}>توضیحات گالری</InputLabel>
                <TextField
                  name='description'
                  value={values?.description}
                  type='text'
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>


              <Grid xs={12} item >
                <InputLabel sx={{ my: 1 }}>انتخاب کلمات کلیدی</InputLabel>
                <KeywordsBox />
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
                <Box sx={{ position: 'sticky', top: '5px', zIndex: 1, my: 2, display: 'flex', gap: 1 }}>
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

export default AddGallery;
