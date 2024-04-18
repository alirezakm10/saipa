'use client'
import {
  CardFullH,
} from "@/components/adminpanel/cards";
import DateAndTime from "@/components/adminpanel/date&time/DateAndTime";
import OnlineUsers from "@/components/adminpanel/onlineUsers/OnlineUsers";
import RecentTickets from "@/components/adminpanel/recentTickets/RecentTickets";
import VisitsLogCard from "@/components/adminpanel/cards/VisitsLogCard";
import { Box, Grid, Typography } from "@mui/material";
import OrdersList from "@/components/adminpanel/shop/orders/OrdersList";
import SystemPresureCard from "@/components/adminpanel/cards/SystemPresureCard";
import RecentActivitiesChartCard from "@/components/adminpanel/cards/RecentActivitiesChartCard";
import RecentActivitiesCard from "@/components/adminpanel/cards/RecentActivitiesCard";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/helpers/authOptions";
import { useSession } from "next-auth/react";

const Home =  () => {

const {data: session, status } = useSession()

 if(status === 'unauthenticated'){
  redirect('/auth/admin/signin')
 }

  let content

  if (status === 'authenticated') {
    content = (
      <>
        <Box
          sx={{
            position:'relative',
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid white`,
          }}
        >
          <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            صفحه اصلی
          </Typography>

        </Box>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={6} md={4} >
                <VisitsLogCard />
              </Grid>
              <Grid item xs={12} sm={6} md={4} >
                <RecentActivitiesChartCard />
              </Grid>
              <Grid item xs={12} sm={6} md={4} >
                <SystemPresureCard />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={12} md={4} lg={4} >
                <RecentTickets />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} >
                <CardFullH />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} >
                <Grid container direction='column' spacing={2} >
                  <Grid item >
                    <OnlineUsers />
                  </Grid>
                  <Grid item >
                    <RecentActivitiesCard />
                  </Grid>
                  <Grid item >
                    <DateAndTime />
                  </Grid>
                  <Grid item >
                    <Box sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '10px',
                      width: '100%',
                      height: '300px',
                      border: '1px solid white'
                    }}>
                      Empty Module
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} >
              <OrdersList />
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  return content
}

export default Home