'use client'
import { tokens } from '@/theme';
import { Box, useTheme,Typography } from '@mui/material'
import { ClockLoader } from 'react-spinners'
// i should create rest of the react spinner loaders in future like
// HashLoader, PuffLoader, RingLoader

interface ITimeLoader {
  size?: number;
  title?:string;
}

const TimeLoader:React.FC<ITimeLoader> = ({size, title = 'بارگذاری...'}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
    width='100%'
    height='100%'
    display="flex"
    flexDirection='column'
    justifyContent="center"
    alignItems="center"
    gap={2}
    padding={2}
    sx={{userSelect:'none'}}
  >
    <ClockLoader  
    size={size ? size : 50} 
    color={colors.themeAccent[500]}
    speedMultiplier= {1}
    />
    <Typography component='h1' variant='h4'  >{title}</Typography>
  </Box>
  )
}

export default TimeLoader