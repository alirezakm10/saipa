'use client'
import {
  CircularProgressbar,
} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "@/theme";
import { useContext } from "react";
import { Animate } from 'react-move';
import {Box} from "@mui/material";

const AnimatedCircularProgressbar: React.FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const palleteMode =  theme.palette.mode


  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const step = value / 100; // Adjust the step for finer animation control

    const interval = setInterval(() => {
      startValue += step;
      if (startValue >= value) {
        clearInterval(interval);
        startValue = value;
      }
      setDisplayValue(startValue);
    },20); // Adjust the interval for smoother animation

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return (
    <Animate // Use Animate
      start={{ value: 0 }} // Initial value for animation
      enter={{ value: displayValue }} // Final value for animation
      update={{ value: displayValue }} // Update value when it changes
    >
      {({ value }) => (
        <CircularProgressbar
          value={value}
          text={`${Math.round(value)}%`}
          styles={{
            root: {
      filter:`drop-shadow(3px 0 10px ${colors.blue[500]})`

            },
            path: {
              stroke: `rgba(62, 152, 199, ${value / 100})`,
              strokeLinecap: 'round',
              strokeWidth:5,
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#d6d6d6',
              strokeLinecap: 'butt',
              strokeWidth:2,
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '',
              fontSize: '16px',
            },
            background: {
              fill: colors.themeAccent[600],
            },
          }}
         
          
        />
      )}
    </Animate>
  );
};


const CircularProgressBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
    const percentage = 90;
    const [value, setValue] = useState(0)

   
  useEffect(() => {
    if (value < percentage) {
      const timer = setTimeout(() => {
        setValue(percentage);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Box width='50%'  >
      <AnimatedCircularProgressbar value={value} />
    </Box>
    ) 
    
  
};

export default CircularProgressBar;
