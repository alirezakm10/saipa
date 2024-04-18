'use client'
import React from 'react'
import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import styles from './style.module.scss'
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setShowSignout, selectShowSignout } from '@/redux/features/componentSlice';

const SignoutModal: React.FC = ({}) => {
const dispatch = useAppDispatch();

    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
const showSignout = useAppSelector(selectShowSignout)


    const animateVariants = {
        initial: {
            opacity:0,
            transition: {
                duration: 0.3,
              },
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
              },
         
          },
          hidden: {
              opacity:0,
              transition: {
                duration: 0.3,
              },
          }
        }

  return (
    
    <AnimatePresence>
      { showSignout && (<motion.div
          initial="initial"
          animate="visible"
          exit="hidden"
         variants={animateVariants}
        className={styles.singout_container} >
        <Paper className={styles.signout_form} >
            <Typography>آیا از خروج خود مطمئن هستید؟</Typography>
            <Box sx={{display:'flex', gap:2}} >
            <Button color='error' onClick={() => signOut()}  variant='contained' >بله</Button>
            <Button onClick={() => dispatch(setShowSignout())} variant='outlined' >خیر</Button>
            </Box>
        </Paper>
          </motion.div>)}
    </AnimatePresence>
  )
}

export default SignoutModal
