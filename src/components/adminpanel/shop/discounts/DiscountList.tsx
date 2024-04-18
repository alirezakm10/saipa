"use client";
import { useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Grid,
  Box,
  Typography,
  useTheme
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
// import { useGetGuarantiesQuery, useDeletediscountMutation } from '@/redux/services/shop/discountApi'
import { useGetDiscountsQuery, useDeleteDiscountMutation } from "@/redux/services/shop/discountApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "@/theme";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const DiscountList = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const showToast = useToast()
  const {data:discounts, isSuccess, isLoading, isFetching, isError, error} = useGetDiscountsQuery('')
  const [
    deleteDiscount,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteDiscountMutation<any>()
  const deleteHandler = (id: number): void => {
    deleteDiscount(id)
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign:"center",
      align: "center",
      width: 50,
      valueGetter: (discount) => discount.id,
    },
    {
      field: "col2",
      headerName: "نام تخفیف",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (discount) => discount.row.code,
    },
    {
      field: "col3",
      headerName: "مدت زمان",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (discount) =>  new DateObject(new Date(discount.row.expiration_date))
      .convert(persian, persian_fa)
      .format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      field: "col4",
      headerName: "وضعیت",
      headerAlign:"center",
      align: "center",
      width: 70,
      valueGetter: (discount) => discount.row.status === 1 ? 'فعال': 'غیرفعال',
    },
    {
      field: "col5",
      headerName: "مبلغ تخفیف",
      headerAlign:"center",
      align: "center",
      width: 100,
      valueGetter: (discount) => discount.row.amount,
    },
    {
      field: "col6",
      headerName: "حداقل مبلغ اجرا",
      headerAlign:"center",
      align: "center",
      width: 100,
      valueGetter: (discount) => discount.row.minimum_purchase_amount,
    },
    {
      field: "col7",
      headerName: "عملیات",
      headerAlign:"center",
      align: "center",
      width: 250,
      renderCell: (discount) => (
        <Stack direction="row" spacing={2}>
          <Link href={`/adminpanel/shop/discount/update-discount/${discount.row.id}`}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<BorderColorIcon />}
            >
              ویرایش
            </Button>
          </Link>
          <ConfirmModal
            modalTitle={discount.row.name}
            description="آیا از حذف مطمئن هستید؟"
            color="error"
            icon={<DeleteIcon />}
            
            btnTitle="حذف"
            setter={() => deleteHandler(discount.row.id)}
            ctaLoader={deleteLoader}
          />
        </Stack>
      ),
    },
  ];

  
  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{justifyContent:'space-between'}}>
         <Link href='/adminpanel/shop/discount/add-discount' >
           <Button
                  variant='outlined'
                  color='primary'
                   endIcon={<AddCircleOutlineIcon />}
                 >
                   افزودن تخفیف
                 </Button>
         </Link>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
 
  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

let content;

if(isSuccess){
  content = (
    <Grid container  >
      <DataGrid
      autoHeight
      rows={discounts?.data}
      columns={columns}
      loading={isLoading}
      slots={{
        toolbar: CustomToolbar,
      }}
      paginationMode='server'
      pageSizeOptions={[10,20,30]}
      />
    </Grid>
  )
}

return(
  <>
   <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb:1,
          pb:1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            لیست تخفیفات
        </Typography>
      </Box>
      { content}
  </>
)
}

export default DiscountList