# Twitter Clone

A full-featured Twitter clone that allows users to post tweets, comment, reply, and interact in a way similar to the original Twitter platform. Built using modern web technologies with a focus on performance, security, and user experience.

## Features

- User authentication (sign up, login, logout)
- Secure authentication using access tokens and refresh tokens (JWT-based)
- Post, edit, and delete tweets
- Comment and reply on tweets
- Like tweets
- View user profiles with tweet history
- Responsive and mobile-friendly design
- RESTful API integration between frontend and backend

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
