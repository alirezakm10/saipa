'use client'
import { Box, Chip, Divider, Typography } from '@mui/material';
import React from 'react'
import { Keyword } from '../shop/classification/categories/typescope';


interface ShowKeywordsProps {
    keywordsArray: Keyword[];
  }
  

const ShowKeywords:React.FC<ShowKeywordsProps> = ({keywordsArray}) => {
  return (
    <Box display="flex" flexDirection="column" gap="10px" sx={{
        p:1,
        borderRadius:'10px'
    }}>
    {
        keywordsArray.length === 0 && <Typography>ندارد</Typography>
        
    }
    {keywordsArray?.map((item: any, idx: number) => (
      <Chip key={idx} label={item.keyword} />
    ))}
  </Box>
  )
}

export default ShowKeywords
