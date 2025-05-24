# Twitter Clone

A full-featured Twitter clone that allows users to post tweets, comment, reply, and interact in a way similar to the original Twitter platform. Built using modern web technologies with a focus on performance, security, and user experience.

## Features

- User authentication (sign up, login, logout)
- Secure access and refresh token flow (JWT-based)
- Post, edit, and delete tweets
- Comment and reply on tweets
- Like tweets
- Follow and unfollow users
- User profiles with tweet history and social connections
- Upload profile pictures using Cloudinary
- Responsive design for mobile and desktop
- RESTful API between frontend and backend
- Deployed backend on Render

## Tech Stack

**Frontend:**
- React (with functional components and hooks)
- Redux Toolkit
- React Router
- CSS Framework (Tailwind CSS / Material UI)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication (access & refresh tokens)
- bcrypt for password encryption

**Other Tools:**
- Axios for API communication
- dotenv for environment configuration
- Cookie-based refresh token storage (for better security)
- Multer for media upload (if applicable)

## Authentication Flow

The authentication system is based on **access and refresh tokens**:

- Upon login, an access token (short-lived) and a refresh token (long-lived) are issued.
- The **access token** is used to authorize API requests and is stored in memory or local storage.
- The **refresh token** is stored in an **HttpOnly cookie** to prevent XSS attacks.
- When the access token expires, the client automatically sends a request to refresh the token using the secure cookie.
- The backend verifies the refresh token and issues a new access token, ensuring a seamless user experience without requiring repeated logins.

This setup mimics real-world practices used by platforms like Twitter to manage secure and scalable authentication.

## Screenshots

### Login Page
![Screenshot (2492)](https://github.com/user-attachments/assets/c9453fa6-f609-46ee-bf88-429bd290863f)
![Screenshot (2491)](https://github.com/user-attachments/assets/836f61d8-4ef5-47fa-9df2-ca6e059c23a9)


### Home Feed
![Screenshot (2493)](https://github.com/user-attachments/assets/13d82b30-b1d2-4059-b0ec-0168d1ad7c41)

### Profile Page
![Screenshot (2495)](https://github.com/user-attachments/assets/c15061b1-5dbe-4978-976c-e9962dff6371)


## Installation

```bash
# Clone the repository
git clone https://github.com/Rania334/Twitter-Clone-MERN.git
cd twitter-clone

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
