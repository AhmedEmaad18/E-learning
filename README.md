# **Edu-Master**

A feature-rich e-learning platform designed to provide a seamless experience for both students and admins. It includes functionalities like lesson and exam management, secure authentication, payments, and detailed reports.

---

## **Features**

### **1. Admin Features**
- **Dashboard Overview:**  
  View statistics such as total users, lessons, exams, revenue, and recent activity.  
- **User Management:**  
  View, search, and manage all users (students and admins).  
- **Create Admins:**  
  Super admins can create new admin accounts.  
- **Lesson Management:**  
  - Add, edit, and delete lessons.  
  - Manage lesson content, pricing (free/premium), and details.  
- **Exam Management:**  
  - Create, edit, and delete exams.  
  - Assign exams to lessons or users.  
- **Reports:**  
  Access reports on user activity, revenue, and lesson popularity.

---

### **2. Student/User Features**
- **Personal Dashboard:**  
  Welcome screen with class level, recent lessons, and quick stats.  
- **Browse Lessons:**  
  View all available lessons (free and premium).  
- **My Lessons:**  
  Access purchased/enrolled lessons.  
- **Lesson Details:**  
  View lesson content, duration, and description.  
- **Exams:**  
  - List available and completed exams.  
  - Start exams, calculate scores, and track progress.  
- **Payments:**  
  Secure payment for premium lessons.  
- **Support:**  
  Access help and support from the dashboard.

---

### **3. Shared Features**
- **Authentication:**  
  Secure login, registration, and password recovery.  
- **Profile Management:**  
  Update profile information, change password, and delete account.  
- **Role-based Access:**  
  Admin and student routes are protected by guards.  
- **Logout:**  
  Securely log out from any device.

---

## **Tech Stack**
- **Frontend:** Angular   
- **UI Libraries:** Angular Material, Bootstrap 5, FontAwesome, ngx-bootstrap, ngx-toastr, SweetAlert2  
- **Routing & State:** Angular Router, RxJS  
- **HTTP & API:** Angular HttpClient  
- **Build Tools:** Angular CLI, TypeScript  
- **Styling:** CSS, Angular Material themes, Bootstrap  

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
  Integrated services for authentication, user, lesson, and exam management.

---

### **2. Ahmed Emad (Frontend Developer – Exams Module & Analytics)**  
- **Student Exams:**  
  - Developed the complete exam-taking flow, including listing available and completed exams.  
  - Implemented score calculation logic to compute average performance and progress tracking.  
  - Built the UI for starting exams, answering questions, and viewing final results.  
- **Admin Exam Management:**  
  - Developed admin features to list, create, edit, and delete exams (CRUD).  
  - Designed the question management system, enabling CRUD operations for exam questions.  
  - Created a detailed exam-question view to ensure admins can validate content.  
- **Analytics:**  
  - Implemented logic to calculate and display exam statistics and user scores on dashboards.  
- **Integration:**  
  - Integrated exam services with authentication and lesson modules to assign exams per lesson.

---

### **3. Reham Saeed (Frontend Developer – Lessons, Payments & UI Enhancements)**  
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
- **UI/UX Enhancements:**  
  - Improved the overall user interface with responsive layouts, modern design patterns, and smooth navigation.

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
