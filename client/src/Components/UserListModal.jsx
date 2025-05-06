import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Divider
} from "@mui/material";

const UserListModal = ({ open, onClose, title, users }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxWidth: 400,
          width: '100%',
          p: 1,
          backgroundColor: '#fefefe',
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#111',
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <List>
          {users.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            </Box>
          ) : (
            users.map((user, index) => (
              <Box key={user._id}>
                <ListItem
                  button
                  component="a"
                  href={`/profile/${user.username}`}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.profilePic}
                      alt={user.name}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < users.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal;
