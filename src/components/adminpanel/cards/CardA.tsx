'use client'
import React, { PropsWithChildren, ReactNode, useContext } from "react";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "@/theme";
import styles from './styles.module.scss'



const CardA:React.FC<PropsWithChildren> = ({children}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

  return (
    <Paper
    className={styles.cardA_container}
      sx={{
        display:'flex',
        bgcolor: colors.themeAccent[800],
        borderColor: colors.themeAccent[400],
        boxShadow:3
      }}
    >
      {children}
    </Paper>
  );
};

export default CardA;