"use client";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  CircularProgress,
  Typography,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  setShowFilemanager,
  selectShowFilemanager,
  selectedDir,
  setSelectedDir,
  selectedOpenFileManagerTypes,
  setPickedFilesForEditorEmpty,
  setPickedFilesForMainAttachEmpty,
} from "@/redux/features/filemanagerSlice";
import styles from "./filemanager.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  useGetAllMediasQuery
} from "@/redux/services/filemanagerApi";
import { FileManagerType } from "./typescope";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileManagerVariants } from "./FileManagerVariants";
import FilesList from "./FilesList";
import { styled } from "@mui/material/styles";


const FileManager = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState<string>('')
  const OpenFileManagerFor = useAppSelector(selectedOpenFileManagerTypes)
  const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.selected}`]: {
      boxShadow: `0px 0px 10px ${colors.themeAccent[500]}`,
      borderRadius: theme.shape.borderRadius,
      marginTop: 3,
      marginBottom: 3,
      height: "60px",
      width: "100%",
      mx: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  }));

  const {
    data: filemanagerData,
    isLoading,
    isSuccess,
    error,
  } = useGetAllMediasQuery("");
  const showFilemanager = useAppSelector(selectShowFilemanager);
  const handleDirSelect = (node: FileManagerType) => {
    dispatch(setSelectedDir(node));
  };
const handleSearchTerm = (e:ChangeEvent<HTMLInputElement>) => {
setSearchTerm(e.target.value)
}
  const renderTree = (node: FileManagerType) => (
    <StyledTreeItem
      sx={{ borderRadius: "10px" }}
      onClick={() => handleDirSelect(node)}
      key={node.name}
      nodeId={node.name}
      label={node.name}
    >
      {Array.isArray(node.children)
        ? node.children.map((child) => renderTree(child))
        : null}
    </StyledTreeItem>
  );

  useEffect(() => {
    if(isSuccess){
      dispatch(setSelectedDir(filemanagerData[0]))
    }
  },[filemanagerData])

  let content;

  if (isSuccess) {
    content = (
      <AnimatePresence>
        {showFilemanager && (
          <motion.div
            animate={showFilemanager ? "visible" : "hidden"}
            initial={FileManagerVariants.initial}
            exit={FileManagerVariants.hidden}
            variants={FileManagerVariants}
          >
            <div
              style={{
                position: "fixed",
                zIndex: 31,
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                borderRadius: "10px",
                background: `rgba(${colors.primary[900]}, 0.5)`,
                backdropFilter: "saturate(180%) blur(15px)",
              }}
            >
              <div className={styles.container}>
                <div
                  className={styles.topbar}
                  style={{
                    border: `1px solid ${colors.primary[300]}`,
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 10px",
                  }}
                >
                  <IconButton
                    sx={{ height: "40px" }}
                    onClick={() => {
                      dispatch(setPickedFilesForEditorEmpty())
                      dispatch(setPickedFilesForMainAttachEmpty())
                      dispatch(setShowFilemanager(''))
                    }
                    }
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography>مدیریت فایل ها</Typography>

                  <TextField
                    size="small"
                    placeholder="Search field"
                    value={searchTerm}
                    onChange={handleSearchTerm}
                    type="search"
                  />
                </div>
                {/* sidebar started */}
                <div
                  className={styles.sidebar}
                  style={{
                    border: `1px solid ${colors.primary[300]}`,
                    borderRadius: "10px",
                  }}
                >
                  <Typography>پوشه ها</Typography>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                    <TreeView>
                      {filemanagerData?.map((dir: FileManagerType) =>
                        renderTree(dir)
                      )}
                    </TreeView>
                  )}
                </div>
                {/* sidebar ended */}
                {/* media started */}
                <div
                  className={styles.content}
                  style={{
                    position: "relative",
                    overflowY: "auto",
                    border: `1px solid ${colors.primary[300]}`,
                    borderRadius: "10px",
                  }}
                >

                        <FilesList searchTerm={searchTerm} componentRecognizer={OpenFileManagerFor} />

                </div>
              </div>
            </div>
            {/* medias ended */}
          </motion.div>
        )
        }
      </AnimatePresence >
    );
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return content;
};

export default FileManager;
