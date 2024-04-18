import { tokens } from "@/theme";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ThreePIcon from "@mui/icons-material/ThreeP";
import {
  useGetTicketMessagesQuery,
  useReferTicketMutation,
  useResponseToTicketMutation,
} from "@/redux/services/tickets/ticketApi";
import { useSession } from "next-auth/react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { TicketResponse } from "./typescope";
import AutocompleteRoleInput from "@/components/shared/AutocompleteRoleInput";
import React, { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice"
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DynamicAttachPreview from "../filemanager/DynamicAttachPreview"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Status from "./Status";
import Priority from "./Priority";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import { OptionType } from "@/components/shared/AutocompleteRoleInput/typescope";
import { messageSchema } from "./ticketSchema";
import usePermission from "@/hooks/usePermission";

interface Props {
  id: string;
}

const Messages: React.FC<Props> = ({ id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const showToast = useToast();
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermission();
  const pickedFiles = useAppSelector(selectPickedForMainAttach)


  const formik = useFormik<TicketResponse>({
    initialValues: {
      content: "",
      files: [],
    },
    validationSchema: messageSchema,
    onSubmit: (values) => {
      sendMessage({
        id,
        body: {
          ...values,
          files: pickedFiles.map((file:any) => ({ id: file.id })),
        },
      });
    },
  });

  const {
    data: messageData,
    isSuccess: messageSuccessStatus,
    isLoading: messageLoadingStatus,
    error: messageErrorStatus,
  } = useGetTicketMessagesQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [
    sendMessage,
    {
      isSuccess: sendMessageSuccess,
      isLoading: sendMessageLoading,
      data: sendMessageResult,
      error: sendMessageErrorStatus,
    },
  ] = useResponseToTicketMutation();


  React.useEffect(() => {
    if (sendMessageSuccess) {
      const successMsg = sendMessageResult?.message;
      showToast(successMsg, "success")
      formik.setFieldValue("content", "")
    }
    if (sendMessageErrorStatus) {
      const error: any = sendMessageErrorStatus;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [sendMessageErrorStatus, sendMessageSuccess]);

  const [
    referTicket,
    {
      isSuccess: referSuccess,
      isLoading: referLoading,
      isError: referIsError,
      error: referError,
      data: referResult,
    },
  ] = useReferTicketMutation();

  useEffect(() => {
    if (referSuccess) {
      showToast(referResult?.message, "success");
    }
    if (referError) {
      const error: any = referError;
      showToast(error.data?.message ?? "خطایی رخ داده است!", "error");
    }
  }, [referSuccess, referError, referResult]);

  const handleChangeRole = (event: any, selectedRole: OptionType | null) => {
    referTicket({ id, body: { role_id: selectedRole?.id } });
  };

  const handleDownloadFile = (filePath: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/files/${filePath}`);
  };

  let content;

  if (messageLoadingStatus) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="90vh"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (messageErrorStatus) {
    const error:any = messageErrorStatus;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
       {error?.data?.message ?? error.error}
      </Box>
    );
  }

  if (messageSuccessStatus) {
    content = (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={8} md={9}>
          <Paper
            sx={{
              border: `1px solid ${colors.primary[300]}`,
              borderRadius: "5px",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${colors.primary[300]}`,
                paddingBottom: "10px",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", pt: 1, px: 1 }}>
                <ThreePIcon />
                <Typography style={{ margin: "0 5px" }} variant="subtitle1">
                  {messageData.ticket.title}
                </Typography>
              </Box>
            </Box>
            <CardContent
              sx={{
                maxHeight: "65vh",
                minHeight: "450px",
                overflowY: "auto",
              }}
            >
              {messageData.messages.map((message: any) => (
                <Box
                  sx={{
                    background:
                      data?.user?.user_id == message.user_id
                        ? ` ${colors.grey[900]}`
                        : ` ${colors.themeAccent[900]}`,
                    borderRadius: "10px",
                    p: 1,
                    width: "70%",
                    marginLeft:
                      data?.user?.user_id != message.user_id ? "auto" : "",
                    marginBottom: "10px",
                  }}
                  key={message.id}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      alt={message?.user_photo?.alt || ""}
                      src={message?.user_photo?.download_link || ""}
                      sx={{ width: "45px", height: "45px" }}
                    />
                    <Box sx={{ margin: "0 5px" }}>
                      <Typography variant="subtitle1">
                        {message.username}
                      </Typography>
                      <Typography sx={{ color: "gray" }} variant="subtitle2">
                        {new DateObject(new Date(message.created_at))
                          .convert(persian, persian_fa)
                          .format("YYYY/MM/DD HH:mm")}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ mx: 1 }} variant="body2">
                    {message.body}
                  </Typography>

                  {message.file ? (
                    <Box sx={{ mt: 3 }}>
                      {message.file.map((file: any) => (
                        <Chip
                          onClick={() => handleDownloadFile(file.path)}
                          key={file.id}
                          icon={<DownloadForOfflineIcon />}
                          label={file.path?.replace("tickets/", "")}
                          sx={{ margin: "0 3px" }}
                        />
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ))}
            </CardContent>
            <Box sx={{ borderTop: `1px solid ${colors.primary[300]}`, p: 2 }}>
              {messageData.ticket.status != 3 ? (
                <form onSubmit={formik.handleSubmit}>
                  <Box sx={{ mb: 1 }}>
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن فایل شاخص
                  </Button>
                  </Box>
                  <Box sx={{ my: 2 }}>
                  <DynamicAttachPreview fileType={['image']} />
                  </Box>
                  <TextField
                    id="content"
                    // label="پیام"
                    name="content"
                    placeholder="چیزی بنویسید..."
                    multiline
                    rows={6}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                    sx={{ width: "100%" }}
                    helperText={"پر کردن فیلد متن الزامی است."}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <LoadingButton
                      size="small"
                      loading={sendMessageLoading}
                      loadingPosition="center"
                      type="submit"
                      variant="contained"
                      sx={{ my: 2, mx: 1 }}
                    >
                      ثبت
                    </LoadingButton>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => router.push("/adminpanel/tickets")}
                    >
                      انصراف
                    </Button>
                  </Box>
                </form>
              ) : (
                <Box>تیکت بسته شده</Box>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Paper
            sx={{
              border: `1px solid ${colors.primary[300]}`,
              borderRadius: "5px",
              mt: 1,
              p: 1,
            }}
          >
            <Box sx={{ mt: 2 }}>
              <AutocompleteRoleInput
                size="small"
                width="100%"
                defaultValue={messageData.ticket.role}
                error={referError}
                label="دپارتمان"
                handleAutocompleteChange={handleChangeRole}
                hasPermission={hasPermission("Ticket.edit")}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Priority
                priorityValue={messageData.ticket.priority}
                id={messageData.ticket.id}
                size="small"
                width="100%"
                label="اولویت"
                hasPermission={hasPermission("Ticket.edit")}
              />
            </Box>
            <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
              {messageData.ticket.status === 2 ? (
                <>
                  <Typography variant="body2">وضعیت : </Typography>
                  <Stack
                    sx={{ color: "#66bb6a", mx: 1 }}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <GridCheckCircleIcon />
                    <Typography variant="body2">پاسخ داده شده</Typography>
                  </Stack>
                </>
              ) : (
                <Status
                  statusValue={messageData.ticket.status}
                  id={messageData.ticket.id}
                  width="100%"
                  label="وضعیت"
                  hasPermission={hasPermission("Ticket.edit")}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return <>{content}</>;
};

export default Messages;
