"use client";
import { useState, useEffect } from "react";
import { useGetSaleReportsQuery } from "@/redux/services/shop/saleReportsApi";
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

const SalesReports = () => {
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: saleReports,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : salesReportsError ,
  } = useGetSaleReportsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

 

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه محصول",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (report) => report.row.product_id,
    },
    {
      field: "col2",
      headerName: "نام محصول",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (report) => report.row.title,
    },
    {
      field: "col3",
      headerName: "قیمت",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (report) => report.row.amount,
    },
    {
        field: "col4",
        headerName: "تعداد فروش",
        width: 100,
        headerAlign: "center",
        align: "center",
        valueGetter: (report) => report.row.sales,
      },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(saleReports?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      saleReports?.total !== undefined ? saleReports?.total : prevRowCountState
    );
  }, [saleReports?.total, setRowCountState]);

 


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
      <>
        <Box sx={{
          display:'flex',
          width:'100%',
          flexDirection:'row',
          justifyContent:'space-between',
          mt:1,
          pb:1
        }} >
          <Typography component='h1' variant="h4" >گزارش محصولات فروش رفته</Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...saleReports?.data}
          rows={saleReports?.data}
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
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (salesReportsError) {
    const error:any = salesReportsError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        {error.data?.message ?? "خطایی رخ داده است!"}
      </Box>
    );
  }

  return content;
};

export default SalesReports;
