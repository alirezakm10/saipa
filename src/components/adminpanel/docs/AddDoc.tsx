"use client";
import { useState, useEffect, useRef } from "react";

import { useAddDocMutation } from "@/redux/services/documents/docsApi";
import {
  TextField,
  Typography,
  Grid,
  InputLabel,
  Paper,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PostStatus } from "@/redux/features/contents/contentsSlice";
import CategoryBox from "./docsModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setDoc, selectedDoc } from "@/redux/features/doc/docSlice";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import { tokens } from "@/theme";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import Dropzone from "@/components/shared/uploader/Dropzone";
import { useRouter } from "next/navigation";
import DynamicAttachPreview from "../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile'


const AddDoc: React.FC = () => {
  const router = useRouter()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState<DateObject>(new DateObject());
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)




  const [
    addDoc,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddDocMutation<any>();
  const doc = useAppSelector(selectedDoc);

  const handleSave = () => {
    addDoc({
      patch: {
        title: doc?.title,
        classification_id: doc?.category_id,
        file: pickedFiles,
      },
    });
  };

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
      router.push('/adminpanel/docs')
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
          mb: 1,
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          ثبت سند
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
        <Grid container spacing={2} my={2} component="form" autoComplete="off">
          <Grid item xs={12} md={12}>
            <Typography component="h1" variant="h5">
              {`نام دسته : ${doc?.category_name
                  ? doc?.category_name
                  : "هنوز دسته ای انتخاب نکرده اید"
                }`}
            </Typography>
            <InputLabel sx={{ my: 1 }}>نام سند</InputLabel>
            <TextField
              value={doc?.title} // Use the title state as the value
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setDoc({ ...doc, title: e.currentTarget.value }))
              }
              fullWidth
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


          <Grid xs={12} md={4} item>
            <CategoryBox />
          </Grid>
        </Grid>

        <LoadingButton
          size="small"
          disabled={addLoader}
          loading={addLoader}
          loadingPosition="center"
          // startIcon={<SaveIcon />}
          variant="contained"
          sx={{ my: 2 }}
          onClick={handleSave}
        >
          ثبت
        </LoadingButton>
      </Paper>
    </>
  );
};

export default AddDoc;
