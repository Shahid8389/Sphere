### 🌐 Sphere - Real-Time Chat Application
Sphere is a modern real-time chat application built using React, Firebase, and Cloudinary. It enables users to chat instantly, send images, update their profiles, and recover passwords securely. With Firebase authentication and Cloudinary image storage, Sphere delivers a fast, interactive, and user-friendly chat experience.

---

### 🚀 Features
1. ✅ Real-time Messaging: Instant chat with live updates.
2. ✅ Image Sharing: Send and receive images seamlessly.
3. ✅ User Authentication: Secure login, registration, and password reset.
4. ✅ Profile Management: Update profile picture, bio, and display name.
5. ✅ Mobile Responsive: Fully responsive UI for all devices.

--- 

## 📌 Technologies Used

- **React** - Frontend UI 
- **Firebase** - Backend & Real-time database  
- **React Router** - Navigation
- **Cloudinary** - Image storage 
- **Tailwind CSS** - Styling & Layout
- **React-Toastify** - Notifications & Alerts

---

### 📌 Prerequisites
Before running the project, ensure you have the following installed:
- ✅ Node.js (Latest Version)
- ✅ Firebase Account
- ✅ Cloudinary Account

### ⚙️ Cloudinary Setup
1. Go to Cloudinary Console.
2. Navigate to Settings > Upload.
3. Create two upload presets:
- profile_pictures → For profile images
- chat_images → For chat images
4. Copy your Cloudinary Cloud Name and Presets Name.
5. Add them to your .env file.

---

### ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
# Clone the repository
git clone https://github.com/Shahid8389/Sphere.git

# Navigate to the project directory
cd Sphere
```

### 2️⃣ Install Dependencies
Install dependencies:
```bash
npm install
```

### 3️⃣ Set Up Environment Variables:
```bash
VITE_FIREBASE_API_KEY = "your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN = "your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID = "your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET = "your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID = "your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID = "your_firebase_app_id"

VITE_CLOUDINARY_PRESET_NAME = 'your_cloudinary_preset_name'
VITE_CLOUDINARY_CLOUD_NAME = 'your_cloudinary_cloud_name'

VITE_CLOUDINARY_PRESET2_NAME = 'your_cloudinary_preset2_name'
```

### 4️⃣ Start the development server:
```bash
npm run dev
```

### 5️⃣ Open your browser and visit:
```bash
http://localhost:5173
```

---

### 📝 Contributing
Contributions are welcome! Follow these steps:

1. Fork or Clone the repository

2. Create a new branch:
```bash
git checkout -b feature-branch
```
3. Make your changes and commit:
```bash
git commit -m "Describe your changes"
```
3. Push to your branch:
```bash
git push origin feature-branch
```
4. Open a Pull Request