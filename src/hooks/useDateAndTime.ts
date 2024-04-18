import { useState, useEffect } from 'react';
import PersianDate from 'persian-date';

export const useFormattedDate = (): string => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const persianDate = new PersianDate(currentDate, { calendar: 'persian' });

    // Format the Persian date
    const formattedDateStr = persianDate.format('YYYY/MM/DD');
    setFormattedDate(formattedDateStr);
  }, []);

  return formattedDate;
};

export const useFormattedTime = (): string => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const formattedTimeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setFormattedTime(formattedTimeStr);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return formattedTime;
};
