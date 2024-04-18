import {
  useGetTicketsQuery,
  useReferTicketMutation,
} from "@/redux/services/tickets/ticketApi";
import { tokens } from "@/theme";
import { ITablePaginationMode } from "@/types";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowId,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import Priority from "./Priority";
import Status from "./Status";
import AutocompleteRoleInput from "@/components/shared/AutocompleteRoleInput";
import { useRouter } from "next/navigation";
import { OptionType } from "@/components/shared/AutocompleteRoleInput/typescope";
import useToast from "@/hooks/useToast";
import InboxIcon from "@mui/icons-material/Inbox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterMenu from "@/components/shared/filterMenu/FilterMenu";
import FilterForm from "./FilterForm";
import { selectedFilterType } from "./typescope";
import { ClipLoader } from "react-spinners";
import usePermission from "@/hooks/usePermission";

const Tickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const [rowId, setRowId] = useState<GridRowId>();

  const [selectedFilter, setSelectedFilter] =
    useState<selectedFilterType | null>(null);
  const {
    data: ticketsList,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    refetch,
    error: ticketError,
  } = useGetTicketsQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
      status: selectedFilter?.status,
      priority: selectedFilter?.priority,
      role_id: selectedFilter?.role_id?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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

  const [rowCountState, setRowCountState] = useState(ticketsList?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      ticketsList?.total !== undefined ? ticketsList?.total : prevRowCountState
    );
  }, [ticketsList?.total, setRowCountState]);

  useEffect(() => {
    if (referSuccess) {
      showToast(referResult?.message, "success");
    }
    if (referError) {
      const error: any = referError;
      showToast(error.data?.message ?? "خطایی رخ داده است!", "error");
    }
  }, [referSuccess, referError, referResult]);

  const handleRowClick: GridEventListener<"rowClick"> = (
    params,
    event,
    details
  ) => {
    if (hasPermission("Ticket.create"))
      router.push(`/adminpanel/tickets/messages/${params.id}`);
  };

  const handleCellClick: GridEventListener<"cellClick"> = (params, event) => {
    if (params.field === "department") {
      event.stopPropagation();
      setRowId(params.id);
    }
  };

  const handleChangeRole = (event: any, selectedRole: OptionType | null) => {
    if (selectedRole?.id) {
      referTicket({ id: rowId, body: { role_id: selectedRole?.id } });
    }
  };

  const handleDeleteFilter = (filterItem: any) => {
    if (selectedFilter) {
      if (filterItem.status) {
        setSelectedFilter({ ...selectedFilter, status: null });
      }
      if (filterItem.priority) {
        setSelectedFilter({ ...selectedFilter, priority: null });
      }
      if (filterItem.role_id) {
        setSelectedFilter({ ...selectedFilter, role_id: null });
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "عنوان",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (ticket) => ticket.row.title,
    },
    {
      field: "date",
      headerName: "تاریخ ایجاد",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (ticket) =>
        new DateObject(new Date(ticket.row.created_at))
          .convert(persian, persian_fa)
          .format(),
    },
    {
      field: "subject",
      headerName: "موضوع",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (ticket) => ticket.row.subject?.name,
    },
    {
      field: "department",
      headerName: "دپارتمان",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (ticket) => (
        <AutocompleteRoleInput
          size="small"
          width="200px"
          defaultValue={ticket.row.role}
          error={referError}
          hasPermission={hasPermission("Ticket.edit")}
          handleAutocompleteChange={handleChangeRole}
        />
      ),
    },
    {
      field: "status",
      headerName: "وضعیت",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (ticket) =>
        ticket.row.status !== 2 ? (
          <Status
            statusValue={ticket.row.status}
            id={ticket.row.id}
            width={"120px"}
            hasPermission={hasPermission("Ticket.edit")}
          />
        ) : (
          <Stack
            sx={{ color: "#66bb6a" }}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <CheckCircleIcon />
            <Typography variant="body2">پاسخ داده شده</Typography>
          </Stack>
        ),
    },
    {
      field: "priority",
      headerName: "اولویت",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (ticket) => (
        <Priority
          priorityValue={ticket.row.priority}
          id={ticket.row.id}
          size="small"
          width={120}
          hasPermission={hasPermission("Ticket.edit")}
        />
      ),
    },
    {
      field: "unread",
      headerName: "خوانده نشده",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (ticket) =>
        ticket.row.unread_messages?.length == 0 ? null : (
          <Chip
            label={ticket.row.unread_messages?.length}
            sx={{ minWidth: "50px" }}
            color="success"
          />
        ),
    },
  ];
  let filterChipContent;
  if (selectedFilter) {
    const selectedFilterArray = Object.entries(selectedFilter).map((e) => ({
      [e[0]]: e[1],
    }));
    filterChipContent =
      selectedFilterArray?.length > 0
        ? selectedFilterArray?.map((filterItem, index) => {
            if (Object.values(filterItem)[0] !== null) {
              let label;
              if (filterItem.status) {
                label = `وضعیت : ${
                  filterItem.status === 1
                    ? "باز"
                    : filterItem.status == 2
                    ? "پاسخ داده شده"
                    : "بسته"
                }`;
              }
              if (filterItem.priority) {
                label = `اولویت : ${
                  filterItem.priority === 1
                    ? "کم"
                    : filterItem.priority == 2
                    ? "متوسط"
                    : "بالا"
                }`;
              }
              if (filterItem.role_id) {
                label = filterItem.role_id.name;
              }
              return (
                <Chip
                  label={label}
                  variant="outlined"
                  onDelete={() => handleDeleteFilter(filterItem)}
                  key={index}
                  sx={{ mx: 1 }}
                  deleteIcon={
                    isLoading ? <ClipLoader size={10} /> : <CloseIcon />
                  }
                />
              );
            }
          })
        : null;
  }

  let content;

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

  if (ticketError) {
    const error:any = ticketError;
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

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
          }}
        >
          <FilterMenu
            title="فیلتر"
            icon={<FilterAltIcon />}
            isFetching={isFetching}
          >
            <FilterForm
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              refetch={refetch}
            />
          </FilterMenu>

          {filterChipContent}
        </Box>
        <DataGrid
          autoHeight
          rowCount={rowCountState}
          {...ticketsList?.data}
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
          rows={ticketsList?.data}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onRowClick={handleRowClick}
          onCellClick={handleCellClick}
          sx={{
            // disable cell selection style
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            // pointer cursor on ALL rows
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
        />
      </>
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
          <InboxIcon sx={{ mx: 1 }} /> تیکت ها
        </Typography>
        {hasPermission("Ticket.create") && (
          <Button
            variant="contained"
            onClick={() => router.push("/adminpanel/tickets/createticket")}
          >
            ایجاد تیکت
          </Button>
        )}
      </Box>
      {content}
    </>
  );
};

export default Tickets;
