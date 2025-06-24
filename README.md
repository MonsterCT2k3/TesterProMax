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
│   │   ├── follows/                     # Features cho follows
│   │   │   ├── follows-excel.feature    # Test follows từ Excel data
│   │   │   ├── get-followers-excel.feature # Test get followers từ Excel data
│   │   │   ├── get-following-excel.feature # Test get following từ Excel data
│   │   │   └── unfollow-excel.feature   # Test unfollow từ Excel data
│   │   ├── like/                        # Features cho like
│   │   │   └── like-excel.feature       # Test like từ Excel data
│   │   ├── unlike/                      # Features cho unlike
│   │   │   └── unlike-excel.feature     # Test unlike từ Excel data
│   │   ├── posts/                       # Features cho posts
│   │   │   └── get-posts-feed-excel.feature # Test getPostsFeed từ Excel data
│   │   ├── users/                       # Features cho users
│   │   │   └── get-users-excel.feature # Test getUsers từ Excel data
│   │   ├── helpers/                     # Helper features tái sử dụng
│   │   │   ├── login-single-call.feature    # Helper cho single login call
│   │   │   ├── register-single-call.feature # Helper cho single register call
│   │   │   ├── like-single-call.feature     # Helper cho single like call
│   │   │   ├── unlike-single-call.feature   # Helper cho single unlike call
│   │   │   ├── get-posts-feed-single-call.feature # Helper cho single getPostsFeed call
│   │   │   └── get-users-single-call.feature # Helper cho single getUsers call
│   │   ├── resources.feature            # Test resources API
│   │   └── setup-excel-data.feature     # Setup dữ liệu mẫu vào Excel
│   ├── runners/                         # Test runners
│   │   ├── auth/                        # Runners cho authentication
│   │   │   ├── LoginExcelTestRunner.java
│   │   │   └── RegisterExcelTestRunner.java
│   │   ├── follows/                     # Runners cho follows
│   │   │   ├── FollowsExcelTestRunner.java
│   │   │   ├── GetFollowerExcelTestRunner.java
│   │   │   ├── GetFollowingExcelTestRunner.java
│   │   │   └── UnfollowExcelTestRunner.java
│   │   ├── like/                        # Runners cho like
│   │   │   └── LikeExcelTestRunner.java
│   │   ├── unlike/                      # Runners cho unlike
│   │   │   └── UnlikeExcelTestRunner.java
│   │   ├── posts/                       # Runners cho posts
│   │   │   └── GetPostsFeedExcelTestRunner.java
│   │   ├── users/                       # Runners cho users
│   │   │   └── GetUsersExcelTestRunner.java
│   │   ├── setup-data/                  # Runners cho setup data
│   │   │   ├── SetupDataRunner.java
│   │   │   ├── SetupFollowsDataRunner.java
│   │   │   ├── SetupGetFollowersDataRunner.java
│   │   │   ├── SetupGetFollowingDataRunner.java
│   │   │   ├── SetupLogoutDataRunner.java
│   │   │   ├── SetupChangePasswordDataRunner.java
│   │   │   ├── SetupUnfollowDataRunner.java
│   │   │   ├── SetupLikeDataRunner.java
│   │   │   ├── SetupUnlikeDataRunner.java
│   │   │   ├── SetupGetPostsFeedDataRunner.java
│   │   │   └── SetupGetUsersDataRunner.java
│   │   └── AllTestsRunner.java          # Chạy toàn bộ tests
│   ├── utils/                           # Utilities cho Excel processing
│   │   ├── read-excel.js               # Đọc dữ liệu từ Excel
│   │   ├── write-excel.js              # Ghi kết quả vào Excel
│   │   ├── add-sample-data.js          # Thêm dữ liệu login mẫu
│   │   ├── add-register-data.js        # Thêm dữ liệu register mẫu
│   │   ├── add-like-data.js            # Thêm dữ liệu like mẫu
│   │   ├── add-unlike-data.js          # Thêm dữ liệu unlike mẫu
│   │   ├── add-get-posts-feed-data.js  # Thêm dữ liệu getPostsFeed mẫu
│   │   └── add-get-users-data.js       # Thêm dữ liệu getUsers mẫu
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

### 🔑 Change Password API Testing

#### ✅ Test Cases Đổi mật khẩu với Bearer Token
1. **Valid password change** - Đổi mật khẩu hợp lệ với token từ login
2. **Invalid token** - Đổi mật khẩu với token không hợp lệ
3. **Wrong old password** - Đổi mật khẩu với mật khẩu cũ sai
4. **Password validation** - Mật khẩu mới quá ngắn/dài
5. **Missing fields** - Thiếu oldPassword hoặc newPassword
6. **No authorization** - Không có token trong header
7. **Same password** - Mật khẩu mới giống mật khẩu cũ
8. **Weak password** - Mật khẩu mới quá yếu
9. **Password length** - Mật khẩu mới quá dài
10. **Security testing** - Token expiry, malformed token

### 👍 Like API Testing

#### ✅ Test Cases Like Post với Bearer Token
1. **Valid like** - Like post hợp lệ với targetId
2. **Missing targetId** - Thiếu trường targetId
3. **Empty targetId** - targetId rỗng
4. **No authorization** - Không có token trong header
5. **Invalid token** - Token không hợp lệ hoặc hết hạn
6. **Target not found** - targetId không tồn tại
7. **Already liked** - Đã like post trước đó
8. **Invalid targetId format** - targetId không đúng định dạng
9. **SQL Injection** - Kiểm tra SQL injection trong targetId
10. **XSS testing** - Kiểm tra Cross-Site Scripting
11. **Whitespace validation** - targetId chỉ chứa khoảng trắng
12. **Null values** - Kiểm tra null values
13. **Length validation** - targetId quá dài
14. **Special characters** - targetId chứa ký tự đặc biệt
15. **Valid UUID** - Like với UUID hợp lệ khác

> **💡 Note**: Type được fix cứng là "post", chỉ cần truyền targetId và bearerToken

### 💔 Unlike API Testing

#### ✅ Test Cases Unlike Post với Bearer Token
1. **Valid unlike** - Unlike post hợp lệ với targetId
2. **Missing targetId** - Thiếu trường targetId
3. **Empty targetId** - targetId rỗng
4. **No authorization** - Không có token trong header
5. **Invalid token** - Token không hợp lệ hoặc hết hạn
6. **Target not found** - targetId không tồn tại
7. **Not liked yet** - Chưa like post trước đó
8. **Invalid targetId format** - targetId không đúng định dạng
9. **SQL Injection** - Kiểm tra SQL injection trong targetId
10. **XSS testing** - Kiểm tra Cross-Site Scripting
11. **Whitespace validation** - targetId chỉ chứa khoảng trắng
12. **Null values** - Kiểm tra null values
13. **Length validation** - targetId quá dài
14. **Special characters** - targetId chứa ký tự đặc biệt
15. **Valid UUID** - Unlike với UUID hợp lệ khác

> **💡 Note**: Type được fix cứng là "post", chỉ cần truyền targetId và bearerToken

### 📄 GetPostsFeed API Testing

#### ✅ Test Cases Get Posts Feed với Query Parameters
1. **Valid requests** - Lấy posts feed với page và limit hợp lệ
2. **Get first page** - Lấy trang đầu tiên (page=1)
3. **Small limit** - Lấy với limit nhỏ (5 posts)
4. **Large limit** - Lấy với limit lớn (100 posts)
5. **Middle page** - Lấy trang giữa (page=5)
6. **No parameters** - Lấy posts mà không có query parameters
7. **Zero page** - Lấy với page=0
8. **Zero limit** - Lấy với limit=0
9. **Large page** - Lấy với page rất lớn (9999)
10. **Large limit** - Lấy với limit rất lớn (9999)
11. **Negative page** - Lấy với page âm (-1)
12. **Negative limit** - Lấy với limit âm (-5)
13. **Non-numeric page** - Lấy với page không phải số ("abc")
14. **Non-numeric limit** - Lấy với limit không phải số ("xyz")
15. **Empty token** - Lấy posts mà không có token

> **💡 Note**: API endpoint là GET `/posts/feed` với query parameters `page` và `limit`

### 👥 GetUsers API Testing

#### ✅ Test Cases Get Users List với Query Parameters
1. **Valid page and limit** - Lấy users với page và limit hợp lệ
2. **First page without limit** - Lấy trang đầu tiên mà không có limit
3. **Small limit** - Lấy với limit nhỏ (5 users)
4. **Large page** - Lấy với page lớn và limit tương ứng
5. **Middle page** - Lấy trang ở giữa (page=3)
6. **No query parameters** - Lấy users mà không có query parameters
7. **Zero page** - Lấy với page=0 (invalid)
8. **Zero limit** - Lấy với limit=0 (invalid)
9. **Large page number** - Lấy với page rất lớn (9999)
10. **Large limit value** - Lấy với limit rất lớn (invalid)
11. **Negative page** - Lấy với page âm (-1)
12. **Negative limit** - Lấy với limit âm (-5)
13. **Non-numeric page** - Lấy với page không phải số ("abc")
14. **Non-numeric limit** - Lấy với limit không phải số ("xyz")
15. **Empty bearer token** - Lấy users mà không có token

> **💡 Note**: API endpoint là GET `/users/get-users` với query parameters `page` và `limit`

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
# Setup dữ liệu cơ bản
mvn test -Dtest=runners.setup_data.SetupDataRunner

# Setup dữ liệu follows
mvn test -Dtest=runners.setup_data.SetupFollowsDataRunner

# Setup dữ liệu get followers
mvn test -Dtest=runners.setup_data.SetupGetFollowersDataRunner

# Setup dữ liệu get following
mvn test -Dtest=runners.setup_data.SetupGetFollowingDataRunner

# Setup dữ liệu logout
mvn test -Dtest=runners.setup_data.SetupLogoutDataRunner

# Setup dữ liệu change password
mvn test -Dtest=runners.setup_data.SetupChangePasswordDataRunner

# Setup dữ liệu unfollow
mvn test -Dtest=runners.setup_data.SetupUnfollowDataRunner

# Setup dữ liệu getPostsFeed
mvn test -Dtest=runners.setup_data.SetupGetPostsFeedDataRunner

# Setup dữ liệu getUsers
mvn test -Dtest=runners.setup_data.SetupGetUsersDataRunner
```

#### 2. Chạy Login tests
```bash
# Chạy tất cả login tests
mvn test -Dtest=LoginExcelTestRunner
```

#### 3. Chạy Register tests
```bash
# Chạy tất cả register tests
mvn test -Dtest=RegisterExcelTestRunner
```

#### 4. Chạy Change Password tests
```bash
# Chạy tất cả change password tests
mvn test -Dtest=ChangePasswordExcelTestRunner
```

#### 5. Chạy Logout tests
```bash
# Chạy tất cả logout tests
mvn test -Dtest=LogoutExcelTestRunner
```

#### 6. Chạy Follows tests
```bash
# Chạy tất cả follows tests
mvn test -Dtest=FollowsExcelTestRunner

# Chạy tất cả get followers tests
mvn test -Dtest=GetFollowerExcelTestRunner

# Chạy tất cả get following tests
mvn test -Dtest=GetFollowingExcelTestRunner

# Chạy tất cả unfollow tests
mvn test -Dtest=UnfollowExcelTestRunner
```

#### 7. Chạy Like tests
```bash
# Setup dữ liệu like
mvn test -Dtest=runners.setup_data.SetupLikeDataRunner

# Chạy tất cả like tests
mvn test -Dtest=LikeExcelTestRunner
```

#### 8. Chạy Unlike tests
```bash
# Setup dữ liệu unlike
mvn test -Dtest=runners.setup_data.SetupUnlikeDataRunner

# Chạy tất cả unlike tests
mvn test -Dtest=UnlikeExcelTestRunner
```

#### 9. Chạy GetPostsFeed tests
```bash
# Setup dữ liệu getPostsFeed
mvn test -Dtest=runners.setup_data.SetupGetPostsFeedDataRunner

# Chạy tất cả getPostsFeed tests
mvn test -Dtest=GetPostsFeedExcelTestRunner
```

#### 10. Chạy GetUsers tests
```bash
# Setup dữ liệu getUsers
mvn test -Dtest=runners.setup_data.SetupGetUsersDataRunner

# Chạy tất cả getUsers tests
mvn test -Dtest=GetUsersExcelTestRunner
```

#### 11. Chạy tất cả tests
```bash
# Chạy toàn bộ test suite
mvn test -Dtest=AllTestsRunner

# Chạy tất cả tests trong thư mục auth
mvn test -Dtest="runners.auth.*"

# Chạy tất cả tests trong thư mục follows
mvn test -Dtest="runners.follows.*"

# Chạy tất cả tests trong thư mục like
mvn test -Dtest="runners.like.*"

# Chạy tất cả tests trong thư mục unlike
mvn test -Dtest="runners.unlike.*"

# Chạy tất cả tests trong thư mục posts
mvn test -Dtest="runners.posts.*"

# Chạy tất cả tests trong thư mục users
mvn test -Dtest="runners.users.*"
```

#### 8. Cập nhật Bearer Token
Để sử dụng token mới, chỉ cần sửa trong `src/test/java/karate-config.js`:
```javascript
bearerToken: 'TOKEN_MỚI_CỦA_BẠN'
```

#Kiểm thử hiệu năng
# Sequential (100% tuần tự)
mvn test -Dtest=SequentialLoginRunner

# Parallel (10 threads đồng thời)  
mvn test -Dtest=LoginPerfRunner

# Concurrent (50 threads đồng thời)
mvn test -Dtest=Concurrent50ThreadsRunner

# Concurrent (100 threads đồng thời)
mvn test -Dtest=ConcurrentLoginRunner


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

### Sheet "changePassword"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `bearerToken` | Bearer token (để trống = dùng global token) | `eyJhbGciOiJIUzI1NiIs...` hoặc để trống |
| `oldPassword` | Mật khẩu hiện tại | `123456` |
| `newPassword` | Mật khẩu mới | `NewPassword123` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"message": "Password changed successfully"}` |
| `testDescription` | Mô tả test case | `TC1: Đổi mật khẩu hợp lệ` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"message": "..."}` |
| `testStatus` | Kết quả test (auto-fill) | `PASS` hoặc `FAIL` |
| `failureReason` | Lý do fail (auto-fill) | `Status mismatch: Expected 200, got 401` |

### Sheet "like"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `bearerToken` | Bearer token (để trống = dùng global token) | `eyJhbGciOiJIUzI1NiIs...` hoặc để trống |
| `targetId` | ID của target muốn like | `c8161412-bc98-49ec-88ff-57b99cc2ce67` |
| `testDescription` | Mô tả test case | `TC1: Like post hợp lệ` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"message": "Liked successfully"}` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"message": "..."}` |

> **💡 Like API Note**: Type được fix cứng là "post", không cần truyền tham số type

### Sheet "unlike"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `bearerToken` | Bearer token (để trống = dùng global token) | `eyJhbGciOiJIUzI1NiIs...` hoặc để trống |
| `targetId` | ID của target muốn unlike | `c8161412-bc98-49ec-88ff-57b99cc2ce67` |
| `testDescription` | Mô tả test case | `TC1: Unlike post hợp lệ` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"message": "Unliked successfully"}` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"message": "..."}` |

> **💡 Unlike API Note**: Type được fix cứng là "post", không cần truyền tham số type

### Sheet "getPostsFeed"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `bearerToken` | Bearer token (để trống = dùng global token) | `eyJhbGciOiJIUzI1NiIs...` hoặc để trống |
| `page` | Số trang để lấy | `1` |
| `limit` | Số lượng posts mỗi trang | `10` |
| `testDescription` | Mô tả test case | `TC1: Lấy trang đầu tiên với limit 10` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"posts": [...]}` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"posts": [...]}` |

> **💡 GetPostsFeed API Note**: API endpoint là GET `/posts/feed` với query parameters `page` và `limit`

### Sheet "getUsers"
| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| `bearerToken` | Bearer token (để trống = dùng global token) | `eyJhbGciOiJIUzI1NiIs...` hoặc để trống |
| `page` | Số trang để lấy | `1` |
| `limit` | Số lượng users mỗi trang | `10` |
| `testDescription` | Mô tả test case | `TC1: Lấy danh sách users trang đầu` |
| `expectedStatus` | HTTP status mong đợi | `200` |
| `expectedResult` | Response mong đợi | `{"users": [...]}` |
| `responseStatus` | Status thực tế (auto-fill) | `200` |
| `result` | Response thực tế (auto-fill) | `{"users": [...]}` |

> **💡 GetUsers API Note**: API endpoint là GET `/users/get-users` với query parameters `page` và `limit`

> **🔑 Global Bearer Token**: Token được định nghĩa trong `karate-config.js` - chỉ cần sửa một lần!

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

### 🔐 Bearer Token Support
- ✅ **Auto Login**: Tự động đăng nhập để lấy access_token
- 🔑 **Manual Token**: Hỗ trợ sử dụng token trực tiếp
- 🛡️ **Security Testing**: Test với token không hợp lệ, hết hạn
- 📝 **Token Management**: Quản lý token qua Excel data

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

### 🚀 Kiểm thử hiệu năng (Performance Testing)

#### 1. Chạy kiểm thử hiệu năng cơ bản cho API Login
```bash
# Sử dụng JUnit Runner (đơn giản nhất)

mvn test "-Dtest=runners.performance.SimplePerfRunner"

# Chạy với nhiều thông tin báo cáo hơn
mvn test "-Dtest=runners.performance.LoginPerfRunner"

# So sánh hiệu năng giữa các API
mvn test "-Dtest=runners.performance.ApiComparisonRunner"

# Hoặc sử dụng Gatling với đường dẫn đầy đủ
mvn io.gatling:gatling-maven-plugin:4.2.2:test -Dgatling.simulationClass=performance.LoginPerfTest
```