import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Divider,
    InputBase,
    Paper,
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import MailIcon from '@mui/icons-material/Mail';
  import { useNavigate } from 'react-router-dom';
  
  const RightSidebar = () => {
    const navigate = useNavigate();
  
    const handleMessagesClick = () => {
      navigate('/messages');
    };
  
    return (
      <Box
        sx={{
          width: 300,
          paddingTop: 2,
          px: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'fixed',
          right:50,
        }}
      >
        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50px',
            backgroundColor: '#EFF3F4',
            px: 2,
            py: 0.5,
            height:50,
          }}
        >
          <SearchIcon fontSize="small" sx={{ color: '#536471' }} />
          <InputBase
            placeholder="Search"
            sx={{
              ml: 1,
              fontSize: 14,
              flex: 1,
            }}
          />
        </Paper>
  
        {/* Subscribe to Premium */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            // height:200,
            

          }}
        >
          <CardContent sx={{ py: 1.5 }}>
            <Typography variant="h5" fontWeight="bold">
              Subscribe to Premium
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
              Subscribe to unlock new features and if eligible, receive a share of revenue.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="small"
              sx={{ textTransform: 'none', borderRadius: '9999px' }}
            >
              Subscribe
            </Button>
          </CardContent>
        </Card>
  
        {/* What's happening */}
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <CardContent sx={{ py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              What’s happening
            </Typography>
  
            {/* Trending items */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                #٥٠_سنة_يشتعل_علشانك_في_صمت
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2,022 posts
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ my: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                ناصر منسي
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Trending in Egypt
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                الاجهزه الامنيه
              </Typography>
              <Typography variant="caption" color="text.secondary">
                4,213 posts
              </Typography>
            </Box>
          </CardContent>
        </Card>
  
        {/* Floating Messages Icon */}
        <IconButton
          onClick={handleMessagesClick}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#1D9BF0',
            color: 'white',
            borderRadius: '9999px',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: '#1A8CD8',
            },
          }}
        >
          <MailIcon />
        </IconButton>
      </Box>
    );
  };
  
  export default RightSidebar;
  