'use client'
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Grid, Typography, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import AcceptedFiles from "./AcceptedFiles";
import RejectedFiles from "./RejectedFiles";
import LinearProgressWithLabel from "../loaders/LinearProgressWithLabel";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import styles from "./dragContanier.module.scss";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import VideoFileOutlinedIcon from "@mui/icons-material/VideoFileOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useFileUploader } from "@/hooks/useFileUploader";
import {
  selectUploadProgress,
  selectIsUploading
} from "@/redux/features/filemanagerSlice";
import { tokens } from "@/theme";
import { IDropZone } from "./typescope";


const Dropzone: React.FC<IDropZone> = ({
  dropzoneTitle,
  directory,
  showAcceptedFiles = false,
  showRejectedFiles = false,
  previewType = []
}) => {
  const theme = useTheme()
  const lessThanMd = useMediaQuery(theme.breakpoints.down('md'))
  const colors = tokens(theme.palette.mode)
  const { categorizeFiles } = useFileUploader(directory);
  const isUploading = useAppSelector(selectIsUploading)
  const uploadProgress = useAppSelector(selectUploadProgress)
  const [files, setFiles] = useState<File[]>([])

     const onDrop = useCallback((acceptedFiles:File[]) => {
      if (acceptedFiles.length > 0) {
        setFiles(acceptedFiles)
        categorizeFiles(acceptedFiles)
      }
    },[])


  const {
    getRootProps,
    getInputProps,
    isFileDialogActive,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({onDrop})


  return (
    <Grid container spacing={2}>
      <Grid xs={12} item>
        {/* drag container moadule is inside tooltip tooltip is a parent now */}
        <Tooltip title='با کشیدن فایل و رها کردن آن می توانید فایل های مدنظر خود را برای آپلود انتخاب کنید یا با کلیک یا لمس کادر به صورت مستقیم وارد فایل سیستم شوید.' >
          <Box
            {...getRootProps({
              className: ` ${isDragActive || isFileDialogActive ? styles.dragActive : styles.dropZone}`,
            })}
            border={isDragActive ? '3px dashed green' : `3px dashed ${colors.themeAccent[400]}`}
          >
            <Typography component="p" variant="body2">
              {dropzoneTitle}
            </Typography>
            <input {...getInputProps()} />
            {/* Icons go here */}
            <Box className={styles.iconContainer}>
              {previewType?.includes('images') && <Box className={styles.imgFile}>
                <ImageOutlinedIcon
                  sx={{
                    fontSize: lessThanMd ? '30px' : '60px',
                  }}
                />
              </Box>}
              { previewType?.includes('other') && <Box className={styles.customFile}>
                <FilePresentOutlinedIcon
                  sx={{
                    fontSize: lessThanMd ? '30px' : '60px',
                  }}
                />
              </Box>}
             {previewType?.includes('videos') && <Box className={styles.videoFile}>
                <VideoFileOutlinedIcon
                  sx={{
                    fontSize: lessThanMd ? '30px' : '60px',
                  }}
                />
              </Box>}
            {previewType?.includes('documents') &&  <Box className={styles.docFile}>
                <DescriptionOutlinedIcon
                  sx={{
                    fontSize: lessThanMd ? '30px' : '60px',
                  }}
                />
              </Box>}
            </Box>
          </Box>
        </Tooltip>
      </Grid>
      {isUploading === true && (
          <LinearProgressWithLabel value={uploadProgress} />
        )}
     


      {showAcceptedFiles && <Grid xs={12} item>
        <AcceptedFiles acceptedFiles={acceptedFiles} />
      </Grid>}

      {showRejectedFiles && <Grid xs={12} item>
        <RejectedFiles fileRejections={fileRejections} />
      </Grid>}

      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
      </Grid>
    </Grid>
  );
};

export default Dropzone;
