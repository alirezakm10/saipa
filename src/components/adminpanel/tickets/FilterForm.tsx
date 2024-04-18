import { Box, Typography } from "@mui/material";
import Status from "./Status";
import Priority from "./Priority";
import AutocompleteRoleInput from "@/components/shared/AutocompleteRoleInput";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { OptionType, selectedFilterType } from "./typescope";
import ReplayIcon from "@mui/icons-material/Replay";
import { useAppDispatch } from "@/redux/hooks";

interface Props {
  setSelectedFilter: any;
  selectedFilter: selectedFilterType | null;
  refetch : any;
}

const FilterForm: React.FC<Props> = ({ setSelectedFilter, selectedFilter , refetch }) => {
  const formik = useFormik({
    initialValues: {
      status: selectedFilter?.status || null,
      priority: selectedFilter?.priority || null,
      role_id: selectedFilter?.role_id || null,
    },
    onSubmit: (values) => {
      setSelectedFilter(values);
      refetch()
    },
  });

  const handleChangeRole = (event: any, selectedRole: OptionType | null) => {
    formik.setFieldValue("role_id", selectedRole);
  };

  const resetFeildForm = (feild: string) => {
    formik.setFieldValue(feild, null);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">فیلتر</Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ padding: "5px" }}>
        <Box sx={{ py: 1, display: "flex", alignItems: "center" }}>
          <Status
            width="100%"
            label="وضعیت"
            statusValue={formik.values.status}
            hasAnswerdStatus={true}
            setStatusFieldValue={formik.setFieldValue}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("status")}
          />
        </Box>
        <Box sx={{ py: 1 , display: "flex", alignItems: "center" }}>
          <Priority
            label="اولویت"
            size="small"
            width="100%"
            name="priority"
            priorityValue={formik.values.priority}
            setPriorityFieldValue={formik.setFieldValue}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("priority")}
          />
        </Box>
        <Box sx={{ py: 1 }}>
          <AutocompleteRoleInput
            label="دپارتمان"
            width="100%"
            size="small"
            name="role_id"
            defaultValue={formik.values.role_id}
            handleAutocompleteChange={handleChangeRole}
          />
        </Box>

        <Box>
          <LoadingButton
            size="small"
            color="error"
            // loading={ticketLoading}
            loadingPosition="center"
            type="submit"
            variant="contained"
            sx={{ my: 2, width: "100%" }}
          >
            اعمال فیلتر
          </LoadingButton>
        </Box>
      </form>
    </>
  );
};

export default FilterForm;
