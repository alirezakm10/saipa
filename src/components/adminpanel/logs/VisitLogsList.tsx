"use client";
import { useState, useEffect } from "react";
import { useGetPagesVisitsQuery, useGetVisitsQuery } from "@/redux/services/logs/visitLogsApi";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

import {
  Box, Typography,
} from "@mui/material";
import { ITablePaginationMode } from "@/types";
import Link from "next/link";

const VisitsLogsList = () => {
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: pagesLogs,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : pageLogsError,
  } = useGetPagesVisitsQuery('');

  const {
    data: totalVisits,
  } = useGetVisitsQuery('');
 

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "نام صفحه",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) => log.row.title,
    },
    {
      field: "col2",
      headerName: "تعداد بازدید",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (log) => log.row.count,
    },
    {
      field: "col3",
      headerName: "لینک",
      width: 700,
      headerAlign: "center",
      align: "center",
      renderCell: (log) => (
        <Link href={log.row.route} >{log.row.route}</Link>
        ),
    }
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(pagesLogs?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      pagesLogs?.total !== undefined ? pagesLogs?.total : prevRowCountState
    );
  }, [pagesLogs?.total, setRowCountState]);




  function generateRandom() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

  let content;

  if (isSuccess) {
    content = (
      <Box>
        <Box sx={{
          display:'flex',
          width:'100%',
          flexDirection:'row',
          justifyContent:'space-between',
          mb:2
        }} >
          <Typography component='h1' variant="h3" >تعداد بازدید صفحات</Typography>
          <Typography component='h1' variant="subtitle1" >بازدید کل: {totalVisits?.count}</Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...pagesLogs}
          rows={pagesLogs}
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
          getRowId={(row: any) =>  generateRandom()}
        />
      </Box>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (pageLogsError) {
    const error : any = pageLogsError;
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

export default VisitsLogsList;
