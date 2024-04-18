import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import ReplayIcon from "@mui/icons-material/Replay";
import { useAppDispatch } from "@/redux/hooks";
import { SelectedUserFilter } from "./typescope";

interface Props {
  setSelectedFilter: any;
  selectedFilter: SelectedUserFilter | null;
  refetch: any;
}

const FilterForm: React.FC<Props> = ({
  setSelectedFilter,
  selectedFilter,
  refetch,
}) => {
  const formik = useFormik({
    initialValues: {
      name: selectedFilter?.name || "",
      family: selectedFilter?.family || "",
      email : selectedFilter?.email || "",
      mobile: selectedFilter?.mobile || "",
      is_admin: selectedFilter?.is_admin ? true : false,
    },
    onSubmit: (values) => { 
      setSelectedFilter(values);
      refetch();
    },
  });

  const resetFeildForm = (feild: string) => {
    formik.setFieldValue(feild, "");
  };

  return (
    <>
      {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">فیلتر</Typography>
      </Box> */}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ pb: 1, display: "flex", alignItems: "center" }}>
          <TextField
            label="نام"
            name="name"
            size="small"
            sx={{ width: "100%" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("name")}
          />
        </Box>
        <Box sx={{ pb: 1, display: "flex", alignItems: "center" }}>
          <TextField
            label="نام خانوادگی"
            name="family"
            size="small"
            sx={{ width: "100%" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.family}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("family")}
          />
        </Box>

        <Box sx={{ pb: 1, display: "flex", alignItems: "center" }}>
          <TextField
            label="ایمیل"
            name="email"
            id="email"
            autoComplete="username"
            size="small"
            sx={{ width: "100%" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("email")}
          />
        </Box>

        <Box sx={{ pb: 1, display: "flex", alignItems: "center" }}>
          <TextField
            label="موبایل"
            placeholder=" 0912xxxxxxx "
            name="mobile"
            size="small"
            autoComplete="username"
            sx={{ width: "100%" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile}
          />
          <ReplayIcon
            color="success"
            sx={{ cursor: "pointer", mx: 1 }}
            onClick={() => resetFeildForm("mobile")}
          />
        </Box>

        <Box>
          <FormGroup
            style={{
              paddingRight: "30px",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormControlLabel
              style={{
                direction: "ltr",
                justifyContent: "flex-end",
              }}
              control={
                <Switch
                  color="success"
                  name="is_admin"
                  checked={formik.values?.is_admin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
              label="ادمین"
            />
          </FormGroup>
        </Box>

        <LoadingButton
          size="small"
          color="error"
          // loading={ticketLoading}
          loadingPosition="center"
          type="submit"
          variant="contained"
          sx={{ width: "100%" }}
        >
          اعمال فیلتر
        </LoadingButton>
      </form>
    </>
  );
};

export default FilterForm;
