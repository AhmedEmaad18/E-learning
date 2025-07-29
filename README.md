# 🌟 **Edu-Master**  

A **feature-rich e-learning platform** designed to provide a seamless experience for both students and admins.  
Includes **lesson & exam management**, **secure authentication**, **payments**, and **detailed reports**.

---

## ✨ **Features**

### **1. Admin Features 👨‍💼**
- 📊 **Dashboard Overview:**  
  View total users, lessons, exams, revenue, and recent activity.  
- 👥 **User Management:**  
  View, search, and manage all users (students and admins).  
- 🔑 **Create Admins:**  
  Super admins can create new admin accounts.  
- 📚 **Lesson Management:**  
  - Add, edit, and delete lessons.  
  - Manage content, pricing (free/premium), and details.  
- 📝 **Exam Management:**  
  - Create, edit, and delete exams.  
  - Assign exams to lessons or specific users.  
- 📈 **Reports:**  
  Access detailed analytics like user activity, revenue, and lesson popularity.

---

### **2. Student/User Features 🎓**
- 🏠 **Personal Dashboard:**  
  Class level, recent lessons, and quick stats.  
- 🔍 **Browse Lessons:**  
  View all available lessons (free & premium).  
- 🎥 **My Lessons:**  
  Access purchased/enrolled lessons.  
- 🧾 **Lesson Details:**  
  View content, duration, and description.  
- 📝 **Exams:**  
  - List available & completed exams.  
  - Take exams and view results.  
- 💳 **Payments:**  
  Secure payment for premium lessons.  
- 🆘 **Support:**  
  Access help and support from the dashboard.

---

### **3. Shared Features 🔒**
- **Authentication:**  
  Secure login, registration, and password recovery.  
- **Profile Management:**  
  Update profile info, change password, and delete account.  
- **Role-based Access:**  
  Admin and student dashboards protected by guards.  
- **Logout:**  
  Secure logout from any device.

---

## 🛠 **Tech Stack**

![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular&logoColor=white)  
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap&logoColor=white)  
![Angular Material](https://img.shields.io/badge/Angular_Material-UI-blue?logo=material-design&logoColor=white)  
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript&logoColor=white)  
![FontAwesome](https://img.shields.io/badge/FontAwesome-Icons-green?logo=fontawesome&logoColor=white)  
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-Alerts-orange)  
![RxJS](https://img.shields.io/badge/RxJS-State%20Mgmt-purple?logo=reactivex&logoColor=white)  
![HttpClient](https://img.shields.io/badge/HTTP-Client-lightblue)  

---
---

## **Team Roles**

### **1. Jawad Tamer (Frontend Developer – Authentication & Core Layouts)**  
- **Authentication & Shared Services:**  
  - Implemented secure login, registration, and password reset.  
  - Developed authentication services for token management and user profile fetching.  
  - Created route guards (`AuthGuard`, `AdminGuard`) for role-based access.  
- **Profile & Info Component:**  
  - Designed user profile module (view/update profile, change password, delete account).  
- **Admin Section:**  
  - Built the admin dashboard layout with responsive sidenav and real-time statistics.  
  - Developed Users Management (view/search/manage users).  
  - Implemented Reports Component (user activity, revenue, lesson popularity).  
- **Student Section:**  
  - Created student dashboard layout with recent lessons and quick stats.  
- **Core Services:**  
  Integrated reusable services for authentication , user and exam management.
---

### **2. Ahmed Emad (Frontend Developer – Exams Module & Analytics & UI Enhancements)**  
- **Student Exams:**  
  - Developed the complete exam-taking flow, including listing available and completed exams.  
  - Implemented score calculation logic to compute average performance and track progress.  
  - Built the UI for starting exams, displaying remaining time, answering questions, and viewing final results after submission.
  - Calculated and updated scores upon exam completion.
- **Admin Exam Management:**  
  - Developed admin features to list, create, edit, and delete exams (CRUD).  
  - Designed a question management system with full CRUD functionality for exam questions.  
  - Created detailed exam-question views to help admins validate exam content.  
- **Analytics:**  
  - Implemented logic to calculate and display exam statistics and user scores on dashboards.  
- **Integration:**  
  - Integrated exam services with authentication and lesson modules to assign exams per lesson.
- **UI/UX Enhancements:**  
  - Improved the overall user interface with responsive layouts, modern design patterns, and smooth navigation.
- **Core Services:**  
  Integrated reusable services for managing exams and questions across the application.
---

### **3. Reham Saeed (Frontend Developer – Lessons And Payments)**  
- **Lessons Module:**  
  - Designed the lessons page with responsive cards and filtering options (class level, free/premium).  
  - Built the lesson details page with content description, duration, and preview options.  
- **Payments:**  
  - Integrated a payment API to unlock premium lesson videos securely.  
  - Implemented logic to mark lessons as purchased and manage access rights.  
- **Purchased Lessons:**  
  - Developed a separate "My Lessons" page to display all purchased/enrolled lessons.  
  - Enabled users to navigate lesson content and track progress.  
- **Admin Lessons Management:**  
  - Built full CRUD operations for lessons (add, edit, delete) within the admin dashboard.
- **Core Services:**  
  Integrated reusable services for lesson management.
---

## **Installation & Setup**

```bash
# Clone repository
git clone [https://github.com/AhmedEmaad18/E-learning](https://github.com/AhmedEmaad18/E-learning)

# Navigate to project folder
cd e-learning

# Install dependencies
npm install

# Start development server
ng serve
