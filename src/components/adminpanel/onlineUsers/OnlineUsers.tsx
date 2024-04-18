'use client'
import * as React from 'react';
import { Box, Paper, Typography, Avatar, AvatarGroup, useTheme } from '@mui/material'
import { tokens } from '@/theme';
import { useGetUsersSignInsQuery } from '@/redux/services/users/usersApi';

function clampAvatars<T>(
  avatars: Array<T>,
  options: { max?: number; total?: number } = { max: 5 },
) {
  const { max = 5, total } = options;
  let clampedMax = max < 2 ? 2 : max;
  const totalAvatars = total || avatars.length;
  if (totalAvatars === clampedMax) {
    clampedMax += 1;
  }
  clampedMax = Math.min(totalAvatars + 1, clampedMax);
  const maxAvatars = Math.min(avatars.length, clampedMax - 1);
  const surplus = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0);
  return { avatars: avatars.slice(0, maxAvatars).reverse(), surplus };
}


const OnlineUsers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dataFromTheServer = {
    people: [
      {
        alt: 'Remy Sharp',
        src: '/assets/images/users/user1.jpeg',
      },
      {
        alt: 'Travis Howard',
        src: '/assets/images/users/user2.jpg',
      },
      {
        alt: 'Agnes Walker',
        src: '/assets/images/users/user3.jpg',
      },
      {
        alt: 'Trevor Henderson',
        src: '/assets/images/users/user4.jpg',
      },
      {
        alt: 'Trevor Henderson',
        src: '/assets/images/users/user5.jpg',
      },
      {
        alt: 'Trevor Henderson',
        src: '/assets/images/users/user6.jpg',
      },
    ],
    total: 24,
  };
  const { avatars, surplus } = clampAvatars(dataFromTheServer.people, {
    max: 5,
    total: dataFromTheServer.total,
  });


  return (

    <Box sx={{ display: 'flex',border:`1px solid ${colors.primary[200]}`, borderRadius:'10px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p:1, width: '100%', height: '100%' }}>
      <Typography>کاربران آنلاین</Typography>
      <AvatarGroup>
        {avatars.map((avatar) => (
          <Avatar key={avatar.alt} {...avatar} />
        ))}
        {!!surplus && <Avatar>+{surplus}</Avatar>}
      </AvatarGroup>
    </Box>

  )
}

export default OnlineUsers