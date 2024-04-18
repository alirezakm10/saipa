"use client";
import {
  useGetCommentQuery,
} from "@/redux/services/comments/commentsApi";
import {
  Typography,
  Divider,
  Box,
  Paper,
  Avatar,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "@/redux/hooks";
import useToast from "@/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import CloseIcon from "@mui/icons-material/Close";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import useProfileDesigner from "@/hooks/useProfileDesigner";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import ReplyIcon from "@mui/icons-material/Reply";
import { tokens } from "@/theme";
import CommentStatus from "./CommentStatus";
import RuleIcon from "@mui/icons-material/Rule";
import InfoIcon from '@mui/icons-material/Info';
import UserInfoTable from "./UserInfoTable";
import { getStatusTitle } from "./getStatusTitlesAndColors";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ReplyCommentForm from "./ReplyCommentForm";
import UpdateCommentForm from "./UpdateCommentForm";

interface IUpdateCommentModal {
  id: number;
  open: boolean;
  setter: () => void;
}

export default function ReplyCommentModal({
  id,
  open,
  setter,
}: IUpdateCommentModal) {
  const showToast = useToast()
  const dispatch = useAppDispatch()
  const { getGeneratedProfile } = useProfileDesigner()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const {
    data: fetchedComment,
    isSuccess,
    isLoading,
    isFetching,
  } = useGetCommentQuery(id, {
    refetchOnMountOrArgChange: true,
  })



  const renderTree = (comment: any, idx: number) => (
    <>
      <ListItem key={idx} sx={{
        position: 'relative', transition: '.5s', display: 'flex', flexDirection: 'column', borderRadius: '10px',
        border: `1px solid ${comment?.status === 2 ? '#1dd1a1' : (comment?.status === 3 ? '#ee5253' : '#ff9f43')}`,
        boxShadow: `0px 0px 5px ${comment.status === 2 ? '#1dd1a1' : (comment.status === 3 ? '#ee5253' : '#ff9f43')}`, my: 3,
        ':hover': {
          background: colors.themeAccent['600']
        }
      }}>

        <Box>
          <ParentMenu
            buttonTitle=""
            justIcon={<RuleIcon />}
            color="warning"
            variant="text"
          >
            <CommentStatus id={comment?.id} />
          </ParentMenu>
          <ParentMenu
            buttonTitle=""
            justIcon={<ReplyIcon />}
            color="warning"
            variant="text"
          >
            <ReplyCommentForm comment={comment} />
          </ParentMenu>
          <ParentMenu
            buttonTitle=""
            justIcon={<BorderColorIcon />}
            color="warning"
            variant="text"
          // onClick={() => handleUpdateCommentModal(comment.row.id)}
          >
            <UpdateCommentForm comment={comment}  />
          </ParentMenu>
          <ParentMenu
            buttonTitle=""
            justIcon={<InfoIcon />}
            color="warning"
            variant="text"
          >
            <UserInfoTable
              username={comment?.user ? comment?.user.name : 'ندارد'}
              email={comment?.user ? comment?.user.email : 'ندارد'}
              mobile={comment?.user ? comment?.user.mobile : 'ندارد'}
              phone={comment?.user?.profile ? comment?.user?.profile.phone : 'ندارد'}
            />
          </ParentMenu>
        </Box>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }} >
          <ListItemIcon>
            <Avatar
              sizes="medium"
              {...getGeneratedProfile(comment?.user.name)}
            />
          </ListItemIcon>
          <ListItemText primary={comment?.body ? comment?.body : "ندارد"} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} >
          <Typography>وضعیت: {getStatusTitle(comment?.status)}</Typography>
          <Typography>{
            new DateObject(new Date(comment?.created_at))
              .convert(persian, persian_fa)
              .format()
          }</Typography>
        </Box>
      </ListItem>
      {Array.isArray(comment.children)
        ? comment.children.map((child: any, idx: number) =>
          renderTree(child, idx)
        )
        : null}
    </>
  );



  let content;

  if (isSuccess) {
    content = (
      <AnimatePresence>
        {open && (
          <Box
            position="fixed"
            zIndex={30}
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
                <Typography variant="h4" component="h1">
                  پاسخ به دیدگاه - شناسه {id}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  {fetchedComment && (
                    <ListItem sx={{
                      display: 'flex', flexDirection: 'column', color: 'white', background: colors.themeAccent['500'], borderRadius: '10px', border: `1px solid ${fetchedComment?.status === 2 ? '#1dd1a1' : (fetchedComment?.status === 3 ? '#ee5253' : '#ff9f43')}`,
                      boxShadow: `0px 0px 10px ${fetchedComment?.status === 2 ? '#1dd1a1' : (fetchedComment?.status === 3 ? '#ee5253' : '#ff9f43')}`,
                      my: 1
                    }}>
                      <Box>
                      <ParentMenu
                          buttonTitle=""
                          justIcon={<RuleIcon />}
                          color="warning"
                          variant="text"
                        >
                          <CommentStatus id={fetchedComment?.id} />
                        </ParentMenu>
                      <ParentMenu
                          buttonTitle=""
                          justIcon={<ReplyIcon />}
                          color="warning"
                          variant="text"
                        >
                          <ReplyCommentForm comment={fetchedComment} />

                        </ParentMenu>
                        
                      
                        <ParentMenu
            buttonTitle=""
            justIcon={<BorderColorIcon />}
            color="warning"
            variant="text"
          // onClick={() => handleUpdateCommentModal(comment.row.id)}
          >
            <UpdateCommentForm comment={fetchedComment} />
          </ParentMenu>
                       
                        <ParentMenu
                          buttonTitle=""
                          justIcon={<InfoIcon />}
                          color="warning"
                          variant="text"
                        >
                          <UserInfoTable
                            username={fetchedComment?.user ? fetchedComment?.user.name : 'ندارد'}
                            email={fetchedComment?.user ? fetchedComment?.user.email : 'ندارد'}
                            mobile={fetchedComment?.user ? fetchedComment?.user.mobile : 'ندارد'}
                            phone={fetchedComment?.user?.profile ? fetchedComment?.user?.profile.phone : 'ندارد'}
                          />
                        </ParentMenu>
                      </Box>
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }} >
                        <ListItemIcon>
                          <Avatar
                            sizes="medium"
                            {...getGeneratedProfile(
                              fetchedComment
                                ? fetchedComment?.user?.name
                                : "loading"
                            )}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            fetchedComment?.body
                              ? fetchedComment?.body
                              : "ندارد"
                          }
                        />
                      </Box>
                      {/* date box */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} >
                        <Typography>وضعیت: {getStatusTitle(fetchedComment?.status)}</Typography>
                        <Typography>{
                          new DateObject(new Date(fetchedComment?.created_at))
                            .convert(persian, persian_fa)
                            .format()
                        }</Typography>
                      </Box>
                    </ListItem>
                  )}
                  {fetchedComment?.children.map(
                    (comment: any, idx: number) => renderTree(comment, idx)
                  )}
                </List>
              </Paper>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    );
  }

  if (isLoading) {
    content = <TimeLoader />;
  }

  return content;
}
