'use client'
import { useEffect, useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/services/shop/productsApi";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { Box, Button, Chip, Stack, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import usePermission from "@/hooks/usePermission";

interface ISpecification {
  specification_id: number;
  value: string;
}

interface IShowSpecifications {
  specificationsArr: ISpecification[];
}

const ShowSpecifications: React.FC<IShowSpecifications> = ({
  specificationsArr,
}) => {
  return (
    <Box display="flex" gap="10px">
      {/* <Typography>کلمات کلیدی</Typography> */}
      {/* <Divider /> */}
      {specificationsArr.length > 0 ? (
        specificationsArr?.map((item: any, idx: number) => (
          <Chip sx={{ width: "auto" }} key={idx} label={item.value} />
        ))
      ) : (
        <Chip label="برچسبی ثبت نگردیده." />
      )}
    </Box>
  );
};

const GridView = () => {
  const showToast = useToast();
  const {hasPermission} = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  // get queries
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : productsError,
  } = useGetProductsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  // mutation queries
  const [
    deleteProduct,
    {
      isSuccess: deleteStatus,
      isLoading: deleteLoader,
      error: deleteError,
      data: deleteResult,
    },
  ] = useDeleteProductMutation<any>();

  const handleDelete = (id: number) => {};
  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "تصویر",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (product : any) => {
        const filteredPhoto = product.row.images.filter(
          (photo: any) => photo.is_default == 1
        )[0];
        return (
          <Box position="relative" width="100px" height="60px">
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
      headerName: "نام",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (product : any) => product.row.title,
    },
    {
      field: "col3",
      headerName: "موجودی انبار",
      headerAlign:"center",
      align: "center",
      width: 130,
      renderCell: (product : any) => (
        <Chip
          label={product.row.inventory || "ناموجود"}
          color={product.row.inventory > 0 ? "success" : "error"}
          sx={{ minWidth: "60px" }}
        />
      ),
    },
    {
      field: "col4",
      headerName: "قیمت ",
      headerAlign:"center",
      align: "center",
      width: 100,
      valueGetter: (product : any) => product.row.price,
    },
    {
      field: "col5",
      headerName: "دسته ",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (product : any) => product.row.category ?? "ندارد",
    },


  { field: "col6", headerName: "تخفیف", width: 80,
  headerAlign: "center",
  align: "center",
valueGetter: (product : any )=> product.row.discount ?? 'ندارد'
},
    { field: "col7", headerName: "تاریخ انتشار ", width: 100,
    headerAlign: "center",
    align: "center",
  valueGetter: (product : any) => new DateObject(new Date(product.row.publish_time))
  .convert(persian, persian_fa)
  .format()
  },
  hasPermission("Keyword.index") ?  {
      field: "col8",
      headerName: "برچسب ها",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (product : any) => (
      <ParentMenu buttonTitle="مشاهده" color="warning">
          <div style={{ maxWidth: "250px", padding: "10px 15px" }}>
            <ShowSpecifications
              specificationsArr={
                product.row.specifications ? product.row.specifications : ""
              }
            />
          </div>
        </ParentMenu>
      ),
    } : undefined,
    hasPermission("Product.edit") && hasPermission("Product.delete") ? {
      field: "col9",
      headerName: "عملیات",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (product : any) => (
        <Stack direction="row" spacing={2}>
          <Link href={`/adminpanel/shop/updateproduct/${product.row.id}`}>
          { hasPermission("Product.edit") &&  <Button
              variant="outlined"
              color="warning"
              startIcon={<BorderColorIcon />}
            >
              ویرایش
            </Button>}
          </Link>
         {hasPermission("Product.delete")  && <ConfirmModal
            // modalTitle={product.row.col2}
            description={`آیا از حذف ${product.row.title} مطمئن هستید؟`}
            color="error"
            icon={<DeleteIcon />}
            ctaLoader={deleteLoader}
            btnTitle="حذف"
            setter={() => deleteProduct(product.row.id)}
          />}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];
  

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(products?.meta.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      products?.meta.total !== undefined
        ? products?.meta.total
        : prevRowCountState
    );
  }, [products?.meta.total, setRowCountState]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
    if (deleteError) {
      showToast(deleteError?.data.message, "error");
    }
  }, [deleteStatus, deleteError]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  let content;

  if (isSuccess) {
    content = (
      <DataGrid
        autoHeight
        rowHeight={80}
        {...products?.data}
        rows={products?.data}
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

  if (productsError) {
    const error:any = productsError;
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

export default GridView;
