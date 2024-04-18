"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Badge
} from "@mui/material";
import Image from "next/image";
import { tokens } from "@/theme";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "@/hooks/useToast";
import { Form, Formik, Field  } from "formik";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import UploadModal from "./UploadModal";
import useTextTruncation from "@/hooks/useTextTruncation";
import { selectedDir, setPickedFilesForEditor, selectPickedFilesForEditor, setPickedFilesForEditorEmpty, setPickedFilesForMainAttach, selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useDeleteFilesMutation } from "@/redux/services/filemanagerApi";
import { CircleLoader } from "react-spinners";
import { useGetDesiredFolderQuery } from "@/redux/services/filemanagerApi";
import usePermission from "@/hooks/usePermission";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import Link from "next/link";
import useFileFormatDetection from "@/hooks/useFileFormatDetection";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { GiCardPlay } from "react-icons/gi";
import type { ComponentRecognizer } from "./typescope";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Props {
  searchTerm: string;
  componentRecognizer: ComponentRecognizer[]
}

const FilesList: React.FC<Props> = ({ searchTerm, componentRecognizer }) => {
  const dispatch = useAppDispatch()
  const { detectFileFormat } = useFileFormatDetection()
  const truncateText = useTextTruncation()
  const showToast = useToast();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const selectedDirectory = useAppSelector(selectedDir)
  const pickedFilesForEditor = useAppSelector(selectPickedFilesForEditor)
  const pickedForMainAttach = useAppSelector(selectPickedForMainAttach)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number | string>('all')
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const { hasPermission } = usePermission();


  const toggleItemSelection = (item:any, itemId: string) => {
    if (componentRecognizer?.includes('textEditor')) {
      dispatch(setPickedFilesForEditor(item));
    }
  
    if (componentRecognizer?.includes('mainAttach')) {
      dispatch(setPickedFilesForMainAttach(item));
    }
  
    // Optional: If not present in componentRecognizer, dispatch both actions
    if (componentRecognizer?.includes('textEditor') && componentRecognizer?.includes('mainAttach')) {
      dispatch(setPickedFilesForEditor(item));
      dispatch(setPickedFilesForMainAttach(item));
    }
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds((prev) => prev.filter((id) => id !== itemId))
 
    } else {
      // Item is not selected, so select it
      setSelectedItemIds((prev) => [...prev, itemId]);
    }
  }

  const [
    deleteFiles,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteFilesMutation<any>();

  const { data: dirFiles, isSuccess: dirSuccess, isLoading: dirLoader, isFetching: dirFetching } = useGetDesiredFolderQuery({ dir: selectedDirectory.name, page, perPage, searchTerm },{
    refetchOnMountOrArgChange:true
  })


  const handleUploadModal = () => {
    setUploadModal(prev => !prev)
  }

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);


  useEffect(() => {
    if (dirSuccess) {
      setTotal(dirFiles?.pagination?.total)
    }
  }, [selectedDirectory]);




  let content;

  if (dirSuccess) {
    content = (dirFetching ? (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircleLoader size='300px' color="#FFF" />
      </Box>
    ) :
      <Box
        sx={{ position: 'relative', overflowY: 'auto', overflowX: 'hidden', height: 'auto', width: '100%', maxHeight: '100%' }}
      >

        <Typography>فایل ها</Typography>
        <Divider />
        {dirFiles?.files?.length > 0 ? <Formik
          initialValues={{
            files: [],
          }}
          onSubmit={async (values, { resetForm }) => {
           const catchedIdies = await values?.files?.map((item:any) => item.id)
            await deleteFiles({files:catchedIdies});
            // we empty the pickedfile stahs after delete to prevent show silected borders on idies
            dispatch(setPickedFilesForEditorEmpty())
            resetForm()
          }}
        >
          {({ handleSubmit, values, handleChange }) => (
            <Form>
              <Box
                sx={{
                  position: "sticky",
                  zIndex: 1,
                  width: "100%",
                  minWidth: '100%',
                  my: 1,
                  top: 0,
                  background: `rgba(${colors.primary[100]}, 0.5)`,
                  backdropFilter: "saturate(180%) blur(15px)",
                }}
              >

                {values.files.length > 0 && hasPermission("File.delete") ? (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2
                    }}
                  >
                    <ConfirmModal
                      modalTitle=""
                      description={`آیا از حذف مطمئن هستید؟`}
                      variant="contained"
                      color="error"
                      justIcon={<DeleteIcon />}
                      ctaLoader={deleteLoader}
                      setter={() => {
                        handleSubmit()
                      }}
                    />
                    <Button variant="contained" onClick={() => dispatch(setShowFilemanager(''))} sx={{bgcolor:colors.greenAccent[300]}} >
                      <Badge badgeContent={`${pickedFilesForEditor?.length > 0 ? pickedFilesForEditor?.length : pickedForMainAttach?.length }`} sx={{px:2, fontSize:'10px'}} color="success"  >
                        <GiCardPlay size={22} color={colors.themeAccent[400]} style={{margin:'auto 4px'}} />
                       <Typography>تایید فایل های برداشته شده</Typography>
                      </Badge>
                    </Button>
                  </Box>
                ) : null}
                <Box
                  sx={{
                    position: 'relative',
                    width: "100%",
                    minWidth: "100%",
                    minHeight: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {hasPermission("File.create") && <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<CloudUploadOutlinedIcon />}
                    onClick={() => handleUploadModal()}
                  >
                    آپلود فایل
                  </Button>}
                </Box>
              </Box>
              <Grid container spacing={2} justifyContent='center'
              >
                <PhotoProvider>
                  {dirFiles?.files?.map((item: any, index: number) => (
                    <Grid item alignItems='center'
                      key={index}
                      onChange={() => toggleItemSelection(item,item.id)}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 2,
                          transition: '.2s',
                          boxShadow: `0px 0px 10px ${colors.themeAccent[500]}`,
                          borderRadius: "10px",
                          border: pickedFilesForEditor.includes(item) || pickedForMainAttach.includes(item) ? "4px solid #C4E538" : "none",
                          width: "200px",
                          minWidth: '200px',
                          maxWidth: '200px',
                          height: '250px',
                          minHeight: '250px',
                          maxHeight: '250px',
                          ":hover": {
                            transform: "scale(1.1)",
                            background: colors.themeAccent['400']
                          },
                        }}
                      >

                        <Field
                          style={{
                            position: "absolute",
                            zIndex: 1,
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                          name="files"
                          type="checkbox"
                          value={item}  // Change this line to store the entire item object
                          onChange={(e: any) => {
                            const checked = e.target.checked;
                            handleChange({
                              target: {
                                name: 'files',
                                value: checked ? [...values.files, item] : values.files.filter((file) => file !== item),
                              },
                            });
                          }}
                        />
                        {
                          ['jpg', 'svg', 'jpeg', 'png'].includes(detectFileFormat(item)) ? (
                            <>
                              <Image
                                src={`${item.downloadLink}`}
                                alt={item.name}
                                priority
                                style={{
                                  filter: `dropShadow(5px 4px 10px)`,
                                  objectFit: "cover",
                                  objectPosition: "center center",
                                }}
                                draggable={false}
                                width={200}
                                height={200}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  zIndex: 1,
                                }}
                              >
                                <PhotoView key={item.id} src={`${item.downloadLink}`}>
                                  <Button
                                     variant="outlined"
                                     color='warning'
                                  >
                                    <VisibilityIcon />
                                  </Button>
                                </PhotoView>
                              </Box>
                              <Typography textAlign='center' sx={{ direction: 'rtl', mb: 2 }} >{truncateText(item.name, 10)}</Typography>
                            </>
                          ) : ['mp4', 'avi', 'mkv'].includes(detectFileFormat(item)) ? (
                            <>
                              {/* Your video player component or logic here */}
                              <Typography textAlign='center' sx={{ direction: 'rtl', mb: 2 }} >{truncateText(item.name, 10)}</Typography>
                            </>
                          ) : (
                            <>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: 2,
                                  width: '200px',
                                  height: '200px'
                                }}
                              >
                                <ArticleOutlinedIcon sx={{
                                  fontSize: '60px'
                                }} />
                                <Link href={item.downloadLink} target='blank' >
                                  <Button variant='outlined' color='success' >دانلود</Button>
                                </Link>
                              </Box>
                              <Typography textAlign='center' sx={{ direction: 'rtl', mb: 2 }} >
                                {truncateText(item.name, 10)}
                              </Typography>
                            </>
                          )
                        }

                      </Box>
                    </Grid>
                  )
                  )
                  }
                </PhotoProvider>
              </Grid>
            </Form>

          )}
        </Formik>
          :
          <Box sx={{ width: '100%', height: '200px', display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }} >
            <Typography>فایلی در این پوشه آپلود نشده است</Typography>
          </Box>
        }
        <UploadModal
          open={uploadModal}
          setter={() => setUploadModal((prev) => !prev)}
        />
      </Box >
    )
  }

  if (dirLoader) {
    content = (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircleLoader size='300px' color="#FFF" />
      </Box>
    )
  }






  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >

      {content}

    </Box>
  )
};

export default FilesList;
