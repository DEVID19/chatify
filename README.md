<div align="center">

# 💬 Chatify

### Real-Time AI-Powered Chat Application

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Chatify-4F46E5?style=for-the-badge)](https://chatify-nos7.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-DEVID19-181717?style=for-the-badge&logo=github)](https://github.com/DEVID19)

*A modern full-stack chat platform built with the MERN stack, Socket.IO, and Gemini AI — supporting real-time messaging, group chats, image sharing, and an integrated AI assistant.*

</div>

---

## ✨ Features

### 👤 Authentication & Security
- Secure user authentication with **JWT**
- Protected routes and session management
- Scalable REST API with proper middleware

### 💬 Real-Time Messaging
- One-to-one private chats
- Group chat functionality
- Instant message delivery via **Socket.IO**
- Real-time sync across all connected clients

### 🖼️ Image Sharing
- Send images in private and group chats
- Seamless upload and storage powered by **Cloudinary**

### 🤖 AI Chat Assistant
- Built-in AI assistant powered by **Gemini AI**
- Chat with AI directly from the interface
- Smart, real-time conversational responses

### 🎨 UI & UX
- Fully responsive, modern design
- Smooth state management with **Redux**
- Clean chat layout built with **Tailwind CSS**

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Redux, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Real-Time** | Socket.IO |
| **Media** | Cloudinary |
| **AI** | Gemini AI |
| **Auth** | JWT |
| **Hosting** | Render |

---

## 📁 Project Structure

```
Chatify/
├── backend/
│   ├── config/          # DB & service configurations
│   ├── controllers/     # Request handling logic
│   ├── middlewares/     # Auth & error middlewares
│   ├── models/          # MongoDB schemas
│   ├── routes/          # REST API routes
│   ├── socket/          # Socket.IO logic
│   └── index.js         # Entry point
│
├── frontend/
│   └── src/
│       ├── assets/      # Images & static assets
│       ├── components/  # Reusable UI components
│       ├── constants/   # App constants
│       ├── customHooks/ # Custom React hooks
│       ├── pages/       # Login, Signup, Chat pages
│       └── redux/       # Redux store & slices
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DEVID19/Chatify.git
cd Chatify
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🎯 Use Cases

- Real-time private and group messaging platforms
- Team collaboration and communication tools
- AI-integrated chat applications
- MERN stack real-time reference project

---

## 👨‍💻 Author

**Devid Bisen** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-DEVID19-181717?style=flat-square&logo=github)](https://github.com/DEVID19)

---

<div align="center">

### 🌟 If you found Chatify useful, drop a star on the repo — it really helps! ⭐

</div>
