# 💇 GlowUp - Hệ thống đặt lịch cắt tóc

Hệ thống quản lý và đặt lịch hẹn cho salon tóc bao gồm ứng dụng di động cho khách hàng, trang quản trị cho admin và API backend.

## 📋 Tổng quan dự án

GlowUp là giải pháp toàn diện cho việc quản lý salon tóc, bao gồm:
- **Mobile App (React Native + Expo)**: Ứng dụng cho khách hàng đặt lịch
- **Admin Dashboard (Next.js)**: Trang quản trị cho chủ salon
- **Backend API (NestJS)**: RESTful API và WebSocket server

## 🏗️ Cấu trúc dự án

```
hair-booking/
├── FE/                 # Frontend Mobile App (React Native + Expo)
├── Admin-dashboard/    # Admin Dashboard (Next.js)
├── BE/                 # Backend API (NestJS)
└── README.md
```

## 🚀 Công nghệ sử dụng

### Frontend Mobile (FE/)
- **Framework**: React Native 0.74.2 + Expo 51
- **Navigation**: Expo Router
- **UI Library**: Tamagui
- **State Management**: Redux Toolkit
- **Ngôn ngữ**: TypeScript
- **Các tính năng**: 
  - Push notifications (Expo Notifications)
  - Camera & Image picker
  - Maps & Location
  - QR Code
  - i18n (đa ngôn ngữ)

### Admin Dashboard (Admin-dashboard/)
- **Framework**: Next.js 14
- **UI Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: Redux Toolkit
- **Real-time**: Socket.io Client
- **Ngôn ngữ**: TypeScript

### Backend (BE/)
- **Framework**: NestJS 10
- **Database**: PostgreSQL (Prisma ORM) + MongoDB (Mongoose)
- **Cache**: Redis + Bull Queue
- **Authentication**: JWT + Passport
- **Payment**: VNPay
- **Storage**: Imgur API
- **Real-time**: Socket.io + Redis Adapter
- **Notifications**: Firebase Admin, Telegram Bot
- **View Engine**: EJS

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18
- npm hoặc yarn
- PostgreSQL
- MongoDB
- Redis
- Expo CLI (cho mobile app)

### 1. Backend Setup

```bash
cd BE

# Cài đặt dependencies
npm install

# Cấu hình environment
cp example.env .env
# Chỉnh sửa file .env với thông tin của bạn

# Khởi tạo database với Prisma
npx prisma generate
npx prisma db push

# Chạy development server
npm run dev
```

Backend sẽ chạy tại `http://localhost:3000`

### 2. Admin Dashboard Setup

```bash
cd Admin-dashboard

# Cài đặt dependencies
npm install

# Cấu hình environment
cp .exame.env .env.local
# Chỉnh sửa file .env.local

# Chạy development server
npm run dev
```

Admin dashboard sẽ chạy tại `http://localhost:3001`

### 3. Mobile App Setup

```bash
cd FE

# Cài đặt dependencies
npm install

# Chạy Expo development server
npm start

# Hoặc chạy trên Android/iOS
npm run android
npm run ios
```

## 🎯 Tính năng chính

### Ứng dụng khách hàng (Mobile)
- ✅ Đăng ký/đăng nhập tài khoản
- ✅ Xem danh sách stylist và dịch vụ
- ✅ Đặt lịch hẹn cắt tóc
- ✅ Quản lý lịch hẹn (xem, hủy, đổi lịch)
- ✅ Thanh toán online (VNPay)
- ✅ Xem lịch sử giao dịch
- ✅ Đánh giá dịch vụ
- ✅ Nhận thông báo push
- ✅ Quét QR code
- ✅ Xem địa chỉ salon trên bản đồ
- ✅ Hỗ trợ đa ngôn ngữ

### Admin Dashboard
- ✅ Quản lý booking (đặt lịch)
- ✅ Quản lý khách hàng
- ✅ Quản lý khách hàng bị cấm
- ✅ Quản lý stylist
- ✅ Quản lý dịch vụ
- ✅ Quản lý combo
- ✅ Dashboard thống kê doanh thu
- ✅ Xác nhận thanh toán
- ✅ Real-time updates (Socket.io)
- ✅ Export báo cáo

### Backend API
- ✅ RESTful API
- ✅ WebSocket real-time
- ✅ Authentication & Authorization (JWT + Role-based)
- ✅ Payment integration (VNPay)
- ✅ Image upload (Imgur)
- ✅ Push notifications (Firebase, Expo)
- ✅ OTP verification
- ✅ Queue jobs (Bull)
- ✅ Cron jobs
- ✅ Soft delete
- ✅ Logging & Error handling

## 🔐 Biến môi trường

### Backend (.env)
```env
PORT=3000
API_URL=http://localhost:3000
DOMAIN=your-domain.com

REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=

MONGODB_CONECTION_STRING=your_mongodb_connection

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

IMGUR_API_URI=https://api.imgur.com/3/image
IMGUR_CLIENT_ID=your_imgur_client_id

VNP_TMN_CODE=your_vnpay_code
VNP_HASH_SECRET=your_vnpay_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=your_return_url
```

## 📱 Screenshots & Demo

### Mobile App
- Trang chủ với danh sách stylist
- Booking flow
- Quản lý lịch hẹn
- Thanh toán

### Admin Dashboard
- Dashboard analytics
- Quản lý booking
- Quản lý khách hàng
- Quản lý dịch vụ

## 👥 Đội ngũ phát triển

### Frontend Team
- **Nguyễn Văn Việt** - Lead Frontend, UI/UX Designer
- **Trịnh Đình Trường** - Frontend Developer
- **Thanh Do Tuan** - Frontend Developer
- **KMTus** - Frontend Developer, UI/UX Designer

### Backend Team
- **MWare CEO** - Backend Architect
- **Đào Duy Minh** - Database Engineer

### Cross-team
- **Thinh134** - Full Stack Developer, Documentation

## 📚 Tài liệu

- [Document](https://docs.google.com/document/d/1p1TOoakcYQS6pg_W6mvfreHy9AOm1Uux/edit)
- [Diagrams](https://app.diagrams.net/#G1d7OCPEhDpD9q5IX1Rv_AQNJvey6pxlxs)
- [Figma Design](https://www.figma.com/design/d60yqkXZspwUMpdiyyFyZn/GlowUp-application)

## 🧪 Testing

### Backend
```bash
cd BE
npm run test
npm run test:e2e
```

### Frontend Mobile
```bash
cd FE
npm run test
```

### Admin Dashboard
```bash
cd Admin-dashboard
npm run lint
```

## 📝 Scripts hữu ích

### Backend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start:prod` - Chạy production server
- `npm run gen` - Generate Prisma client

### Mobile App
- `npm start` - Khởi động Expo
- `npm run android` - Chạy trên Android
- `npm run ios` - Chạy trên iOS
- `npm run distributeAndroid` - Build APK preview
- `npm run buildIos` - Build iOS

### Admin Dashboard
- `npm run dev` - Chạy development (port 3001)
- `npm run build` - Build production
- `npm run start` - Chạy production server

## 🔄 Workflow

1. Backend API khởi động và lắng nghe các requests
2. Admin dashboard kết nối với API để quản lý dữ liệu
3. Mobile app kết nối với API để xem và đặt lịch
4. Socket.io đồng bộ real-time giữa admin và mobile
5. Redis cache và queue xử lý background jobs
6. Bull queue xử lý các tác vụ như kiểm tra booking, gửi thông báo

## ⚙️ Deployment

### Backend
```bash
cd BE
npm run build
npm run start:prod
```

### Admin Dashboard
```bash
cd Admin-dashboard
npm run build
npm run start
```

### Mobile App
```bash
cd FE
# Android
npm run distributeAndroid

# iOS
npm run buildIos
```

## 🐛 Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL và MongoDB đang chạy
- Kiểm tra connection string trong .env

### Lỗi Redis
- Đảm bảo Redis server đang chạy
- Kiểm tra REDIS_HOST và REDIS_PORT

### Lỗi Expo
- Chạy `expo doctor` để kiểm tra
- Clear cache: `expo start -c`

## 📄 License

Private - Graduation Project

## 📞 Liên hệ

Để biết thêm thông tin, vui lòng liên hệ team phát triển qua GitHub.

---

**Note**: Đây là dự án tốt nghiệp, được phát triển với mục đích học tập và nghiên cứu.
