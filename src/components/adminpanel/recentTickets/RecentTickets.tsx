"use client";
import React, { useEffect } from "react";
import {
  Paper,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  Stack,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import UserProfile from "../userProfile/UserAvatar";
import ReplyIcon from "@mui/icons-material/Reply";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { tokens } from "@/theme";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useGetRecentTicketsQuery } from "@/redux/services/tickets/ticketApi";
import { useRouter } from "next/navigation";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import QuickReplyForm from "./QuickReplyForm";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

const RecentTickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();

  const {
    data: recentTicketsData,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    error: ticketError,
  } = useGetRecentTicketsQuery({
    refetchOnMountOrArgChange: true,
  }); 

  useEffect(() => {
    if(isSuccess){
      console.log('tickets: ', recentTicketsData)
    }
  },[isSuccess])

  let content;
  if(isLoading){
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

  if (ticketError) {
    const error : any = ticketError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="200px"
        alignItems="center"
        border={`1px solid ${colors.primary[300]}`}
        borderRadius="7px"
      >
        {error?.data?.message ?? error.error}
      </Box>
    );
  }

  if (isSuccess) {
    content =
      recentTicketsData?.data.length > 0 ? (
        recentTicketsData?.data?.map((ticket: any) => (
          <Card
            key={ticket.id}
            sx={{
              minHeight: "max-content",
              mt: 2,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: colors.blue[500] }}
                  aria-label="recipe"
                  alt={ticket.username}
                  src={ticket.user_photo?.download_link}
                />
              }
              action={
                <IconButton
                  sx={{ bgcolor: "transparent" }}
                  aria-label="settings"
                >
                  {/* <MoreVertIcon /> */}
                </IconButton>
              }
              title={ticket.title}
              subheader={new DateObject({date: ticket.created_at , calendar: persian, locale: persian_fa }).format()}
            />
            <CardContent>
              <Tooltip title={ticket.body} placement="bottom-start">
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textWrap: "nowrap",
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  {ticket.body}
                </Typography>
              </Tooltip>
            </CardContent>
            <CardActions>
              <Button
                sx={{ gap: 1, alignItems: "center" }}
                variant="outlined"
                onClick={() =>
                  router.push(
                    `/adminpanel/tickets/messages/${ticket.ticket_id}`
                  )
                }
                endIcon={<ReplyIcon />}
              >
                پاسخ
              </Button>
              <ParentMenu
                buttonTitle="پاسخ سریع"
                buttonIcon={<QuickreplyIcon />}
                variant="outlined"
                isFetching ={isFetching}
              >
                <QuickReplyForm id={ticket.ticket_id} />
              </ParentMenu>
            </CardActions>
          </Card>
        ))
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          height="200px"
          alignItems="center"
          border={`1px solid ${colors.primary[300]}`}
          borderRadius="7px"
        >
          تیکتی ثبت نگردیده است!
        </Box>
      );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        position: "relative",
        overflowY: "auto",
        height: "100%",
        p: 1,
        borderRadius: "10px",
      }}
    >
      <Stack
        sx={{}}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>تیکت های اخیر</Typography>
        <Tooltip title="رفتن به تیکت ها">
          <IconButton onClick={() => router.push("/adminpanel/tickets")}>
            <MailOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {content}
    </Paper>
  );
};

export default RecentTickets;
