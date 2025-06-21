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

        // Tạo header
        var headerRow = sheet.createRow(0);
        var headers = ['testDescription', 'followingId', 'bearerToken', 'expectedStatus', 'expectedResult'];
        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases
        var testData = [
            // TC1: Follow hợp lệ
            {
                testDescription: 'Follow hợp lệ',
                followingId: 'user123',
                bearerToken: '',
                expectedStatus: 200,
                expectedResult: '{"message": "Followed successfully"}'
            },
            // TC2: Thiếu trường followingId
            {
                testDescription: 'Thiếu trường followingId',
                followingId: '',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId is required"}'
            },
            // TC3: followingId rỗng
            {
                testDescription: 'followingId rỗng',
                followingId: '',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot be empty"}'
            },
            // TC4: Thiếu token xác thực
            {
                testDescription: 'Thiếu token xác thực',
                followingId: 'user123',
                bearerToken: 'NO_TOKEN',
                expectedStatus: 401,
                expectedResult: '{"error": "Unauthorized"}'
            },
            // TC5: Token không hợp lệ
            {
                testDescription: 'Token không hợp lệ',
                followingId: 'user123',
                bearerToken: 'INVALID_TOKEN',
                expectedStatus: 401,
                expectedResult: '{"error": "Invalid or expired token"}'
            },
            // TC6: followingId không tồn tại
            {
                testDescription: 'followingId không tồn tại',
                followingId: 'nonexistent123',
                bearerToken: '',
                expectedStatus: 404,
                expectedResult: '{"error": "User not found"}'
            },
            // TC7: Follow chính mình
            {
                testDescription: 'Follow chính mình',
                followingId: 'SELF_ID',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Cannot follow yourself"}'
            },
            // TC8: Đã follow trước đó
            {
                testDescription: 'Đã follow trước đó',
                followingId: 'user123',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Already following this user"}'
            },
            // TC9: followingId không hợp lệ
            {
                testDescription: 'followingId không hợp lệ',
                followingId: 'invalid_id!@#',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid followingId format"}'
            },
            // TC10: Kiểm tra SQL Injection
            {
                testDescription: 'Kiểm tra SQL Injection',
                followingId: "user123' OR '1'='1",
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}'
            },
            // TC11: Kiểm tra XSS
            {
                testDescription: 'Kiểm tra XSS',
                followingId: '<script>alert("xss")</script>',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}'
            },
            // TC12: Kiểm tra khoảng trắng
            {
                testDescription: 'Kiểm tra khoảng trắng',
                followingId: ' ',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot contain only whitespace"}'
            },
            // TC13: Kiểm tra ký tự Unicode
            {
                testDescription: 'Kiểm tra ký tự Unicode',
                followingId: 'user😊123',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid followingId format"}'
            },
            // TC15: Kiểm tra Content-Type không hợp lệ
            {
                testDescription: 'Kiểm tra Content-Type không hợp lệ',
                followingId: 'user123',
                bearerToken: '',
                expectedStatus: 415,
                expectedResult: '{"error": "Unsupported Media Type"}'
            },
            // TC16: Kiểm tra trường null
            {
                testDescription: 'Kiểm tra trường null',
                followingId: 'NULL_VALUE',
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId cannot be null"}'
            },
            // TC17: Kiểm tra độ dài followingId
            {
                testDescription: 'Kiểm tra độ dài followingId',
                followingId: 'a'.repeat(37),
                bearerToken: '',
                expectedStatus: 400,
                expectedResult: '{"error": "followingId exceeds maximum length"}'
            },
            // TC18: Kiểm tra giới hạn ký tự biên
            {
                testDescription: 'Kiểm tra giới hạn ký tự biên',
                followingId: 'a'.repeat(36),
                bearerToken: '',
                expectedStatus: 200,
                expectedResult: '{"message": "Followed successfully"}'
            }
        ];

        // Thêm dữ liệu vào sheet
        for (var i = 0; i < testData.length; i++) {
            var row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(testData[i].testDescription);
            row.createCell(1).setCellValue(testData[i].followingId);
            row.createCell(2).setCellValue(testData[i].bearerToken);
            row.createCell(3).setCellValue(testData[i].expectedStatus);
            row.createCell(4).setCellValue(testData[i].expectedResult);
        }

        // Lưu workbook
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        workbook.close();
        fis.close();
        fos.close();

        return true;
    } catch (e) {
        karate.log('Error in add-follows-data.js:', e);
        return false;
    }
} 