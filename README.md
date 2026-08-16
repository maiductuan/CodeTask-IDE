# 🖥️ CodeTask-IDE — Standalone AI Editor

Dự án IDE độc lập **Code Task**, được phát triển dựa trên nhân mã nguồn mở VS Code / VSCodium và tích hợp sẵn **Code Task AI Agent** làm Built-in Engine.

Thư mục này hoạt động **hoàn toàn độc lập** với thư mục plugin (`Code task Plugin vs Code`).

---

## 📂 Cấu trúc thư mục

```
CodeTask-IDE/
├── config/
│   ├── product.json      # Tên "Code Task", icon, kho extension Open VSX, gỡ telemetry
│   └── argv.json         # Tắt crash reporter mặc định
├── scripts/
│   ├── setup.mjs         # Clone VS Code sạch & nhúng Code Task Agent vào built-in
│   ├── dev.ps1           # Chạy thử IDE ngay trên máy (Dev Mode)
│   ├── build.mjs         # Biên dịch mã nguồn & đóng gói Desktop App
│   ├── build-win.ps1     # Script đóng gói hoàn chỉnh cho Windows
│   └── clean.mjs         # Dọn dẹp cache
├── package.json
└── README.md
```

---

## 🚀 Hướng dẫn Chạy & Build Local trên máy

### 1. Chạy thử IDE ngay trên máy (Chế độ Development - Khuyến nghị)
Mở PowerShell tại thư mục `CodeTask-IDE` và chạy:
```powershell
npm run dev
```
*(Lệnh này sẽ cài đặt các thư viện cần thiết bằng Yarn và mở trực tiếp cửa sổ **Code Task IDE** lên cho bạn trải nghiệm và debug ngay lập tức).*

---

### 2. Đóng gói ra bản cài đặt hoàn chỉnh (.exe)
```powershell
npm run build:win
```
Kết quả ứng dụng hoàn chỉnh sẽ được tạo tại:
* `CodeTask-IDE/VSCode-win32-x64/Code Task.exe`
