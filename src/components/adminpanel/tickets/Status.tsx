import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  useCloseTicketMutation,
  useOpenTicketMutation,
} from "@/redux/services/tickets/ticketApi";
import useToast from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  size?: "small";
  hasAnswerdStatus?: boolean;
  id?: number;
  name?: string;
  statusValue?: string | null;
  width?: string | number;
  label?: string;
  hasPermission?: boolean;
  setStatusFieldValue?: (field: string, value: string) => void;
}

const Status: React.FC<Props> = ({
  statusValue,
  id,
  width,
  name = "",
  label,
  size = "small",
  hasPermission = true,
  setStatusFieldValue,
  hasAnswerdStatus,
}) => {
  const showToast = useToast();
  const [value, setValue] = useState<string>(statusValue || "");
  const [
    closeTicket,
    {
      isSuccess: closeTicketSuccess,
      isLoading: closeTicketLoading,
      isError: closeTicketIsError,
      error: closeTicketError,
      data: closeTicketResult,
    },
  ] = useCloseTicketMutation();

  const [
    openTicket,
    {
      isSuccess: openTicketSuccess,
      isLoading: openTicketLoading,
      isError: openTicketIsError,
      error: openTicketError,
      data: openTicketResult,
    },
  ] = useOpenTicketMutation();

  useEffect(() => {
    if (openTicketSuccess) {
      showToast(openTicketResult?.message, "success");
    }
    if (openTicketError) {
      const error: any = openTicketError;
      showToast(error.data?.message, "error");
      if (statusValue) {
        setValue(statusValue);
      }
    }
  }, [openTicketSuccess, openTicketError, openTicketResult]);

  useEffect(() => {
    if (closeTicketSuccess) {
      showToast(closeTicketResult?.message, "success");
    }
    if (closeTicketError) {
      const error: any = closeTicketError;
      showToast(error.data?.message, "error");
      if (statusValue) {
        setValue(statusValue);
      }
    }
  }, [closeTicketSuccess, closeTicketIsError, closeTicketResult]);

  useEffect(() => {
    if (statusValue) {
      setValue(statusValue);
    } else {
      setValue("");
    }
  }, [statusValue]);

  const handleChange = (event: SelectChangeEvent) => {
    if (id) {
      if (Number(event.target.value) === 1) {
        openTicket(id);
      } else {
        closeTicket(id);
      }
    }
    if (setStatusFieldValue) {
      setStatusFieldValue("status", event.target.value);
    }
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ width: width }} size={size}>
      {label ? (
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      ) : null}
      <Select
        labelId="status-label"
        id="status"
        disabled={!hasPermission}
        name={name}
        label={label ? label : null}
        value={value}
        onChange={handleChange}
      >
        <MenuItem value={1}>
          <Stack
            sx={{ color: hasPermission ? "#f44336" : "gray" }}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {openTicketLoading ? (
              <ClipLoader color="#f44336" size={10} />
            ) : (
              <RadioButtonCheckedIcon />
            )}

            <Typography variant="body1">باز</Typography>
          </Stack>
        </MenuItem>
        {hasAnswerdStatus ? (
          <MenuItem value={2}>
            <Stack
              sx={{ color: "#66bb6a" }}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {openTicketLoading ? (
                <ClipLoader color={"#f44336"} size={10} />
              ) : (
                <CheckCircleIcon />
              )}

              <Typography variant="body2">پاسخ داده شده</Typography>
            </Stack>
          </MenuItem>
        ) : null}
        <MenuItem value={3}>
          <Stack
            sx={{ color: "gray" }}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {closeTicketLoading ? (
              <ClipLoader color="gray" size={10} />
            ) : (
              <RemoveCircleIcon />
            )}

            <Typography variant="body1">بسته</Typography>
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default Status;
