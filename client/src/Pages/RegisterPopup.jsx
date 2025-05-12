import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Box,
  InputAdornment,
  Typography,
  Avatar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../utils/axios";
// import { useNavigate } from "react-router-dom";
import VerifyPopup from "./VerifyPopup"; // import the verification dialog

const RegisterPopup = ({ open, onClose }) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    image: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    try {
      await axios.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEmailToVerify(formData.email);
      setShowVerification(true);
    } catch (error) {
      alert("Registration failed");
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ textAlign: "center" }}>Create your account</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <label htmlFor="upload-image">
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 64,
                    height: 64,
                    cursor: "pointer",
                    border: "2px solid #ccc"
                  }}
                />
              </label>
            </Box>

            <TextField
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(prev => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <VerifyPopup
        open={showVerification}
        email={emailToVerify}
        onClose={() => {
          setShowVerification(false);
          onClose(); // close register dialog as well
        }}
      />
    </>
  );
};

export default RegisterPopup;
