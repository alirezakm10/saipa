'use client'
import { tokens } from '@/theme';
import { Box, useTheme, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { LineChart, Line, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Granim from 'granim'
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';



const data = [
  {
    name: 'Page A',
    users: 4000,
    admins: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    users: 3000,
    admins: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    users: 2000,
    admins: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    users: 2780,
    admins: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    users: 1890,
    admins: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    users: 2390,
    admins: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    users: 3490,
    admins: 4300,
    amt: 2100,
  },
];

const RecentActivitiesChartCard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)


  useEffect(() => {
    new Granim({
      element: "#activity-card",
      direction: 'left-right',
      // @ts-ignore
      opacity: [1, 1],
      states: {
        "default-state": {
          gradients: [
            ['#31ecdd', '#7007b0'],
            ['#7007b0','#31ecdd'],
          ],
          transitionSpeed: 10000,
        }
      },
    })
  }, [])

  return (

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
        id='activity-card'
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
            height: '100%'
          }}
      >
            <ResponsiveContainer
             width="100%" height="100%"
             >
        <LineChart
          width={300}
          height={100}
          data={data}

        >
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey={`admins`} stroke="#0de5ff" strokeWidth={4} activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey={`users`} stroke="#4bdd8a" strokeWidth={4} />
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
          <SupervisorAccountOutlinedIcon fontSize='large' />
          <Typography component='h1' variant='subtitle1' noWrap >عاملان</Typography>
          <Typography component='h1' variant='subtitle2'>1243</Typography>
        </Box>
      </Box>
    </Box>
  );
}


export default RecentActivitiesChartCard