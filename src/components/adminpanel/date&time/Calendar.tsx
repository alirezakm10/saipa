'use client'
import { Calendar as CalendarPackage } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/purple.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "@mui/material";
import { tokens } from "@/theme";

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const palleteMode = theme.palette.mode;


  return (
    <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center',padding:'3px'}} >
        <CalendarPackage
        calendar={persian}
        locale={persian_fa}
        className={`purple ${palleteMode === "dark" ? "bg-dark" : ""}`}
      />
    </div>
  )
}

export default Calendar