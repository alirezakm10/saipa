"use client";
import {
  Typography,
  Divider,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import { useAppSelector } from "@/redux/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import CloseIcon from "@mui/icons-material/Close";
import { selectedDir } from "@/redux/features/filemanagerSlice";
import Dropzone from "@/components/shared/uploader/Dropzone";

interface IUpdateCommentModal {
  open: boolean;
  setter: () => void;
}

export default function UploadModal({
  open,
  setter,
}: IUpdateCommentModal) {
  const theme = useTheme()
  const selectedDirectory = useAppSelector(selectedDir);


return (
      <AnimatePresence>
        {open && (
          <Box
            position="fixed"
            zIndex={3}
            width="100vw"
            height="100%"
            left={0}
            right={0}
            top={0}
            bottom={0}
            sx={{
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "saturate(180%) blur(10px)",
            }}
          >
            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              initial={ModalVariants.initial}
              exit={ModalVariants.hidden}
              variants={ModalVariants}
              animate={open ? "visible" : "hidden"}
            >
              <Paper
                sx={{
                  position: "absolute",
                  overflowY: "auto",
                  borderRadius: "10px",
                  zIndex: 3,
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: { xs: "100%", md: "80%" },
                  height: "90%",
                  p: 1,
                  mx: "auto",
                  my: "auto",
                }}
              >
                <CloseIcon sx={{ cursor: "pointer" }} onClick={setter} />
                <Typography variant="h3" component="h1">
                  پوشه {selectedDirectory.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Dropzone 
                preview={true}
                previewType={['images','videos','documents','other']}
                directory={selectedDirectory?.name} dropzoneTitle="آپلود" />
              </Paper>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    );
  }

  