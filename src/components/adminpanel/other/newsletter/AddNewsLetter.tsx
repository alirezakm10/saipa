"use client";
import useToast from "@/hooks/useToast";
import { useGetNewsQuery } from "@/redux/services/news/newsApi";
import { useAddNewsletterMutation } from "@/redux/services/newsletter/newsletterApi";
import { tokens } from "@/theme";
import { ITablePaginationMode } from "@/types";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddNewsLetter = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const {
    data: newsList,
    isSuccess,
    isLoading,
    error : newsListError,
  } = useGetNewsQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    addNewsletter,
    {
      isLoading: addNewsletterLoadingStatus,
      isSuccess: addNewsletterSuccessStatus,
      data: addNewsletterResult,
      error: addNewsletterError,
    },
  ] = useAddNewsletterMutation();

  const [rowCountState, setRowCountState] = useState(newsList?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      newsList?.total !== undefined ? newsList?.total : prevRowCountState
    );
  }, [newsList?.total, setRowCountState]);

  useEffect(() => {
    if (addNewsletterSuccessStatus) {
      showToast(addNewsletterResult?.message, "success");
      router.back();
    }
    if (addNewsletterError) {
      const error: any = addNewsletterError;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addNewsletterLoadingStatus, addNewsletterSuccessStatus]);

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "تصویر",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      renderCell: (news) => {
        const filteredPhoto = news.row.photos.filter(
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
      width: 600,
      valueGetter: (news) => news.row.title,
    },
  ];

  let content;

  if (isSuccess) {
    content = (
      <>
        <DataGrid
          autoHeight
          rowHeight={65}
          rowCount={rowCountState}
          {...newsList?.data}
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
          }}
          rows={newsList?.data}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      </>
    );
  }

  if (isLoading) {
    content = (
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

  if (newsListError) {
    const error : any = newsListError;
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
          افزودن خبرنامه
        </Typography>
        <Box>
          <LoadingButton
            loading={addNewsletterLoadingStatus}
            disabled={addNewsletterLoadingStatus}
            loadingPosition="center"
            variant="contained"
            type="submit"
            onClick={() => addNewsletter({content_ids : rowSelectionModel})}
            sx={{ mx: 1 }}
          >
            افزودن
          </LoadingButton>
          <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => router.back()}
            >
              <ArrowBackIcon />
            </Button>
        </Box>
      </Box>
      {content}
    </>
  );
};

export default AddNewsLetter;
