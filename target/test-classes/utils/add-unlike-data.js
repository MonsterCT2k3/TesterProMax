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

        // Tạo header theo thứ tự mới
        var headerRow = sheet.createRow(0);
        var headers = ['bearerToken', 'targetId', 'testDescription', 'expectedStatus', 'expectedResult', 'responseStatus', 'result'];
        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases (bỏ type, fix cứng type = "post")
        var testData = [
            // TC1: Unlike post hợp lệ
            {
                bearerToken: '',
                targetId: 'c8161412-bc98-49ec-88ff-57b99cc2ce67',
                testDescription: 'Unlike post hợp lệ',
                expectedStatus: 200,
                expectedResult: '{"message": "Unliked successfully"}'
            },
            // TC2: Thiếu trường targetId
            {
                bearerToken: '',
                targetId: '',
                testDescription: 'Thiếu trường targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "targetId is required"}'
            },
            // TC3: targetId rỗng
            {
                bearerToken: '',
                targetId: '',
                testDescription: 'targetId rỗng',
                expectedStatus: 400,
                expectedResult: '{"error": "targetId cannot be empty"}'
            },
            // TC4: Thiếu token xác thực
            {
                bearerToken: 'NO_TOKEN',
                targetId: 'c8161412-bc98-49ec-88ff-57b99cc2ce67',
                testDescription: 'Thiếu token xác thực',
                expectedStatus: 401,
                expectedResult: '{"error": "Unauthorized"}'
            },
            // TC5: Token không hợp lệ
            {
                bearerToken: 'INVALID_TOKEN',
                targetId: 'c8161412-bc98-49ec-88ff-57b99cc2ce67',
                testDescription: 'Token không hợp lệ',
                expectedStatus: 401,
                expectedResult: '{"error": "Invalid or expired token"}'
            },
            // TC6: targetId không tồn tại
            {
                bearerToken: '',
                targetId: 'nonexistent-id-123',
                testDescription: 'targetId không tồn tại',
                expectedStatus: 404,
                expectedResult: '{"error": "Target not found"}'
            },
            // TC7: Chưa like trước đó
            {
                bearerToken: '',
                targetId: 'c8161412-bc98-49ec-88ff-57b99cc2ce67',
                testDescription: 'Chưa like trước đó',
                expectedStatus: 400,
                expectedResult: '{"error": "Not liked yet"}'
            },
            // TC8: targetId không hợp lệ format
            {
                bearerToken: '',
                targetId: 'invalid_id!@#',
                testDescription: 'targetId không hợp lệ format',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid targetId format"}'
            },
            // TC9: Kiểm tra SQL Injection trong targetId
            {
                bearerToken: '',
                targetId: "target123' OR '1'='1",
                testDescription: 'Kiểm tra SQL Injection trong targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}'
            },
            // TC10: Kiểm tra XSS trong targetId
            {
                bearerToken: '',
                targetId: '<script>alert("xss")</script>',
                testDescription: 'Kiểm tra XSS trong targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid input"}'
            },
            // TC11: Kiểm tra khoảng trắng trong targetId
            {
                bearerToken: '',
                targetId: ' ',
                testDescription: 'Kiểm tra khoảng trắng trong targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "targetId cannot contain only whitespace"}'
            },
            // TC12: Kiểm tra trường null targetId
            {
                bearerToken: '',
                targetId: 'NULL_VALUE',
                testDescription: 'Kiểm tra trường null targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "targetId cannot be null"}'
            },
            // TC13: Kiểm tra độ dài targetId quá dài
            {
                bearerToken: '',
                targetId: 'a'.repeat(500),
                testDescription: 'Kiểm tra độ dài targetId quá dài',
                expectedStatus: 400,
                expectedResult: '{"error": "targetId exceeds maximum length"}'
            },
            // TC14: Kiểm tra ký tự đặc biệt trong targetId
            {
                bearerToken: '',
                targetId: 'target@#$%^&*()',
                testDescription: 'Kiểm tra ký tự đặc biệt trong targetId',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid targetId format"}'
            },
            // TC15: Unlike với UUID hợp lệ khác
            {
                bearerToken: '',
                targetId: '550e8400-e29b-41d4-a716-446655440000',
                testDescription: 'Unlike với UUID hợp lệ khác',
                expectedStatus: 200,
                expectedResult: '{"message": "Unliked successfully"}'
            }
        ];

        // Thêm dữ liệu vào sheet theo thứ tự mới
        for (var i = 0; i < testData.length; i++) {
            var row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(testData[i].bearerToken);
            row.createCell(1).setCellValue(testData[i].targetId);
            row.createCell(2).setCellValue(testData[i].testDescription);
            row.createCell(3).setCellValue(testData[i].expectedStatus);
            row.createCell(4).setCellValue(testData[i].expectedResult);
            // Cột 5 và 6 sẽ được ghi kết quả sau khi chạy test
        }

        // Lưu workbook
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        workbook.close();
        fis.close();
        fos.close();

        return true;
    } catch (e) {
        karate.log('Error in add-unlike-data.js:', e);
        return false;
    }
} 