import {
  Box,
  Typography,
  Card,
  CardContent,
  InputBase,
  Paper,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const trendingTopics = [
  { category: 'Technology · Trending', title: 'TikTok Ban', posts: '3,824 posts' },
  { category: 'Trending in Egypt', title: 'Water Crisis' },
  { category: 'Trending in Egypt', title: '#IndiaPakistanWar', posts: '45.9K posts' },
  { category: 'Fashion & beauty · Trending', title: '#MetGala', posts: '3.68M posts' },
  { category: 'Gaming · Trending', title: '#GTA6Leak', posts: '112K posts' },
];

const liveEvents = [
  {
    host: 'قناة الجزيرة',
    description: 'تغطية مباشرة للاحتلال على غزة',
    viewers: '+14K',
  },
  {
    host: 'BBC News',
    description: 'Live coverage of UK election debate',
    viewers: '+22K',
  },
  {
    host: 'Al Arabiya',
    description: 'تحديثات عاجلة حول العمليات في السودان',
    viewers: '+7.5K',
  },
  {
    host: 'CNN',
    description: 'Live reporting from hurricane zone in Florida',
    viewers: '+18K',
  },
  {
    host: 'Sky News Arabia',
    description: 'نقل مباشر من الحدود اللبنانية',
    viewers: '+5.2K',
  },
];

const getRandomItems = (array, count = 1) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RightSidebar = () => {
  const trends = getRandomItems(trendingTopics, 4);
  const [liveEvent] = getRandomItems(liveEvents, 1);

  return (
   <Box
  sx={{
    width: { xs: '0', sm: '0', md: 250 },
    display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
    px: { xs: 0, sm: 0, md: 0, lg: 4 },
    pt: 2,
    position: 'fixed',
    right: 0,
  }}
>
  {/* Inner container with spacing between children */}
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* Search Bar */}
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '9999px',
        backgroundColor: '#EFF3F4',
        px: 2,
        py: 0.5,
        height: 40,
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

    {/* Live on X */}
    <Card elevation={0} sx={{ borderRadius: 4, backgroundColor: '#ffffff', border: '.5px solid rgba(0, 0, 0, 0.08)' }}>
      <CardContent sx={{ py: 1.5 }}>
        <Typography fontWeight="bold" sx={{ fontSize: '1rem', mb: 1 }}>
          Live on X
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LiveTvIcon fontSize="small" sx={{ color: '#F91880' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {liveEvent.host} is hosting
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {liveEvent.description}
            </Typography>
          </Box>
          <Box
            sx={{
              marginLeft: 'auto',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: '#F0F0F0',
              px: 1,
              borderRadius: '6px',
              alignSelf: 'start',
            }}
          >
            {liveEvent.viewers}
          </Box>
        </Box>
      </CardContent>
    </Card>

    {/* What’s happening */}
    <Card elevation={0} sx={{ borderRadius: 4, backgroundColor: '#ffffff', border: '.5px solid rgba(0, 0, 0, 0.08)' }}>
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          What’s happening
        </Typography>

        {trends.map((trend, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {trend.category}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {trend.title}
            </Typography>
            {trend.posts && (
              <Typography variant="caption" color="text.secondary">
                {trend.posts}
              </Typography>
            )}
          </Box>
        ))}

        <Button
          sx={{
            mt: 1,
            textTransform: 'none',
            color: '#1D9BF0',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 0,
          }}
        >
          Show more
        </Button>
      </CardContent>
    </Card>
  </Box>
</Box>

  );
};

export default RightSidebar;
