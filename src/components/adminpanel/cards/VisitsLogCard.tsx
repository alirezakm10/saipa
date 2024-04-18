'use client'
import { tokens } from '@/theme';
import { Box, useTheme, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Granim from 'granim'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Link from 'next/link';

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

const VisitsLogCard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)


  useEffect(() => {
    new Granim({
      element: "#visit-card",
      direction: 'left-right',
      // @ts-ignore
      opacity: [1, 1],
      states: {
        "default-state": {
          gradients: [
            ['#7f31ec', '#6aff71'],
            ['#6aff71', '#7f31ec'],
          ],
          transitionSpeed: 10000,
        }
      },
    })
  }, [])

  return (

    <Link href={`/adminpanel/logs/visitslogs`} >
      <Box
        sx={{
          position: 'relative',
          display: "flex",
          overflow:'hidden',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: '.3s',
          height: '200px',
          bgcolor: colors.themeAccent[800],
          borderColor: colors.themeAccent[400],
          borderRadius:'10px',
          cursor: 'pointer',
          ':hover': {
            boxShadow: `3px 0 20px ${colors.blue[500]}`
          }
        }}
      >
        <canvas
          id='visit-card'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
        </canvas>
        <Box
          sx={{
            position:'relative',
            display:'flex',
            flexDirection:'row',
            p:1,
            width: '100%',
            hright: '100%'
          }}
        >
      
               <ResponsiveContainer
               width="100%" height="100%"
               >
                 <LineChart width={300}  height={100} data={data}>
                           <Line type="monotone" dataKey="pv" stroke="#ece8e2" strokeWidth={4} />
                         </LineChart>
               </ResponsiveContainer>
          <Box
          sx={{
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            mx:'auto',
            width:'70px'
          }}
          >
            <RemoveRedEyeOutlinedIcon fontSize='large' />
            <Typography component='h1' variant='subtitle1' noWrap >بازدید سایت</Typography>
            <Typography component='h1' variant='subtitle2'>1243</Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}


export default VisitsLogCard