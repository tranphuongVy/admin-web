// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AdminLoginPage from "../features/auth/AdminLoginPage";
// import UserListPage from "../features/users/UserListPage";
// import AdminRoute from "./AdminRoute";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* redirect root */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         <Route path="/login" element={<AdminLoginPage />} />

//         <Route
//           path="/users"
//           element={
//             <AdminRoute>
//               <UserListPage />
//             </AdminRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AdminLoginPage from "../features/auth/AdminLoginPage";
// import UserListPage from "../features/users/UserListPage";
// import AdminRoute from "./AdminRoute";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* default */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* auth */}
//         <Route path="/login" element={<AdminLoginPage />} />

//         {/* protected */}
//         <Route
//           path="/users"
//           element={
//             <AdminRoute>
//               <UserListPage />
//             </AdminRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLoginPage from "../features/auth/AdminLoginPage";
import UserListPage from "../features/users/UserListPage";
import PostListPage from "../features/posts/PostListPage";
import CommentListPage from "../features/comments/CommentListPage";
import AnnouncementPage from "../features/announcements/AnnouncementPage";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AdminLoginPage />} />

        {/* ===== ADMIN ===== */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/users" element={<UserListPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/comments" element={<CommentListPage />} />
          <Route path="/announcements" element={<AnnouncementPage />} />
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<h2>404 - Page not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import UserListPage from "../features/users/UserListPage";
// import PostListPage from "../features/posts/PostListPage";
// import CommentListPage from "../features/comments/CommentListPage";
// import AnnouncementPage from "../features/announcements/AnnouncementPage";

// import AdminLayout from "../layouts/AdminLayout";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ===== ROOT ===== */}
//         <Route path="/" element={<Navigate to="/users" replace />} />

//         {/* ===== ADMIN (NO AUTH) ===== */}
//         <Route element={<AdminLayout />}>
//           <Route path="/users" element={<UserListPage />} />
//           <Route path="/posts" element={<PostListPage />} />
//           <Route path="/comments" element={<CommentListPage />} />
//           <Route path="/announcements" element={<AnnouncementPage />} />
//         </Route>

//         {/* ===== 404 ===== */}
//         <Route path="*" element={<h2>404 - Page not found</h2>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

