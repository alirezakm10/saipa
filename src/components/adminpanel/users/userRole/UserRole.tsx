import useToast from "@/hooks/useToast";
import { useGetRolesQuery } from "@/redux/services/roles/roleApi";
import { useAssignRoleToUserMutation, useGetUserQuery } from "@/redux/services/users/usersApi";
import { tokens } from "@/theme";
import {
  Box,
  Button,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Role } from "../typescope";
import { LoadingButton } from "@mui/lab";

const UserRole = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [checkedIds, setCheckedIds] = React.useState<number[]>([]);
  const router = useRouter();

  const showToast = useToast();
  const { id } = useParams();

  const {
    data: fetchedUser,
    isSuccess,
    isLoading,
    error: fetchUserError,
  } = useGetUserQuery(id, { refetchOnMountOrArgChange: true });

  const {
    data: rolesList,
    isSuccess: rolesSuccessStatus,
    isLoading: rolesLoadingStatus,
    error: rolesError,
  } = useGetRolesQuery("", { refetchOnMountOrArgChange: true });

  const [
    assignRoleToUser,
    {
      isLoading: assignRoleToUserLoadingStatus,
      isSuccess: assignRoleToUserSuccessStatus,
      data : assignRoleToUserResult,
      error : assignRoleToUserError,
    },
  ] = useAssignRoleToUserMutation<any>();

  useEffect(() => {
    if (isSuccess && fetchedUser?.roles?.length > 0) {
      const ids = [...fetchedUser?.roles].map(
        (role: any) => role.id
      );
      setCheckedIds(ids);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (assignRoleToUserSuccessStatus) {
      showToast(assignRoleToUserResult?.message, "success");
    }
    if (assignRoleToUserError) {
      const errMsg = assignRoleToUserError?.data?.message ?? "خطایی رخ داده است!";
      showToast(errMsg , "error");
    }
  }, [assignRoleToUserSuccessStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    checkedIds.indexOf(id) === -1
      ? setCheckedIds([...checkedIds, id])
      : setCheckedIds([...checkedIds.filter((item: any) => item !== id)]);
  };

  const handleAssignRole = () => {
    assignRoleToUser({user_id : id , role_ids : checkedIds  })
  };

  let content;

  if (isLoading || rolesLoadingStatus) {
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

  if (fetchUserError || rolesError) {
    const error: any = fetchUserError ?? rolesError
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

  if (rolesSuccessStatus && isSuccess) {
    content = (
      <Paper
        sx={{
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
        }}
      >
        <CardContent>
          <Typography variant="h4">انتخاب نقش</Typography>
          <FormGroup>
            <Grid container spacing={1}>
              {rolesList.map((role: Role) => (
                <Grid key={role.id} item xs={12} sm={6} lg={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="success"
                        checked={checkedIds.includes(role.id)}
                        onChange={(e) => handleChange(e, role.id)}
                      />
                    }
                    label={role.name}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
          <Box sx={{ display : "flex" , justifyContent:"flex-end" , alignItems:"center" }} >
            <LoadingButton
              size="small"
              disabled={assignRoleToUserLoadingStatus}
              loading={assignRoleToUserLoadingStatus}
              loadingPosition="center"
              type="submit"
              variant="contained"
              sx={{ my: 2, mx: 1 }}
              onClick={handleAssignRole}
            >
              ثبت
            </LoadingButton>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => router.push("/adminpanel/users") }
            >
              انصراف
            </Button>
          </Box>
        </CardContent>
      </Paper>
    );
  }

  return content;
};

export default UserRole;
