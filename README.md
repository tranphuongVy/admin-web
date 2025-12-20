# Admin Web Dashboard

Admin Web Dashboard là ứng dụng web quản trị được xây dựng nhằm hỗ trợ quản lý, theo dõi và thống kê dữ liệu của hệ thống. Dự án tập trung vào kiến trúc component tái sử dụng, giao diện rõ ràng, dễ mở rộng và tích hợp trực tiếp với backend API.

**📌 Mục tiêu dự án**

- Xây dựng giao diện Admin Dashboard trực quan, dễ sử dụng

- Quản lý dữ liệu hệ thống thông qua bảng, bộ lọc và biểu đồ

- Tách biệt rõ UI – Logic – API

- Dễ dàng mở rộng cho các chức năng quản trị trong tương lai

**🚀 Chức năng chính**

- Quản lý danh sách dữ liệu (account, post, comment, annoucement)

- Hiển thị bảng dữ liệu với:

   + Checkbox chọn dòng

   + Phân trang

   + Tái sử dụng cho nhiều loại dữ liệu

- Bộ lọc dữ liệu theo nhiều tiêu chí

- Hiển thị biểu đồ thống kê (Bar Chart)

- Xem chi tiết thông tin từng đối tượng

- Tương tác với backend thông qua API (CRUD)

**🛠 Công nghệ sử dụng**

- Frontend	ReactJS

- Ngôn ngữ	JavaScript / TypeScript

- Styling	CSS Modules / Tailwind CSS

- Giao tiếp API	Axios

- Kiến trúc	Component-based Architecture

**📂 Cấu trúc thư mục**

src/
├── api/

├── assets/

├── components/

├── features/

├── layouts/

├── routes/

├── store/

├── types/

├── utils/

├── App.css

├── index.css

└── main.jsx

**⚙️ Cài đặt & chạy dự án**

1️⃣ Cài đặt dependencies

npm install hoặc yarn install

2️⃣ Chạy project ở môi trường development

npm run dev

Ứng dụng sẽ chạy tại: http://localhost:5173 (hoặc cổng mặc định theo cấu hình)

**🔗 Kết nối Backend**

- Project được thiết kế để kết nối với Backend API (NestJS).

- Frontend gọi API thông qua Axios, dễ dàng cấu hình base URL theo môi trường.

**📈 Khả năng mở rộng**

- Dễ dàng thêm module quản lý mới

- Có thể tích hợp:

   + Authentication

   + Role-based access control

   + Realtime data

   + Phù hợp để phát triển thành hệ thống admin hoàn chỉnh
