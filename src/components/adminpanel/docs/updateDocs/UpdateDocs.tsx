"use client";
import { useState, useEffect, useRef } from "react";

import { useGetDocQuery, useUpdateDocMutation } from "@/redux/services/documents/docsApi";
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
import CategoryBox from "../docsModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setDoc, selectedDoc } from "@/redux/features/doc/docSlice";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import { tokens } from "@/theme";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import Dropzone from "@/components/shared/uploader/Dropzone";
import Image from "next/image";
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';


interface Props {
  id: string;
}

const UpdateDocs: React.FC<Props> = ({ id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState<DateObject>(new DateObject());
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)


  const { data: fetchedDoc, isSuccess, isLoading } = useGetDocQuery(id);
  const [
    updateDoc,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateDocMutation<any>();
  const doc = useAppSelector(selectedDoc);

  const handleSave = () => {
    updateDoc({
      id,
      patch: {
        title: doc?.title,
        classification_id: doc?.category_id,
        file: pickedFiles,
      },
    });
  };


  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setDoc(fetchedDoc))
      console.log('fetched doc: ', fetchedDoc)
    }
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
            mb: 1,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            ویرایش سند
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
          <Grid
            container
            spacing={2}
            my={2}
            component="form"
            autoComplete="off"
          >
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
                  dispatch(
                    setDoc({ ...doc, title: e.currentTarget.value })
                  )
                }
                fullWidth
              />
            </Grid>

            <Grid xs={12} item>
              {fetchedDoc?.file && (
                <Typography component="h1" variant="h4">
                  فایل پیشین
                </Typography>
              )}
              <Grid container justifyContent="center">
                {fetchedDoc?.file &&
                  <Grid
                    item
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
                      src={fetchedDoc?.file?.download_link}
                      alt={fetchedDoc?.file?.name}
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

                }
              </Grid>
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
              <CategoryBox selectedId={doc?.category_id} />
            </Grid>
          </Grid>


          <LoadingButton
            size="small"
            disabled={updateLoader}
            loading={updateLoader}
            loadingPosition="center"
            // startIcon={<SaveIcon />}
            variant="contained"
            sx={{ my: 2 }}
            onClick={handleSave}
          >
            بروزرسانی
          </LoadingButton>
        </Paper>
      </>
    );
  }

  return content;
};

export default UpdateDocs;
