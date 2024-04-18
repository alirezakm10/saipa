'use client'
import { Paper, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, useTheme } from "@mui/material";
import { tokens } from "@/theme";
import CircularProgressBar from "../progress/CircularProgressBar";
import { TransactionSvg } from "@/svg";
import ConstructionIcon from '@mui/icons-material/Construction';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CountertopsIcon from '@mui/icons-material/Countertops';


const CardFullH = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Paper
      sx={{position:'relative', bgcolor: colors.grey[900], height:'100%', width:'100%',p:1, borderRadius:'10px' }}
    >
      <Box sx={{display:'flex', justifyContent:'space-between'}} >
      <Typography>پرفروش ترین محصول</Typography>
        <Typography component='h1' variant="caption" >200 میلیون تومان</Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgressBar />
      </Box>
      <Box>
        <Typography mt={2} >محصولات پرفروش</Typography>
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' >
        <TransactionSvg />

        <List sx={{ width: '100%'}}>
      <ListItem sx={{ boxShadow: `1px 1px 3px ${colors.blue[500]}`, borderRadius:'10px' }} >
        <ListItemAvatar>
          <Avatar>
            <CountertopsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="خانه و آشپزخانه" secondary="چای ساز فلر" />
      </ListItem>
      <ListItem sx={{ boxShadow: `1px 1px 3px ${colors.blue[500]}`, my:1, borderRadius:'10px' }} >
        <ListItemAvatar>
          <Avatar>
            <CheckroomIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="پوشاک" secondary="هودی مشکی" />
      </ListItem>
      <ListItem sx={{ boxShadow: `1px 1px 3px ${colors.blue[500]}`, my:1, borderRadius:'10px' }} >
        <ListItemAvatar>
          <Avatar>
            <ConstructionIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="تجهیزات" secondary="جعبه ابزار همه کاره" />
      </ListItem>
    </List>

        </Box>
      </Box>
    </Paper>
  );
};

export default CardFullH;
