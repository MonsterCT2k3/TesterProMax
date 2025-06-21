function(filePath, sheetName) {
    var ExcelReader = Java.type('org.apache.poi.xssf.usermodel.XSSFWorkbook');
    var FileInputStream = Java.type('java.io.FileInputStream');
    var FileOutputStream = Java.type('java.io.FileOutputStream');
    var File = Java.type('java.io.File');

    try {
        var file = new File(filePath);
        var workbook;

        if (file.exists()) {
            var fis = new FileInputStream(file);
            workbook = new ExcelReader(fis);
            fis.close();
        } else {
            workbook = new ExcelReader();
        }

        var sheet = workbook.getSheet(sheetName);
        if (sheet == null) {
            sheet = workbook.createSheet(sheetName);
        }

        // Xóa tất cả dữ liệu cũ
        var lastRowNum = sheet.getLastRowNum();
        for (var i = lastRowNum; i >= 0; i--) {
            var row = sheet.getRow(i);
            if (row != null) {
                sheet.removeRow(row);
            }
        }

        // Tạo header row đơn giản - chỉ cần bearerToken, không cần login
        var headerRow = sheet.createRow(0);
        var headers = [
            'bearerToken', 'oldPassword', 'newPassword',
            'expectedStatus', 'expectedResult', 'testDescription',
            'responseStatus', 'result'
        ];

        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases cho change password theo yêu cầu chi tiết - 20 test cases
        var testCases = [
            {
                bearerToken: '', // TC1: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: 'NewPass456',
                expectedStatus: '200',
                expectedResult: '{"message": "Password changed successfully"}',
                testDescription: 'TC1: Thay đổi mật khẩu hợp lệ'
            },
            {
                bearerToken: '', // TC2: Sử dụng global token
                oldPassword: '',
                newPassword: 'NewPass456',
                expectedStatus: '400',
                expectedResult: '{"error": "Old password is required"}',
                testDescription: 'TC2: Thiếu trường oldPassword'
            },
            {
                bearerToken: '', // TC3: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: '',
                expectedStatus: '400',
                expectedResult: '{"error": "New password is required"}',
                testDescription: 'TC3: Thiếu trường newPassword'
            },
            {
                bearerToken: 'NO_TOKEN', // TC4: Không có token
                oldPassword: 'Password123',
                newPassword: 'NewPass456',
                expectedStatus: '401',
                expectedResult: '{"error": "Unauthorized"}',
                testDescription: 'TC4: Thiếu token xác thực'
            },
            {
                bearerToken: 'invalid_token_12345', // TC5: Token không hợp lệ
                oldPassword: 'Password123',
                newPassword: 'NewPass456',
                expectedStatus: '401',
                expectedResult: '{"error": "Invalid or expired token"}',
                testDescription: 'TC5: Token không hợp lệ'
            },
            {
                bearerToken: '', // TC6: Sử dụng global token
                oldPassword: 'WrongPass123',
                newPassword: 'NewPass456',
                expectedStatus: '401',
                expectedResult: '{"error": "Old password is incorrect"}',
                testDescription: 'TC6: oldPassword sai'
            },
            {
                bearerToken: '', // TC7: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: 'New12',
                expectedStatus: '400',
                expectedResult: '{"error": "New password must be at least 6 characters"}',
                testDescription: 'TC7: newPassword quá ngắn'
            },
            {
                bearerToken: '', // TC8: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: 'Password123',
                expectedStatus: '400',
                expectedResult: '{"error": "New password must be different from old password"}',
                testDescription: 'TC8: newPassword giống oldPassword'
            },
            {
                bearerToken: '', // TC9: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: 'NewPassword',
                expectedStatus: '400',
                expectedResult: '{"error": "New password must contain at least one number"}',
                testDescription: 'TC9: newPassword không chứa số'
            },
            {
                bearerToken: '', // TC10: Sử dụng global token (129 ký tự)
                oldPassword: 'Password123',
                newPassword: 'A'.repeat(129),
                expectedStatus: '400',
                expectedResult: '{"error": "New password exceeds maximum length"}',
                testDescription: 'TC10: newPassword quá dài'
            },
            {
                bearerToken: '', // TC11: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: "NewPass' OR '1'='1",
                expectedStatus: '400',
                expectedResult: '{"error": "Invalid input"}',
                testDescription: 'TC11: Kiểm tra SQL Injection'
            },
            {
                bearerToken: '', // TC12: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: "<script>alert('xss')</script>",
                expectedStatus: '400',
                expectedResult: '{"error": "Invalid input"}',
                testDescription: 'TC12: Kiểm tra XSS'
            },
            {
                bearerToken: '', // TC13: Sử dụng global token
                oldPassword: '',
                newPassword: '',
                expectedStatus: '400',
                expectedResult: '{"error": "All fields are required"}',
                testDescription: 'TC13: Tất cả các trường rỗng'
            },
            {
                bearerToken: '', // TC14: Sử dụng global token
                oldPassword: ' ',
                newPassword: ' ',
                expectedStatus: '400',
                expectedResult: '{"error": "Fields cannot contain only whitespace"}',
                testDescription: 'TC14: Kiểm tra khoảng trắng'
            },
            {
                bearerToken: '', // TC15: Sử dụng global token
                oldPassword: 'Password123',
                newPassword: 'NewPass😊456',
                expectedStatus: '200',
                expectedResult: '{"message": "Password changed successfully"}',
                testDescription: 'TC15: Kiểm tra ký tự Unicode'
            },
            {
                bearerToken: '', // TC16: Performance test - sẽ được thực hiện riêng
                oldPassword: 'Password123',
                newPassword: 'NewPass456',
                expectedStatus: '200',
                expectedResult: '{"message": "Password changed successfully"}',
                testDescription: 'TC16: Kiểm tra độ trễ phản hồi (stress test)'
            },
            {
                bearerToken: '', // TC17: Content-Type test - sẽ được handle trong helper
                oldPassword: 'Password123',
                newPassword: 'NewPass456',
                expectedStatus: '415',
                expectedResult: '{"error": "Unsupported Media Type"}',
                testDescription: 'TC17: Kiểm tra Content-Type không hợp lệ'
            },
            {
                bearerToken: '', // TC18: Sử dụng global token
                oldPassword: 'NULL_VALUE',
                newPassword: 'NULL_VALUE',
                expectedStatus: '400',
                expectedResult: '{"error": "Fields cannot be null"}',
                testDescription: 'TC18: Kiểm tra trường null'
            },
            {
                bearerToken: '', // TC19: Sử dụng global token (128 ký tự - giới hạn tối đa)
                oldPassword: 'Password123',
                newPassword: 'A'.repeat(128),
                expectedStatus: '200',
                expectedResult: '{"message": "Password changed successfully"}',
                testDescription: 'TC19: Kiểm tra giới hạn ký tự biên'
            },
            {
                bearerToken: '', // TC20: Sử dụng global token
                oldPassword: 'Password',
                newPassword: 'NewPass456',
                expectedStatus: '401',
                expectedResult: '{"error": "Old password is incorrect"}',
                testDescription: 'TC20: Kiểm tra oldPassword không chứa số'
            }
        ];

        // Thêm dữ liệu vào sheet với cấu trúc mới (không có loginEmail/loginPassword)
        for (var i = 0; i < testCases.length; i++) {
            var dataRow = sheet.createRow(i + 1);
            var testCase = testCases[i];

            dataRow.createCell(0).setCellValue(testCase.bearerToken);
            dataRow.createCell(1).setCellValue(testCase.oldPassword);
            dataRow.createCell(2).setCellValue(testCase.newPassword);
            dataRow.createCell(3).setCellValue(testCase.expectedStatus);
            dataRow.createCell(4).setCellValue(testCase.expectedResult);
            dataRow.createCell(5).setCellValue(testCase.testDescription);
            dataRow.createCell(6).setCellValue(''); // responseStatus - sẽ được điền sau
            dataRow.createCell(7).setCellValue(''); // result - sẽ được điền sau
        }

        // Auto-size columns
        for (var i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Ghi file
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        fos.close();
        workbook.close();

        karate.log('Đã thêm ' + testCases.length + ' test cases change password vào Excel');
        return true;

    } catch (e) {
        karate.log('Lỗi khi thêm dữ liệu change password:', e);
        return false;
    }
} 