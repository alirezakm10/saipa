'use client'
import React from 'react';
import { Box, useTheme } from '@mui/material';
import styles from './styles.module.scss';
  import { tokens } from "@/theme";
import { useSession } from 'next-auth/react';

const BottomBar = () => {
  const { data: session, status } = useSession()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const themeMode = theme.palette.mode;

let content;

if(session && status){
  content= (
    <Box
    className={styles.bottombar_container}
    sx={{background:colors.themeAccent[700],
      color:themeMode === 'light' ? 'white' : 'inherit'
    }}
    >
        کلیه حقوق این سایت متعلق به شرکت مجهول می باشد
    </Box>
  )
}

  return content;
}

export default BottomBar