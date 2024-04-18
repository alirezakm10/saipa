"use client";
import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import ActivityLogModal from "./ActivityLogModal";
import { useGetAdminActivitiesQuery } from '@/redux/services/recentactivities/admin/recentActivitiesApi'


interface UserOptionType {
  inputValue?: number;
  id?: number;
  name?: string;
}

interface Props {
  id: string;
}

const ActivityLogs: React.FC<Props> = ({ id }) => {
  const [activityLogModal, setActivityLogModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<number>(0);
  const [userId, setUserId] = useState<number>(1)
  const [entityType, setEntityType] = useState<number | string>(id)

  const showToast = useToast();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: logs,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : logsError ,
  } = useGetAdminActivitiesQuery({
    userId,
    entityType,
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  },
  {
    refetchOnMountOrArgChange: true
  }
  );



  const handleActivityLogModal = (data: any): void => {
    setModalData(data)
    setActivityLogModal((prev) => !prev);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 20,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) => log.row.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) => log.row.user.name,
    },
    {
      field: "col3",
      headerName: "آی پی",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) => log.row.ip,
    },
    {
      field: "col4",
      headerName: "تاریخ ورود ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) =>
        new DateObject(new Date(log.row.created_at))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      field: "col5",
      headerName: "شماره تماس",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (log) =>
      (
        <a href={`tel:${log.row.user.mobile}`}>
          {log.row.user.mobile}
        </a>
      )
    },
    {
      field: "col6",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (log) => (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<BorderColorIcon />}
            onClick={() => handleActivityLogModal(log.row)}
          >
            جزئیات
          </Button>
        </Stack>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(logs?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      logs?.total !== undefined ? logs?.total : prevRowCountState
    );
  }, [logs?.total, setRowCountState]);


  let content;

  if (isSuccess) {
    content = (
      <>
        <Box sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 2
        }} >
          <Typography component='h1' variant="h3" >فعالیت های اخیر</Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...logs?.data}
          rows={logs?.data}
          columns={columns}
          rowCount={rowCountState}
          loading={isLoading}
          slots={{
            toolbar: CustomToolbar,
          }}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
        <ActivityLogModal
          data={modalData}
          open={activityLogModal}
          setter={() => setActivityLogModal((prev) => !prev)}
        />
      </>
    );
  }

  if (logsError) {
    const error: any = logsError;
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

export default ActivityLogs;
