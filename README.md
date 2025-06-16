# 🧪 Karate API Testing Framework với Excel Data-Driven

## 📋 Tổng quan
Dự án này sử dụng Karate Framework để thực hiện API testing với dữ liệu được quản lý qua file Excel, hỗ trợ data-driven testing và ghi kết quả test trở lại Excel.

## 🏗️ Cấu trúc project

```
src/test/java/
├── data/
│   └── data.xlsx                    # File Excel chứa test data và results
├── features/
│   ├── auth/                        # Features cho authentication
│   │   ├── login-excel.feature      # Test login từ Excel data
│   │   └── register-excel.feature   # Test register từ Excel data
│   ├── helpers/                     # Helper features
│   │   ├── login-single-call.feature
│   │   └── register-single-call.feature
│   └── setup-excel-data.feature     # Setup dữ liệu mẫu
├── runners/
│   ├── auth/                        # Test runners cho auth
│   │   ├── LoginExcelTestRunner.java
│   │   ├── RegisterExcelTestRunner.java
│   │   └── ExcelTestRunner.java     # Chạy tất cả auth tests
│   ├── AllTestsRunner.java          # Chạy toàn bộ tests
│   └── SetupDataRunner.java         # Setup dữ liệu Excel
├── utils/
│   ├── read-excel.js               # Đọc dữ liệu từ Excel
│   ├── write-excel.js              # Ghi kết quả vào Excel
│   └── add-sample-data.js          # Thêm dữ liệu mẫu
├── karate-config.js                # Cấu hình Karate
└── pom.xml                         # Maven dependencies
```

## 🧪 Test Cases cho API Login

### ✅ Test Cases Cơ bản
1. **Valid login credentials** - Đăng nhập thành công
2. **Login without password** - Thiếu password
3. **Login with invalid email** - Email không tồn tại  
4. **Login without email** - Thiếu email
5. **Login with wrong password** - Sai password

### 🔒 Test Cases Bảo mật và Validation

#### **Email Format Validation**
6. **TC: Email không hợp lệ - thiếu domain** (`user@`)
7. **TC: Email không hợp lệ - thiếu ký tự @** (`user.example.com`)
8. **TC: Email không hợp lệ - thiếu username** (`@example.com`)

#### **Password Length Validation**  
9. **TC: Password quá ngắn** (`12`)
10. **TC: Password quá dài** (chuỗi rất dài 90+ ký tự)

#### **Security Testing - Injection Attacks**
11. **TC: SQL Injection trong email** (`' OR '1'='1`)
12. **TC: SQL Injection trong password** (`' OR '1'='1`)
13. **TC: XSS trong email** (`<script>alert("xss")</script>@test.com`)
14. **TC: XSS trong password** (`<script>alert("xss")</script>`)

#### **Rate Limiting / Brute Force Protection**
15. **TC: Vượt quá số lần thử - lần 1** (brute force attempt)
16. **TC: Vượt quá số lần thử - lần 2**
17. **TC: Vượt quá số lần thử - lần 3**
18. **TC: Vượt quá số lần thử - lần 4**
19. **TC: Vượt quá số lần thử - lần 5**

### 📊 Expected Results

| Test Case Category | Expected Status | Expected Response |
|-------------------|-----------------|-------------------|
| Valid Login | 200 | `{"token": "QpwL5tke4Pnpja7X4"}` |
| Missing Data | 400 | `Missing password/email` |
| Invalid Format | 400 | `Invalid email format` |
| Password Length | 400 | `Password must be between X and Y characters` |
| Security Injection | 400/401 | `Invalid input` |
| Rate Limiting | 429 | `Too many login attempts` |

## 🚀 Cách chạy tests

### 1. Setup dữ liệu mẫu
```bash
mvn test -Dtest=SetupDataRunner
```

### 2. Chạy login tests
```bash
# Chạy tất cả login tests
mvn test -Dtest="runners.auth.LoginExcelTestRunner"

# Chạy tất cả auth tests (login + register)
mvn test -Dtest="runners.auth.ExcelTestRunner"

# Chạy toàn bộ project tests
mvn test -Dtest=AllTestsRunner
```

### 3. Chạy register tests
```bash
mvn test -Dtest="runners.auth.RegisterExcelTestRunner"
```

## 📁 File Excel Structure

### Sheet "login" với columns:
- **email**: Email để test
- **password**: Password để test  
- **expectedStatus**: HTTP status code mong đợi
- **expectedResult**: Kết quả mong đợi
- **testDescription**: Mô tả test case
- **responseStatus**: Status code thực tế (được ghi tự động)
- **result**: Response body thực tế (được ghi tự động)

### Sheet "register" tương tự với các test cases cho registration

## 🔧 Configuration

### API Endpoint
- **Base URL**: `https://reqres.in/api`
- **Login Endpoint**: `/auth/login`
- **Register Endpoint**: `/auth/register`
- **API Key**: `reqres-free-v1` (required header)

### Maven Dependencies
- **Karate**: 1.4.1
- **Apache POI**: 5.2.4 (Excel processing)
- **JUnit 5**: Latest

## 📈 Reporting

Sau khi chạy tests, báo cáo sẽ được tạo tại:
```
target/karate-reports/karate-summary.html
```

## 🎯 Tính năng chính

1. **✅ Data-Driven Testing**: Test data từ Excel
2. **✅ Result Writing**: Ghi kết quả test vào Excel
3. **✅ Security Testing**: SQL Injection, XSS, Rate Limiting
4. **✅ Validation Testing**: Email format, password length
5. **✅ Modular Structure**: Tách biệt login/register tests
6. **✅ Helper Functions**: Reusable test components
7. **✅ Comprehensive Reporting**: HTML reports với chi tiết

## 🚨 Lưu ý quan trọng

- API reqres.in yêu cầu header `x-api-key: "reqres-free-v1"`
- Kết quả test sẽ được ghi đè vào file Excel gốc
- Cần backup file Excel trước khi chạy tests
- Các test cases security có thể fail tùy theo implementation của API server 