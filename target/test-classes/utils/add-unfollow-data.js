function fn(excelFilePath, sheetName) {
    var XLSX = Java.type('org.apache.poi.xssf.usermodel.XSSFWorkbook');
    var FileInputStream = Java.type('java.io.FileInputStream');
    var FileOutputStream = Java.type('java.io.FileOutputStream');
    var File = Java.type('java.io.File');

    try {
        var file = new File(excelFilePath);
        var fis = new FileInputStream(file);
        var workbook = new XLSX(fis);

        // Xóa sheet cũ nếu tồn tại
        var oldSheet = workbook.getSheet(sheetName);
        if (oldSheet != null) {
            workbook.removeSheetAt(workbook.getSheetIndex(oldSheet));
        }

        // Tạo sheet mới
        var sheet = workbook.createSheet(sheetName);

        // Tạo header với thứ tự mới và thêm cột kết quả
        var headerRow = sheet.createRow(0);
        var headers = ['bearerToken', 'followingId', 'testDescription', 'expectedStatus', 'expectedResult', 'responseStatus', 'result'];
        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases
        var testData = [
            // TC1: Unfollow hợp lệ
            {
                bearerToken: '',
                followingId: 'user123',
                testDescription: 'Unfollow hợp lệ',
                expectedStatus: 200,
                expectedResult: '{"message": "Hủy theo dõi thành công"}',
                responseStatus: '',
                result: ''
            },
            // TC2: Thiếu trường followingId
            {
                bearerToken: '',
                followingId: '',
                testDescription: 'Thiếu trường followingId',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId is required"}',
                responseStatus: '',
                result: ''
            },
            // TC3: followingId rỗng
            {
                bearerToken: '',
                followingId: '',
                testDescription: 'followingId rỗng',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot be empty"}',
                responseStatus: '',
                result: ''
            },
            // TC4: Thiếu token xác thực
            {
                bearerToken: 'NO_TOKEN',
                followingId: 'user123',
                testDescription: 'Thiếu token xác thực',
                expectedStatus: 401,
                expectedResult: '{"error": "Unauthorized"}',
                responseStatus: '',
                result: ''
            },
            // TC5: Token không hợp lệ
            {
                bearerToken: 'INVALID_TOKEN',
                followingId: 'user123',
                testDescription: 'Token không hợp lệ',
                expectedStatus: 401,
                expectedResult: '{"error": "Invalid or expired token"}',
                responseStatus: '',
                result: ''
            },
            // TC6: followingId không tồn tại
            {
                bearerToken: '',
                followingId: 'nonexistent123',
                testDescription: 'followingId không tồn tại',
                expectedStatus: 404,
                expectedResult: '{"error": "User not found"}',
                responseStatus: '',
                result: ''
            },
            // TC7: Unfollow chính mình
            {
                bearerToken: '',
                followingId: 'SELF_ID',
                testDescription: 'Unfollow chính mình',
                expectedStatus: 400,
                expectedResult: '{"error": "Cannot unfollow yourself"}',
                responseStatus: '',
                result: ''
            },
            // TC8: Chưa follow trước đó
            {
                bearerToken: '',
                followingId: 'user123',
                testDescription: 'Chưa follow trước đó',
                expectedStatus: 404,
                expectedResult: '{"error": "You are not following this user"}',
                responseStatus: '',
                result: ''
            },
            // TC9: followingId không hợp lệ
            {
                bearerToken: '',
                followingId: 'invalid_id!@#',
                testDescription: 'followingId không hợp lệ',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid followingId format"}',
                responseStatus: '',
                result: ''
            },
            // TC10: Kiểm tra SQL Injection
            {
                bearerToken: '',
                followingId: "user123' OR '1'='1",
                testDescription: 'Kiểm tra SQL Injection',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}',
                responseStatus: '',
                result: ''
            },
            // TC11: Kiểm tra XSS
            {
                bearerToken: '',
                followingId: '<script>alert("xss")</script>',
                testDescription: 'Kiểm tra XSS',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}',
                responseStatus: '',
                result: ''
            },
            // TC12: Kiểm tra khoảng trắng
            {
                bearerToken: '',
                followingId: ' ',
                testDescription: 'Kiểm tra khoảng trắng',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot contain only whitespace"}',
                responseStatus: '',
                result: ''
            },
            // TC13: Kiểm tra ký tự Unicode
            {
                bearerToken: '',
                followingId: 'user😊123',
                testDescription: 'Kiểm tra ký tự Unicode',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid followingId format"}',
                responseStatus: '',
                result: ''
            },
            // TC14: Kiểm tra trường null
            {
                bearerToken: '',
                followingId: 'NULL_VALUE',
                testDescription: 'Kiểm tra trường null',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot be null"}',
                responseStatus: '',
                result: ''
            },
            // TC15: Kiểm tra độ dài followingId
            {
                bearerToken: '',
                followingId: 'a'.repeat(37),
                testDescription: 'Kiểm tra độ dài followingId',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId exceeds maximum length"}',
                responseStatus: '',
                result: ''
            },
            // TC16: Kiểm tra giới hạn ký tự biên
            {
                bearerToken: '',
                followingId: 'a'.repeat(36),
                testDescription: 'Kiểm tra giới hạn ký tự biên',
                expectedStatus: 200,
                expectedResult: '{"message": "Hủy theo dõi thành công"}',
                responseStatus: '',
                result: ''
            }
        ];

        // Thêm dữ liệu vào sheet với thứ tự mới và cột kết quả
        for (var i = 0; i < testData.length; i++) {
            var row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(testData[i].bearerToken);
            row.createCell(1).setCellValue(testData[i].followingId);
            row.createCell(2).setCellValue(testData[i].testDescription);
            row.createCell(3).setCellValue(testData[i].expectedStatus);
            row.createCell(4).setCellValue(testData[i].expectedResult);
            row.createCell(5).setCellValue(testData[i].responseStatus);
            row.createCell(6).setCellValue(testData[i].result);
        }

        // Lưu workbook
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        workbook.close();
        fis.close();
        fos.close();

        return true;
    } catch (e) {
        karate.log('Error in add-unfollow-data.js:', e);
        return false;
    }
} 