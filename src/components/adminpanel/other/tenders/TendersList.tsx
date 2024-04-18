"use client";
import { useState, useEffect } from "react";
import {
  useGetAllTendersQuery,
  useDeleteTenderMutation,
} from "@/redux/services/other/tenders/tendersApi";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridRowSelectionModel,
  GridRowId,
} from "@mui/x-data-grid";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import {
  Box,
  Button,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import EditRoadOutlinedIcon from "@mui/icons-material/EditRoadOutlined";
import DefaultModal from "@/components/shared/modals/DefaultModal";
import { tokens } from "@/theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import usePermission from "@/hooks/usePermission";

const TendersList = () => {
  const [selectedItems, setSelectedItems] = useState<GridRowId[]>([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [updateOrderModal, setUpdateOrderModal] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: tenders,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error: tendersError,
  } = useGetAllTendersQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [
    deleteTender,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteTenderMutation<any>();

  const deleteHandler = (id: number): void => {
    deleteTender(id);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ position: "sticky", top: 0, justifyContent: "space-between" }}
      >
        {hasPermission("Tender.create") && (
          <Link href="/adminpanel/other/tenders/add-tender">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddCircleOutlineIcon />}
            >
              افزودن  
            </Button>
          </Link>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GridToolbarExport />
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }

  // Import the detectNumberType function
function detectNumberType(number:number | string) {
  switch (number) {
    case 1:
      return 'مزایده';
    case 2:
      return 'مناقصه';
    case 3:
      return 'رویداد';
    case 4:
      return 'اطلاعیه';
    case 5:
      return 'تقویم';
    default:
      return 'نامعلوم';
  }
}

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 20,
      headerAlign: "center",
      align: "center",
      valueGetter: (tender: any) => tender.row.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (tender: any) => tender.row.title,
    },
    {
      field: "col3",
      headerName: "خلاصه توضیحات",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (tender: any) => tender.row.short_description,
    },
    {
      field: "col4",
      headerName: "نوع",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (tender: any) => detectNumberType(tender.row.type),
    },
    {
      field: "col5",
      headerName: "تاریخ ثبت ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (tender: any) =>
        new DateObject(new Date(tender.row.created_at))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    hasPermission("Tender.edit") && hasPermission("Tender.delete")
      ? {
          field: "col6",
          headerName: "عملیات",
          width: 250,
          headerAlign: "center",
          align: "center",
          renderCell: (tender: any) => (
            <Stack direction="row" spacing={2}>
              {hasPermission("Tender.edit") && (
                <Link
                  href={`/adminpanel/other/tenders/update-tender/${tender.row.id}`}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<BorderColorIcon />}
                  >
                    ویرایش
                  </Button>
                </Link>
              )}

              {hasPermission("Tender.delete") && (
                <ConfirmModal
                  modalTitle={tender.row.name}
                  description="آیا از حذف مطمئن هستید؟"
                  color="error"
                  icon={<DeleteIcon />}
                  btnTitle="حذف"
                  setter={() => deleteHandler(tender.row.id)}
                  ctaLoader={deleteLoader}
                />
              )}
            </Stack>
          ),
        }
      : undefined,
  ].filter(Boolean) as GridColDef[];

  const handleSelectedRows = (items: GridRowSelectionModel) => {
    setSelectedItems(items)
  }

  const [rowCountState, setRowCountState] = useState(tenders?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      tenders?.total !== undefined ? tenders?.total : prevRowCountState
    );
  }, [tenders?.total, setRowCountState]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
           لیست مزایدات, مناقصات, رویدادها, اطلاعیه ها, و تقویم ها
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...tenders?.data}
          rows={tenders?.data}
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
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (tendersError) {
    const error: any = tendersError;
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

export default TendersList;
