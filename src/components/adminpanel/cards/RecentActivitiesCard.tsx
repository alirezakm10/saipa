"use client";
import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "@/theme";
import styles from "./styles.module.scss";
import { LogBarSvg } from "@/svg";
import Link from "next/link";

const RecentActivitiesCard: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Paper
      className={styles.filemanagercard_container}
      sx={{
        position:'relative',
        display: "flex",
        transition:'.3s',
        height:'200px',
        bgcolor: colors.themeAccent[800],
        borderColor: colors.themeAccent[400],
        cursor:'pointer',
        ':hover':{
            boxShadow:`3px 0 20px ${colors.blue[500]}`
        }
      }}
    >

        <Typography component='h1' variant="h4">فعالیت های اخیر</Typography>
        <Grid container spacing={1} >
        <Grid xs={12} item >
        <Link href={`/adminpanel/recent-activities/admin/1`} >
          <Button
          variant="outlined"
          fullWidth
          sx={{
            height:'30px'
          }}
          >فروشگاه</Button>
          </Link>
        </Grid>
        <Grid xs={12} item >
          <Link href={`/adminpanel/recent-activities/admin/2`} >
            <Button
            variant="outlined"
            fullWidth
            sx={{
              height:'30px'
            }}
            >محتوا</Button>
          </Link>
        </Grid>
        <Grid xs={12} item >
        <Link href={`/adminpanel/recent-activities/admin/3`} >
          <Button
          variant="outlined"
          fullWidth
          sx={{
            height:'30px'
          }}
          >تیکت ها</Button>
          </Link>
        </Grid>
        <Grid xs={12} item >
        <Link href={`/adminpanel/recent-activities/admin/4`} >
          <Button
          variant="outlined"
          fullWidth
          sx={{
            height:'30px'
          }}
          >کاربران</Button>
          </Link>
        </Grid>
       
       
        </Grid>
        <Box
          sx={{
            background: colors.themeAccent[300],
            right: "-30px",
            boxShadow:`3px 0 90px ${colors.blue[500]}`,
          }}
          className={styles.icon_container}
        >
          <LogBarSvg width={120} />
        </Box>
      </Paper>
  );
};

export default RecentActivitiesCard;
