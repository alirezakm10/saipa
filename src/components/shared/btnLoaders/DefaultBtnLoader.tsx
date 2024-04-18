import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';

interface DefaultBtnLoaderProps {
  buttonSx?: React.CSSProperties;
  isUpdating: boolean;
  isSuccess: boolean;
  onClick: () => void;
}

const DefaultBtnLoader: React.FC<DefaultBtnLoaderProps> = ({
  buttonSx = {},
  isUpdating,
  isSuccess,
  onClick
}) => {
  const [loading, setLoading] = React.useState(false);

  // Reset the loading state when isUpdating or isSuccess changes
  React.useEffect(() => {
    if (isUpdating || isSuccess) {
      setLoading(false);
    }
  }, [isUpdating, isSuccess]);

  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      onClick();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button
          variant="contained"
          sx={{
            ...buttonSx,
            ...(!loading && { bgcolor: green[500] }),
          }}
          onClick={handleButtonClick}
        >
          ذخیره تغییرات
        </Button>
        {isUpdating && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default DefaultBtnLoader;
