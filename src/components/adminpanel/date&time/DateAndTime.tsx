'use client'
import { Paper, Typography, useTheme } from "@mui/material";
import Calendar from "./Calendar";
import { useFormattedDate, useFormattedTime } from "@/hooks/useDateAndTime"; // Adjust the path as needed
import AnalogClock from "./AnalogClock";
import { Swiper, SwiperSlide } from "swiper/react";

const DateAndTime: React.FC = () => {
  const formattedDate = useFormattedDate(); // Using the custom hook for formatted date
  const formattedTime = useFormattedTime(); // Using the custom hook for formatted time

  return (
    <Paper
      elevation={6}
     sx={{display:'flex', justifyContent:'center'}}
    >
      <div style={{width:'300px',height:'100%'}} >
        <Swiper slidesPerView={1} grabCursor={true}>
          <SwiperSlide style={{height:'fit-content'}} >
            <Typography variant="h3" margin='auto auto 20px auto' textAlign='center' >{formattedDate}</Typography>
            {/* <AnalogClock /> */}
          </SwiperSlide>
          <SwiperSlide>
            <Typography>{formattedTime}</Typography>
            <Calendar />
          </SwiperSlide>
        </Swiper>
      </div>
    </Paper>
  );
};

export default DateAndTime;
