function addRegisterDataToExcel() {
    var FileInputStream = Java.type('java.io.FileInputStream');
    var FileOutputStream = Java.type('java.io.FileOutputStream');
    var XSSFWorkbook = Java.type('org.apache.poi.xssf.usermodel.XSSFWorkbook');
    var File = Java.type('java.io.File');

    try {
        var filePath = 'src/test/java/data/data.xlsx';
        var file = new File(filePath);
        var workbook;

        // Mở file Excel hiện có
        if (file.exists()) {
            var fis = new FileInputStream(file);
            workbook = new XSSFWorkbook(fis);
            fis.close();
        } else {
            karate.log('File không tồn tại: ' + filePath);
            return false;
        }

        // Tạo hoặc lấy sheet "register"
        var registerSheet = workbook.getSheet('register');
        if (!registerSheet) {
            registerSheet = workbook.createSheet('register');
        } else {
            // Xóa dữ liệu cũ nếu có
            var lastRowNum = registerSheet.getLastRowNum();
            for (var i = lastRowNum; i >= 0; i--) {
                var row = registerSheet.getRow(i);
                if (row != null) {
                    registerSheet.removeRow(row);
                }
            }
        }

        // Tạo header row
        var headerRow = registerSheet.createRow(0);
        var headers = ['email', 'password', 'name', 'username', 'phoneNumber', 'expectedStatus', 'expectedResult', 'testDescription', 'responseStatus', 'result'];

        for (var i = 0; i < headers.length; i++) {
            var cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Dữ liệu test cases
        var registerData = [
            // TC1: Đăng ký hợp lệ với số điện thoại 10 chữ số
            {
                email: 'test1@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe1',
                phoneNumber: '0987654321',
                expectedStatus: 201,
                expectedResult: '{"message": "User registered successfully"}',
                testDescription: 'TC1: Đăng ký hợp lệ - Số điện thoại 10 chữ số'
            },
            // TC2: Đăng ký hợp lệ với số điện thoại 11 chữ số
            {
                email: 'test2@example.com',
                password: 'Password123',
                name: 'Jane Smith',
                username: 'janesmith',
                phoneNumber: '01234567890',
                expectedStatus: 201,
                expectedResult: '{"message": "User registered successfully"}',
                testDescription: 'TC2: Đăng ký hợp lệ - Số điện thoại 11 chữ số'
            },
            // TC3: Thiếu trường email
            {
                email: '',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe3',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Email is required"}',
                testDescription: 'TC3: Thiếu trường email - Kiểm tra khi thiếu email'
            },
            // TC4: Thiếu trường password
            {
                email: 'test4@example.com',
                password: '',
                name: 'John Doe',
                username: 'johndoe4',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Password is required"}',
                testDescription: 'TC4: Thiếu trường password - Kiểm tra khi thiếu password'
            },
            // TC5: Thiếu trường name
            {
                email: 'test5@example.com',
                password: 'Password123',
                name: '',
                username: 'johndoe5',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Name is required"}',
                testDescription: 'TC5: Thiếu trường name - Kiểm tra khi thiếu name'
            },
            // TC6: Thiếu trường username
            {
                email: 'test6@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: '',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Username is required"}',
                testDescription: 'TC6: Thiếu trường username - Kiểm tra khi thiếu username'
            },
            // TC7: Thiếu trường phoneNumber
            {
                email: 'test7@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe7',
                phoneNumber: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại không được để trống"}',
                testDescription: 'TC7: Thiếu trường phoneNumber - Kiểm tra khi thiếu số điện thoại'
            },
            // TC8: Email không hợp lệ
            {
                email: 'invalid_email',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe8',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid email format"}',
                testDescription: 'TC8: Email không hợp lệ - Kiểm tra với email không đúng định dạng'
            },
            // TC9: Password quá ngắn
            {
                email: 'test9@example.com',
                password: '12345',
                name: 'John Doe',
                username: 'johndoe9',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Password must be at least 6 characters"}',
                testDescription: 'TC9: Password quá ngắn - Kiểm tra khi password dưới 6 ký tự'
            },
            // TC10: Username đã tồn tại
            {
                email: 'test10@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe1',
                phoneNumber: '0123456789',
                expectedStatus: 409,
                expectedResult: '{"error": "Username already exists"}',
                testDescription: 'TC10: Username đã tồn tại - Kiểm tra khi username đã được sử dụng'
            },
            // TC11: Email đã tồn tại
            {
                email: 'test1@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'newuser11',
                phoneNumber: '0123456789',
                expectedStatus: 409,
                expectedResult: '{"error": "Email already exists"}',
                testDescription: 'TC11: Email đã tồn tại - Kiểm tra khi email đã được sử dụng'
            },
            // TC12: Số điện thoại đã tồn tại
            {
                email: 'test12@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'newuser12',
                phoneNumber: '0987654321',
                expectedStatus: 409,
                expectedResult: '{"error": "Phone number already exists"}',
                testDescription: 'TC12: Số điện thoại đã tồn tại - Kiểm tra khi số điện thoại đã được sử dụng'
            },
            // TC13: Số điện thoại quá ngắn (9 chữ số)
            {
                email: 'test13@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe13',
                phoneNumber: '098765432',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC13: Số điện thoại quá ngắn - Kiểm tra khi số điện thoại có 9 chữ số'
            },
            // TC14: Số điện thoại quá dài (12 chữ số)
            {
                email: 'test14@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe14',
                phoneNumber: '098765432123',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC14: Số điện thoại quá dài - Kiểm tra khi số điện thoại có 12 chữ số'
            },
            // TC15: Số điện thoại chứa ký tự chữ
            {
                email: 'test15@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe15',
                phoneNumber: '098765432a',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC15: Số điện thoại chứa ký tự - Kiểm tra khi số điện thoại chứa chữ cái'
            },
            // TC16: Số điện thoại chứa ký tự đặc biệt
            {
                email: 'test16@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe16',
                phoneNumber: '0987-654-321',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC16: Số điện thoại chứa ký tự đặc biệt - Kiểm tra khi có dấu gạch ngang'
            },
            // TC17: Số điện thoại chứa khoảng trắng
            {
                email: 'test17@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe17',
                phoneNumber: '0987 654 321',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC17: Số điện thoại chứa khoảng trắng - Kiểm tra khi có space'
            },
            // TC18: Số điện thoại bắt đầu bằng dấu +
            {
                email: 'test18@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe18',
                phoneNumber: '+84987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC18: Số điện thoại có mã quốc gia - Kiểm tra khi có dấu + và mã quốc gia'
            },
            // TC19: Tất cả các trường rỗng
            {
                email: '',
                password: '',
                name: '',
                username: '',
                phoneNumber: '',
                expectedStatus: 400,
                expectedResult: '{"error": "All fields are required"}',
                testDescription: 'TC19: Tất cả các trường rỗng - Kiểm tra khi tất cả các trường để trống'
            },
            // TC20: Username chứa ký tự đặc biệt
            {
                email: 'test20@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'john@doe',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Username contains invalid characters"}',
                testDescription: 'TC20: Username chứa ký tự đặc biệt - Kiểm tra khi username chứa ký tự không cho phép'
            },
            // TC21: Password không chứa số
            {
                email: 'test21@example.com',
                password: 'password',
                name: 'John Doe',
                username: 'johndoe21',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Password must contain at least one number"}',
                testDescription: 'TC21: Password không chứa số - Kiểm tra khi password không đáp ứng yêu cầu phức tạp'
            },
            // TC22: Name quá dài
            {
                email: 'test22@example.com',
                password: 'Password123',
                name: 'This is a very long name that exceeds the maximum length of fifty characters allowed in the system',
                username: 'johndoe22',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Name exceeds maximum length"}',
                testDescription: 'TC22: Name quá dài - Kiểm tra khi name vượt quá giới hạn ký tự (50 ký tự)'
            },
            // TC23: Kiểm tra SQL Injection
            {
                email: 'test23@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: "johndoe' OR '1'='1",
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}',
                testDescription: 'TC23: Kiểm tra SQL Injection - Kiểm tra khi nhập dữ liệu nguy hiểm'
            },
            // TC24: Kiểm tra XSS
            {
                email: 'test24@example.com',
                password: 'Password123',
                name: '<script>alert("xss")</script>',
                username: 'johndoe24',
                phoneNumber: '0987654321',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}',
                testDescription: 'TC24: Kiểm tra XSS - Kiểm tra khi nhập dữ liệu nguy hiểm chứa mã HTML/JavaScript'
            },
            // TC25: Kiểm tra khoảng trắng trong các trường
            {
                email: '   ',
                password: '   ',
                name: '   ',
                username: '   ',
                phoneNumber: '   ',
                expectedStatus: 400,
                expectedResult: '{"error": "Fields cannot contain only whitespace"}',
                testDescription: 'TC25: Kiểm tra khoảng trắng - Kiểm tra khi các trường chứa toàn khoảng trắng'
            },
            // TC26: Kiểm tra trường null
            {
                email: null,
                password: null,
                name: null,
                username: null,
                phoneNumber: null,
                expectedStatus: 400,
                expectedResult: '{"error": "Fields cannot be null"}',
                testDescription: 'TC26: Kiểm tra trường null - Kiểm tra khi gửi giá trị null cho các trường'
            },
            // TC27: Số điện thoại với số 0 đầu tiên (10 chữ số)
            {
                email: 'test27@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe27',
                phoneNumber: '0123456789',
                expectedStatus: 201,
                expectedResult: '{"message": "User registered successfully"}',
                testDescription: 'TC27: Số điện thoại hợp lệ - 10 chữ số bắt đầu bằng 0'
            },
            // TC28: Số điện thoại không bắt đầu bằng 0 (11 chữ số)
            {
                email: 'test28@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe28',
                phoneNumber: '84987654321',
                expectedStatus: 201,
                expectedResult: '{"message": "User registered successfully"}',
                testDescription: 'TC28: Số điện thoại hợp lệ - 11 chữ số không bắt đầu bằng 0'
            },
            // TC29: Số điện thoại chỉ chứa số 0
            {
                email: 'test29@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe29',
                phoneNumber: '0000000000',
                expectedStatus: 201,
                expectedResult: '{"message": "User registered successfully"}',
                testDescription: 'TC29: Số điện thoại đặc biệt - 10 chữ số 0'
            },
            // TC30: Số điện thoại chỉ có 1 ký tự
            {
                email: 'test30@example.com',
                password: 'Password123',
                name: 'John Doe',
                username: 'johndoe30',
                phoneNumber: '1',
                expectedStatus: 400,
                expectedResult: '{"error": "Số điện thoại phải có 10 hoặc 11 chữ số"}',
                testDescription: 'TC30: Số điện thoại quá ngắn - Chỉ 1 chữ số'
            }
        ];

        // Thêm dữ liệu vào sheet
        for (var i = 0; i < registerData.length; i++) {
            var row = registerSheet.createRow(i + 1);
            var data = registerData[i];

            row.createCell(0).setCellValue(data.email !== null ? data.email : 'null');
            row.createCell(1).setCellValue(data.password !== null ? data.password : 'null');
            row.createCell(2).setCellValue(data.name !== null ? data.name : 'null');
            row.createCell(3).setCellValue(data.username !== null ? data.username : 'null');
            row.createCell(4).setCellValue(data.phoneNumber !== null ? data.phoneNumber : 'null');
            row.createCell(5).setCellValue(data.expectedStatus);
            row.createCell(6).setCellValue(data.expectedResult);
            row.createCell(7).setCellValue(data.testDescription);
            row.createCell(8).setCellValue(''); // responseStatus - sẽ được điền sau
            row.createCell(9).setCellValue(''); // result - sẽ được điền sau
        }

        // Lưu file
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        fos.close();
        workbook.close();

        karate.log('Đã thêm dữ liệu register vào file data.xlsx thành công!');
        karate.log('Sheet register: ' + registerData.length + ' test cases');

        return true;

    } catch (e) {
        karate.log('Lỗi khi thêm dữ liệu register vào Excel: ' + e.message);
        return false;
    }
} 