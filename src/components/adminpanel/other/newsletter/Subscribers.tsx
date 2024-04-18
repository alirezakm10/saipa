import { useGetSubscribersQuery } from "@/redux/services/newsletter/newsletterApi";
import { ITablePaginationMode } from "@/types";
import { Box, CircularProgress, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const Subscribers = () => {
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: subscribers,
    isSuccess,
    isLoading,
    error : subscribersError ,
  } = useGetSubscribersQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [rowCountState, setRowCountState] = useState(subscribers?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      subscribers?.total !== undefined ? subscribers?.total : prevRowCountState
    );
  }, [subscribers?.total, setRowCountState]);

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (subscribe) => subscribe.row.id,
    },
    {
      field: "col2",
      headerName: "ایمیل ",
      headerAlign: "center",
      //   align: "center",
      minWidth: 300,
      valueGetter: (subscribe) => subscribe.row.email,
    },
    {
      field: "col3",
      headerName: "تاریخ اشتراک",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      valueGetter: (subscribe) =>
      new DateObject(new Date(subscribe.row.created_at))
        .convert(persian, persian_fa)
        .format(),
  },
  ];

  let content;

  if (isSuccess) {
    content = (
      <DataGrid
        autoHeight
        rowCount={rowCountState}
        {...subscribers?.data}
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
        rows={subscribers?.data}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        pageSizeOptions={[10, 20, 30]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        showCellVerticalBorder
      />
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

  if (subscribersError) {
    const error : any = subscribersError;
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

  return content;
};

export default Subscribers;
