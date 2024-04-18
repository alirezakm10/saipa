import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '@/theme';
import { useGetProfileQuery } from '@/redux/services/profile/profileApi';

interface Props {
  width:string | number;
  height:string | number;
  my?: string | number;
}

 const UserAvatar: React.FC<Props> = ({width, height, my}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [profile , setProfile] = React.useState<any>(null)

  const {
    data: fetchedProfile,
    isSuccess,
    isLoading,
    error: fetchUserError,
  } = useGetProfileQuery("");

  React.useEffect(() => {
    if (isSuccess) {
      setProfile(fetchedProfile)
    }
  }, [fetchedProfile, isLoading]);

  return (
    <Stack direction="row" spacing={2} my={my} >
       <Box
        sx={{
          position: 'relative',
          width: width,
          height: height,
          borderRadius: '50%',
          overflow: 'hidden',
          border:`2px solid ${colors.primary[300]}`,
                  }}
      >
        
      <Avatar alt={profile?.name} src={profile?.photo?.download_link || ""}
       sx={{ width: width, height: height }}
      />
      <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust alpha value as needed
          }}
        />
      </Box>

    </Stack>
  );
}

export default UserAvatar;