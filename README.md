# 🧪 Karate API Testing Framework với Excel Data-Driven

## 📋 Tổng quan
Dự án này sử dụng Karate Framework để thực hiện API testing với dữ liệu được quản lý qua file Excel, hỗ trợ data-driven testing và ghi kết quả test trở lại Excel. Dự án tập trung vào testing các API Authentication (Login/Register) với đầy đủ các test cases bao gồm validation, security và edge cases.

## 🏗️ Cấu trúc dự án

```
karate-tests/
├── src/test/java/
│   ├── data/
│   │   └── data.xlsx                    # File Excel chứa test data và results
│   ├── features/
│   │   ├── auth/                        # Features cho authentication
│   │   │   ├── login-excel.feature      # Test login từ Excel data
│   │   │   └── register-excel.feature   # Test register từ Excel data
│   │   ├── helpers/                     # Helper features tái sử dụng
│   │   │   ├── login-single-call.feature    # Helper cho single login call
│   │   │   └── register-single-call.feature # Helper cho single register call
│   │   ├── resources.feature            # Test resources API
│   │   └── setup-excel-data.feature     # Setup dữ liệu mẫu vào Excel
│   ├── runners/                         # Test runners
│   │   ├── auth/                        # Runners cho authentication
│   │   │   ├── LoginExcelTestRunner.java
│   │   │   └── RegisterExcelTestRunner.java
│   │   ├── AllTestsRunner.java          # Chạy toàn bộ tests
│   │   └── SetupDataRunner.java         # Setup dữ liệu Excel
│   ├── utils/                           # Utilities cho Excel processing
│   │   ├── read-excel.js               # Đọc dữ liệu từ Excel
│   │   ├── write-excel.js              # Ghi kết quả vào Excel
│   │   ├── add-sample-data.js          # Thêm dữ liệu login mẫu
│   │   └── add-register-data.js        # Thêm dữ liệu register mẫu
│   └── karate-config.js                # Cấu hình Karate global
├── target/                             # Build output và reports
│   └── karate-reports/                 # HTML test reports
└── pom.xml                            # Maven dependencies
```

## 🔐 API Authentication Testing

### 🚪 Login API Testing

#### ✅ Test Cases Cơ bản
1. **Valid login credentials** - Đăng nhập thành công
2. **Login without password** - Thiếu password
3. **Login with invalid email** - Email không tồn tại  
4. **Login without email** - Thiếu email
5. **Login with wrong password** - Sai password

#### 🔒 Test Cases Bảo mật và Validation
6. **Email format validation** - Email không đúng định dạng
7. **Password length validation** - Password quá ngắn/dài
8. **SQL Injection testing** - Kiểm tra SQL injection
9. **XSS testing** - Kiểm tra Cross-Site Scripting
10. **Rate limiting** - Kiểm tra brute force protection

### 📝 Register API Testing

#### ✅ Test Cases Đăng ký với phoneNumber
1. **Valid registration** - Đăng ký hợp lệ với số điện thoại 10-11 chữ số
2. **Missing required fields** - Thiếu các trường bắt buộc (email, password, name, username, phoneNumber)
3. **Email validation** - Email không đúng định dạng
4. **Password validation** - Password quá ngắn, không chứa số
5. **Phone number validation** - Số điện thoại theo ràng buộc:
   - ✅ **10 chữ số**: `0987654321`
   - ✅ **11 chữ số**: `01234567890`
   - ❌ **Quá ngắn**: `098765432` (9 chữ số)
   - ❌ **Quá dài**: `098765432123` (12 chữ số)
   - ❌ **Chứa ký tự**: `098765432a`
   - ❌ **Có ký tự đặc biệt**: `0987-654-321`
   - ❌ **Có khoảng trắng**: `0987 654 321`
   - ❌ **Có mã quốc gia**: `+84987654321`
6. **Duplicate data** - Email, username, phoneNumber đã tồn tại
7. **Security testing** - SQL Injection, XSS
8. **Edge cases** - Null values, whitespace only

#### 📋 Ràng buộc phoneNumber
```typescript
@IsString({ message: 'Số điện thoại là kiểu chuỗi' })
@Matches(/^[0-9]{10,11}$/, {
  message: 'Số điện thoại phải có 10 hoặc 11 chữ số',
})
@IsNotEmpty({ message: 'Số điện thoại không được để trống' })
phoneNumber: string;
```

## 🚀 Hướng dẫn sử dụng

### 📦 Yêu cầu hệ thống
- **Java**: 8 hoặc cao hơn
- **Maven**: 3.6 hoặc cao hơn
- **IDE**: IntelliJ IDEA, Eclipse, hoặc VS Code

### 🛠️ Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd karate-tests

# Install dependencies
mvn clean install
```

### 🎯 Chạy tests

#### 1. Setup dữ liệu test vào Excel
```bash
mvn test -Dtest=SetupDataRunner
```

#### 2. Chạy Login tests
```bash
# Chạy tất cả login tests
mvn test -Dtest=LoginExcelTestRunner

# Chạy login tests với Excel data
mvn test -Dtest=runners.auth.LoginExcelTestRunner
```

#### 3. Chạy Register tests
```bash
# Chạy tất cả register tests
mvn test -Dtest=RegisterExcelTestRunner

# Chạy register tests với Excel data
mvn test -Dtest=runners.auth.RegisterExcelTestRunner
```

#### 4. Chạy tất cả tests
```bash
# Chạy toàn bộ test suite
mvn test -Dtest=AllTestsRunner

# Chạy tất cả tests trong thư mục auth
mvn test -Dtest="runners.auth.*"
```

## 📊 Cấu trúc file Excel

### Sheet "login"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `email` | Email để test | `eve.holt@reqres.in` |
| `password` | Password để test | `cityslicka` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"token": "QpwL5tke4Pnpja7X4"}` |
| `testDescription` | Mô tả test case | `TC1: Valid login credentials` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"token": "..."}` |

### Sheet "register"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `email` | Email để test | `test1@example.com` |
| `password` | Password để test | `Password123` |
| `name` | Tên người dùng | `John Doe` |
| `username` | Username | `johndoe1` |
| `phoneNumber` | Số điện thoại | `0987654321` |
| `expectedStatus` | HTTP status mong đợi | `201` |
| `expectedResult` | Response mong đợi | `{"message": "User registered successfully"}` |
| `testDescription` | Mô tả test case | `TC1: Đăng ký hợp lệ - Số điện thoại 10 chữ số` |
| `responseStatus` | Status thực tế (auto-fill) | `201` |
| `result` | Response thực tế (auto-fill) | `{"message": "..."}` |

## ⚙️ Cấu hình


### 📦 Maven Dependencies
```xml
<dependencies>
    <dependency>
        <groupId>com.intuit.karate</groupId>
        <artifactId>karate-junit5</artifactId>
        <version>1.4.1</version>
    </dependency>
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.2.4</version>
    </dependency>
</dependencies>
```

## 📈 Test Reporting

### 📊 HTML Reports
Sau khi chạy tests, báo cáo chi tiết được tạo tại:
```
target/karate-reports/karate-summary.html
```

### 📋 Báo cáo bao gồm:
- ✅ **Test execution summary** - Tổng quan kết quả
- ✅ **Individual test results** - Kết quả từng test case
- ✅ **Request/Response details** - Chi tiết API calls
- ✅ **Performance metrics** - Thời gian thực thi
- ✅ **Error details** - Chi tiết lỗi nếu có

### 📝 Console Logging
```bash
# Ví dụ output khi chạy test
=== BƯỚC 1: SETUP DỮ LIỆU TEST ===
Đã setup dữ liệu test vào Excel thành công!

=== BƯỚC 2: ĐỌC DỮ LIỆU TỪ EXCEL ===
Đã đọc 30 test cases từ Excel

=== BƯỚC 3: THỰC THI TEST CASES ===
Executing test case #1: TC1: Đăng ký hợp lệ - Số điện thoại 10 chữ số
✅ PASS: Status 201 - User registered successfully
```

## 🎯 Tính năng nổi bật

### ✨ Data-Driven Testing
- 📊 **Excel Integration**: Quản lý test data qua Excel
- 🔄 **Auto Result Writing**: Tự động ghi kết quả vào Excel
- 📝 **Dynamic Test Cases**: Dễ dàng thêm/sửa test cases

### 🛡️ Security Testing
- 🔒 **SQL Injection**: Kiểm tra các lỗ hổng SQL injection
- 🚫 **XSS Protection**: Test Cross-Site Scripting
- 🔐 **Input Validation**: Validation toàn diện cho tất cả trường

### 📱 Phone Number Validation
- ✅ **Format Validation**: Chỉ chấp nhận 10-11 chữ số
- ❌ **Character Filtering**: Loại bỏ ký tự không hợp lệ
- 🌍 **No International Format**: Không hỗ trợ mã quốc gia

### 🔧 Modular Architecture
- 🧩 **Helper Features**: Tái sử dụng code
- 📁 **Organized Structure**: Phân chia theo chức năng
- 🎛️ **Configurable**: Dễ dàng thay đổi cấu hình

## 🚨 Lưu ý quan trọng

### ⚠️ Trước khi chạy tests
1. **Backup Excel file**: Kết quả sẽ ghi đè vào file gốc
2. **Check API availability**: Đảm bảo reqres.in API hoạt động
3. **Internet connection**: Cần kết nối internet để gọi API


### 📋 Test Data Management
- **Excel format**: Đảm bảo đúng format columns
- **Data types**: Chú ý kiểu dữ liệu (string, number)
- **Special characters**: Tránh ký tự đặc biệt trong Excel

## 🤝 Đóng góp

### 🔧 Thêm test cases mới
1. Cập nhật file `add-register-data.js` hoặc `add-sample-data.js`
2. Chạy `SetupDataRunner` để tạo dữ liệu mới
3. Thực thi tests và kiểm tra kết quả

### 📝 Tạo feature mới
1. Tạo file `.feature` trong thư mục `features/`
2. Tạo corresponding runner trong `runners/`
3. Cập nhật `AllTestsRunner.java` nếu cần

### 🐛 Báo lỗi
- Kiểm tra logs trong `target/karate-reports/`
- Xem chi tiết request/response trong HTML report
- Kiểm tra cấu hình trong `karate-config.js`

---

**📞 Liên hệ hỗ trợ**: Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository.

**🎉 Happy Testing!** 🧪✨ 