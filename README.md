
---

## Base Url  
https://edtech-server-a3tn.onrender.com/api/v1

## 🔐 Authentication Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/sendotp` | `POST` | Send OTP for authentication |
| `/auth/signup` | `POST` | User signup |
| `/auth/login` | `POST` | User login |
| `/auth/reset-password-token` | `POST` | Request password reset token |
| `/auth/reset-password` | `POST` | Reset user password |

---

## 👤 Profile Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile/getUserDetails` | `GET` | Get user details |
| `/profile/getEnrolledCourses` | `GET` | Get user's enrolled courses |
| `/profile/instructorDashboard` | `GET` | Get instructor dashboard data |

---

## 🎓 Student Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payment/capturePayment` | `POST` | Capture course payment |
| `/payment/verifyPayment` | `POST` | Verify payment status |
| `/payment/sendPaymentSuccessEmail` | `POST` | Send payment success email |

---

## 📚 Course Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/course/getAllCourses` | `GET` | Retrieve all courses |
| `/course/getCourseDetails` | `GET` | Get details of a specific course |
| `/course/editCourse` | `PUT` | Edit an existing course |
| `/course/showAllCategories` | `GET` | Get all course categories |
| `/course/createCourse` | `POST` | Create a new course |
| `/course/addSection` | `POST` | Add a section to a course |
| `/course/addSubSection` | `POST` | Add a subsection to a section |
| `/course/updateSection` | `PUT` | Update course section |
| `/course/updateSubSection` | `PUT` | Update course subsection |
| `/course/getInstructorCourses` | `GET` | Get all courses created by an instructor |
| `/course/deleteSection` | `DELETE` | Delete a course section |
| `/course/deleteSubSection` | `DELETE` | Delete a course subsection |
| `/course/deleteCourse` | `DELETE` | Delete a course |
| `/course/getFullCourseDetails` | `GET` | Get full course details (authenticated) |
| `/course/updateCourseProgress` | `POST` | Update course progress |
| `/course/createRating` | `POST` | Submit a course rating |

---

## ⭐ Ratings & Reviews
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/course/getReviews` | `GET` | Get course reviews |

---

## 📂 Categories API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/course/showAllCategories` | `GET` | Retrieve all course categories |

---

## 📖 Catalog Page Data
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/course/getCategoryPageDetails` | `GET` | Get category-wise course details |

---

## 📩 Contact Us API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reach/contact` | `POST` | Submit a contact form |

---

## ⚙️ Settings API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile/updateDisplayPicture` | `PUT` | Update user profile picture |
| `/profile/updateProfile` | `PUT` | Update user profile details |
| `/auth/changepassword` | `POST` | Change user password |
| `/profile/deleteProfile` | `DELETE` | Delete user profile |

---

📢 **Note:** Ensure that requests requiring authentication include an authorization header with a valid token:
