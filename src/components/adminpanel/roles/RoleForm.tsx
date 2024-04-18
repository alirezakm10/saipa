import {
  Button,
  CardContent,
  Grid,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "@/theme";
import { LoadingButton } from "@mui/lab";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { validationSchema } from "./validationSchema";
import { Role } from "./typescope";
import { useEffect } from "react";

interface Props {
  isLoading: boolean;
  formValues?: any;
  editMode?: boolean;
  handleSubmit: (values: Role) => void;
}

const RoleForm: React.FC<Props> = ({ isLoading , handleSubmit , formValues }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {

    if (formValues) {
      formik.setValues({
        ...formik.values,
        name: formValues.name || "",
      });
    }
  }, [formValues]);

  return (
    <Grid container spacing={1} sx={{ justifyContent: "center" }}>
      <Grid item xs={12} sm={8}>
        <Paper
          sx={{
            border: `1px solid ${colors.primary[300]}`,
            borderRadius: "5px",
            mt: 3,
            position: "relative",
          }}
        >
          <CardContent>
            <form
              style={{
                width: "100%",
              }}
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                label="عنوان نقش"
                name="name"
                sx={{ my: 1, width: "100%" }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => router.back()}
              >
                انصراف
              </Button>

              <LoadingButton
                size="small"
                disabled={isLoading}
                loading={isLoading}
                loadingPosition="center"
                type="submit"
                variant="contained"
                sx={{ my: 2, mx: 1 }}
              >
                ثبت
              </LoadingButton>
            </form>
          </CardContent>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RoleForm;
