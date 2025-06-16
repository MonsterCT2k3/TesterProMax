function addSampleDataToExcel() {
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

        // Tạo hoặc lấy sheet "login"
        var loginSheet = workbook.getSheet('login');
        if (!loginSheet) {
            loginSheet = workbook.createSheet('login');
        }

        // Tạo header row
        var headerRow = loginSheet.createRow(0);
        var headers = ['email', 'password', 'expectedStatus', 'expectedResult', 'testDescription', 'responseStatus', 'result'];

        for (var i = 0; i < headers.length; i++) {
            var cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Dữ liệu mẫu cho login
        var loginData = [
            {
                email: 'eve.holt@reqres.in',
                password: 'cityslicka',
                expectedStatus: 200,
                expectedResult: 'success',
                testDescription: 'Valid login credentials'
            },
            {
                email: 'eve.holt@reqres.in',
                password: '',
                expectedStatus: 400,
                expectedResult: 'Missing password',
                testDescription: 'Login without password'
            },
            {
                email: 'invalid@email.com',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'user not found',
                testDescription: 'Login with invalid email'
            },
            {
                email: '',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Missing email or username',
                testDescription: 'Login without email'
            },
            {
                email: 'eve.holt@reqres.in',
                password: 'wrongpassword',
                expectedStatus: 400,
                expectedResult: 'user not found',
                testDescription: 'Login with wrong password'
            },
            // Các test case mới theo yêu cầu
            {
                email: 'user@',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Invalid email format',
                testDescription: 'TC: Email không hợp lệ - thiếu domain'
            },
            {
                email: 'user.example.com',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Invalid email format',
                testDescription: 'TC: Email không hợp lệ - thiếu ký tự @'
            },
            {
                email: '@example.com',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Invalid email format',
                testDescription: 'TC: Email không hợp lệ - thiếu phần username'
            },
            {
                email: 'eve.holt@reqres.in',
                password: '12',
                expectedStatus: 400,
                expectedResult: 'Password must be between X and Y characters',
                testDescription: 'TC: Password quá ngắn'
            },
            {
                email: 'eve.holt@reqres.in',
                password: 'verylongpasswordthatexceedsthenormallimitsforpasswordlengthvalidationwhichshouldnotbeaccepted123456789',
                expectedStatus: 400,
                expectedResult: 'Password must be between X and Y characters',
                testDescription: 'TC: Password quá dài'
            },
            {
                email: "' OR '1'='1",
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Invalid input',
                testDescription: 'TC: SQL Injection trong email'
            },
            {
                email: 'eve.holt@reqres.in',
                password: "' OR '1'='1",
                expectedStatus: 400,
                expectedResult: 'Invalid input',
                testDescription: 'TC: SQL Injection trong password'
            },
            {
                email: '<script>alert("xss")</script>@test.com',
                password: 'password123',
                expectedStatus: 400,
                expectedResult: 'Invalid input',
                testDescription: 'TC: XSS trong email'
            },
            {
                email: 'eve.holt@reqres.in',
                password: '<script>alert("xss")</script>',
                expectedStatus: 400,
                expectedResult: 'Invalid input',
                testDescription: 'TC: XSS trong password'
            },
            {
                email: 'brute.force@test.com',
                password: 'wrongpass1',
                expectedStatus: 429,
                expectedResult: 'Too many login attempts',
                testDescription: 'TC: Vượt quá số lần thử - lần 1'
            },
            {
                email: 'brute.force@test.com',
                password: 'wrongpass2',
                expectedStatus: 429,
                expectedResult: 'Too many login attempts',
                testDescription: 'TC: Vượt quá số lần thử - lần 2'
            },
            {
                email: 'brute.force@test.com',
                password: 'wrongpass3',
                expectedStatus: 429,
                expectedResult: 'Too many login attempts',
                testDescription: 'TC: Vượt quá số lần thử - lần 3'
            },
            {
                email: 'brute.force@test.com',
                password: 'wrongpass4',
                expectedStatus: 429,
                expectedResult: 'Too many login attempts',
                testDescription: 'TC: Vượt quá số lần thử - lần 4'
            },
            {
                email: 'brute.force@test.com',
                password: 'wrongpass5',
                expectedStatus: 429,
                expectedResult: 'Too many login attempts',
                testDescription: 'TC: Vượt quá số lần thử - lần 5'
            }
        ];

        // Thêm dữ liệu vào sheet
        for (var i = 0; i < loginData.length; i++) {
            var row = loginSheet.createRow(i + 1);
            var data = loginData[i];

            row.createCell(0).setCellValue(data.email);
            row.createCell(1).setCellValue(data.password);
            row.createCell(2).setCellValue(data.expectedStatus);
            row.createCell(3).setCellValue(data.expectedResult);
            row.createCell(4).setCellValue(data.testDescription);
            row.createCell(5).setCellValue(''); // responseStatus - sẽ được điền sau
            row.createCell(6).setCellValue(''); // result - sẽ được điền sau
        }

        // Tạo sheet "register" với dữ liệu mẫu
        var registerSheet = workbook.getSheet('register');
        if (!registerSheet) {
            registerSheet = workbook.createSheet('register');
        }

        // Header cho register sheet
        var regHeaderRow = registerSheet.createRow(0);
        for (var i = 0; i < headers.length; i++) {
            var cell = regHeaderRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Dữ liệu mẫu cho register
        var registerData = [
            {
                email: 'eve.holt@reqres.in',
                password: 'pistol',
                expectedStatus: 200,
                expectedResult: 'success',
                testDescription: 'Valid register credentials'
            },
            {
                email: 'sydney@fife',
                password: '',
                expectedStatus: 400,
                expectedResult: 'Missing password',
                testDescription: 'Register without password'
            },
            {
                email: 'test@reqres.in',
                password: 'test123',
                expectedStatus: 400,
                expectedResult: 'user not found',
                testDescription: 'Register with invalid email'
            }
        ];

        // Thêm dữ liệu register
        for (var i = 0; i < registerData.length; i++) {
            var row = registerSheet.createRow(i + 1);
            var data = registerData[i];

            row.createCell(0).setCellValue(data.email);
            row.createCell(1).setCellValue(data.password);
            row.createCell(2).setCellValue(data.expectedStatus);
            row.createCell(3).setCellValue(data.expectedResult);
            row.createCell(4).setCellValue(data.testDescription);
            row.createCell(5).setCellValue('');
            row.createCell(6).setCellValue('');
        }

        // Lưu file
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        fos.close();
        workbook.close();

        karate.log('Đã thêm dữ liệu mẫu vào file data.xlsx thành công!');
        karate.log('Sheet login: ' + loginData.length + ' test cases');
        karate.log('Sheet register: ' + registerData.length + ' test cases');

        return true;

    } catch (e) {
        karate.log('Lỗi khi thêm dữ liệu vào Excel: ' + e.message);
        return false;
    }
} 