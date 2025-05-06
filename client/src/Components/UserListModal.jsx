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
} from "@mui/material";

const UserListModal = ({ open, onClose, title, users }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List>
          {users.length === 0 ? (
            <Typography variant="body2">No users found.</Typography>
          ) : (
            users.map((user) => (
              <ListItem key={user._id} button component="a" href={`/profile/${user.username}`}>
                <ListItemAvatar>
                  <Avatar src={user.profilePic} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={`@${user.username}`} />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal;
