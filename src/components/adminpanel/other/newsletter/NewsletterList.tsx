"use client";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import {
  useDeleteNewsLetterMutation,
  useGetNewsletterQuery,
  useSendNewsletterMutation,
} from "@/redux/services/newsletter/newsletterApi";
import { tokens } from "@/theme";
import { ITablePaginationMode } from "@/types";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission";

const NewsletterList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();
  const { hasPermission } = usePermission();

  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: newsletters,
    isSuccess,
    isLoading,
    error : newslettersError,
  } = useGetNewsletterQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    sendNewsletter,
    {
      isLoading: sendNewsletterLoadingStatus,
      isSuccess: sendNewsletterSuccessStatus,
      data: sendNewsletterResult,
      error: sendNewsletterError,
    },
  ] = useSendNewsletterMutation();

  const [
    deleteNewsletter,
    {
      isSuccess: deleteStatus,
      isLoading: deleteLoader,
      data: deleteResult,
      error: deleteError,
    },
  ] = useDeleteNewsLetterMutation<any>();

  const [rowCountState, setRowCountState] = useState(newsletters?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      newsletters?.total !== undefined ? newsletters?.total : prevRowCountState
    );
  }, [newsletters?.total, setRowCountState]);

  useEffect(() => {
    if (sendNewsletterSuccessStatus) {
      showToast(sendNewsletterResult?.message, "success");
    }
    if (sendNewsletterError) {
      const error: any = sendNewsletterError;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [sendNewsletterLoadingStatus, sendNewsletterSuccessStatus]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
    if (deleteError) {
      const errMsg = deleteError?.data?.message ?? deleteError.error;
      showToast(errMsg, "error");
    }
  }, [deleteError,deleteStatus, deleteResult]);

  const deleteHandler = (id: number): void => {
    deleteNewsletter(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "تصویر",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      renderCell: (newsletter : any) => {
        const filteredPhoto = newsletter.row.content.photos.filter(
          (photo: any) => photo.is_default == 1
        )[0];
        return (
          <Box position="relative" width="100px" height="50px">
            <Image
              src={
                filteredPhoto?.download_link ?? "/assets/images/no-image.svg"
              }
              fill
              alt={filteredPhoto?.alt ?? "No image"}
            />
          </Box>
        );
      },
    },
    {
      field: "col2",
      headerName: "عنوان ",
      headerAlign: "center",
      //   align: "center",
      width: 200,
      valueGetter: (newsletter : any) => newsletter.row.content.title,
    },

    {
      field: "col3",
      headerName: "وضعیت ارسال",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 150,
      renderCell: (newsletter : any) => {
        return newsletter.row.status == 2 ? (
          <Typography variant="button" sx={{ color: "#66bb6a" }}>
            ارسال شده
          </Typography>
        ) : (
          <Typography variant="button" sx={{ color: "#ffa726" }}>
            منتظر ارسال{" "}
          </Typography>
        );
      },
    },

    hasPermission("Newsletter.delete") ? {
      field: "col8",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 200,
      renderCell: (newsletter : any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("Newsletter.delete") && <ConfirmModal
            description="آیا از حذف این خبرنامه مطمئن هستید؟"
            color="error"
            btnTitle="حذف"
            icon={<DeleteIcon />}
            setter={() => deleteHandler(newsletter.row.id)}
            ctaLoader={deleteLoader}
          />}
        </Stack>
      ),
    } : undefined ,
  ].filter(Boolean) as GridColDef[];

  let newsletterContent;

  if (isSuccess) {
    newsletterContent = (
      <>
        <DataGrid
          autoHeight
          rowHeight={65}
          rowCount={rowCountState}
          {...newsletters?.data}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                نتیجه ای یافت نشد!
              </Box>
            ),
            noResultsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                نتیجه ای یافت نشد!
              </Box>
            ),
          }}
          rows={newsletters?.data}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </>
    );
  }

  if (isLoading) {
    newsletterContent = (
      <Box
        display="flex"
        justifyContent="center"
        height="100vh"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (newslettersError) {
    const error : any = newslettersError;
    newsletterContent = (
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 1,
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Box>
       { hasPermission("Newsletter.index") &&   <LoadingButton
            loading={sendNewsletterLoadingStatus}
            loadingPosition="center"
            variant="outlined"
            type="submit"
            onClick={() => sendNewsletter("")}
            sx={{ mx: 1 }}
          >
            ارسال خبرنامه
          </LoadingButton>}
         { hasPermission("Newsletter.create") && <Button
            variant="contained"
            onClick={() =>
              router.push("/adminpanel/other/newsletter/addnewsletter")
            }
          >
            افزودن خبرنامه
          </Button>}
        </Box>
      </Box>
      {newsletterContent}
    </>
  );
};

export default NewsletterList;
