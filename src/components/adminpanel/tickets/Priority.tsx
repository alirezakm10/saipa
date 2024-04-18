import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import SquareIcon from "@mui/icons-material/Square";
import { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import { useChangePriorityMutation } from "@/redux/services/tickets/ticketApi";
import { ClipLoader } from "react-spinners";

interface Props {
  size?: "small";
  id?: number;
  priorityValue?: string | null;
  width?: number | string;
  label?: string;
  name?: string;
  errorFormik?: boolean;
  helperText?: string | boolean;
  hasPermission?: boolean;
  setPriorityFieldValue?: (field: string, value: string) => void;
}

const Priority: React.FC<Props> = ({
  priorityValue,
  id,
  size,
  width,
  label,
  name = "",
  errorFormik,
  helperText,
  hasPermission = true,
  setPriorityFieldValue,
}) => {
  const showToast = useToast();
  const [value, setValue] = useState<string>(priorityValue || "");

  const items = [
    { value: 1, title: "کم", color: "#66bb6a" },
    { value: 2, title: "متوسط", color: "#ffa726" },
    { value: 3, title: "بالا", color: "#f44336" },
  ];

  useEffect(() => {
    if (priorityValue) {
      setValue(priorityValue);
    } else {
      setValue("");
    }
  }, [priorityValue]);

  const [
    changePriority,
    {
      isSuccess: prioritySuccess,
      isLoading: priorityLoading,
      isError: priorityIsError,
      error: priorityError,
      data: priorityResult,
    },
  ] = useChangePriorityMutation();

  useEffect(() => {
    if (prioritySuccess) {
      showToast(priorityResult?.message, "success");
    }
    if (priorityError) {
      const error: any = priorityError;
      showToast(error.data?.message, "error");
      if (priorityValue) {
        setValue(priorityValue);
      }
    }
  }, [prioritySuccess, priorityError, priorityResult]);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target?.value) {
      if (id) {
        changePriority({ id, body: { priority: event.target.value } });
      }
      if (setPriorityFieldValue) {
        setPriorityFieldValue("priority", event.target.value);
      }

      setValue(event.target.value);
    }
  };

  return (
    <FormControl style={{ width: width }} size={size}>
      {label ? (
        <InputLabel
          sx={{ color: errorFormik ? "red" : "" }}
          id="priority-label"
        >
          {label}
        </InputLabel>
      ) : null}
      <Select
        labelId="priority-label"
        name={name}
        type="search"
        id="prority"
        disabled={!hasPermission}
        value={value}
        onChange={handleChange}
        label={label ? label : null}
        error={errorFormik}
        // helperText={helperText}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <Stack direction="row" spacing={1} alignItems="center">
              {priorityLoading ? (
                <ClipLoader color={item.color} size={10} />
              ) : (
                <SquareIcon sx={{ width: "16px", color: item.color }} />
              )}
              <Typography variant="body1">{item.title}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
      {errorFormik ? (
        <FormHelperText error={errorFormik}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default Priority;
