# 📌 BookMyStay – Full Stack Accommodation Platform

BookMyStay is a full-stack web application inspired by modern booking platforms like Airbnb. It allows users to explore, create, and manage property listings with advanced search, filtering, and a responsive user experience.

---

## 🚀 Live Demo

🔗 https://bookmystay-05up.onrender.com/listings  

> ⚠️ Note: The app is hosted on free infrastructure, so the first load may take a few seconds as the server wakes up.

---

## 🛠️ Tech Stack

**Frontend**
- EJS (Embedded JavaScript Templates)
- Bootstrap 5
- CSS3
- Font Awesome

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB (Atlas)

**Other Tools**
- Cloudinary (Image Upload & Storage)
- Multer (File Handling)
- Passport.js (Authentication)
- Connect-Flash (Flash Messages)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User signup and login system
- Secure session handling
- Role-based access (Owner vs User)

### 🏠 Listings Management
- Create, edit, and delete property listings
- Upload images using Cloudinary
- Add pricing, location, and descriptions

### 🔍 Search & Filtering
- Search listings by title
- Category-based filtering:
  - Mountains
  - Camping
  - Pools
  - Sea View
  - Farms
  - Iconic Stays
- Combined search + filter functionality

### 📱 Responsive UI
- Mobile-first improvements
- Airbnb-inspired design
- Scrollable filter bar for mobile

### 🧠 Smart Features
- AI-assisted listing auto-fill (prompt-based input)
- Guided onboarding tutorial for first-time users

### ⭐ Reviews System
- Add and view reviews for listings

---

## 🧱 Project Structure

```
BookMyStay/
│
├── models/          # Mongoose schemas
├── routes/          # Express routes
├── controllers/     # Route logic
├── views/           # EJS templates
│   ├── layouts/
│   ├── listings/
│   └── includes/
├── public/          # CSS, JS, assets
├── utils/           # Helper functions
├── middleware.js    # Custom middleware
├── app.js           # Main server file
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/BookMyStay.git
cd BookMyStay
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in root:

```
ATLASDB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
SESSION_SECRET=your_secret
```

### 4️⃣ Run the Application

```bash
npm run dev
```

or

```bash
node app.js
```

---

## 🔥 Key Learnings

- Designed scalable MongoDB schema and performed schema migration
- Built dynamic filtering and search using query parameters
- Integrated Cloudinary for efficient image management
- Implemented authentication using Passport.js
- Improved UX with responsive design and onboarding tutorial
- Debugged real-world deployment issues (Render cold start)

---

## 🚧 Future Improvements

- Payment integration (Stripe/Razorpay)
- Booking system with date selection
- Wishlist feature
- Map integration (Mapbox)
- Real-time availability
- Admin dashboard

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Bhushan Deore**  
Full Stack Developer (MERN)

---

## ⭐ Show Your Support

If you like this project, please ⭐ the repository!

---

# 🏁 Summary

BookMyStay is a feature-rich full-stack project demonstrating real-world web development skills including authentication, database design, search & filtering, image handling, and responsive UI design.
