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

        // Tạo header theo thứ tự yêu cầu
        var headerRow = sheet.createRow(0);
        var headers = ['bearerToken', 'page', 'limit', 'testDescription', 'expectedStatus', 'expectedResult', 'responseStatus', 'result'];
        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases cho getPostsFeed
        var testData = [
            // TC1: Get posts feed hợp lệ với page và limit
            {
                bearerToken: '',
                page: 1,
                limit: 10,
                testDescription: 'Get posts feed hợp lệ với page=1, limit=10',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC2: Get posts feed với page=2
            {
                bearerToken: '',
                page: 2,
                limit: 5,
                testDescription: 'Get posts feed với page=2, limit=5',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC3: Get posts feed không có page (default)
            {
                bearerToken: '',
                page: '',
                limit: 10,
                testDescription: 'Get posts feed không có page (default), limit=10',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC4: Get posts feed không có limit (default)
            {
                bearerToken: '',
                page: 1,
                limit: '',
                testDescription: 'Get posts feed page=1, không có limit (default)',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC5: Thiếu token xác thực
            {
                bearerToken: 'NO_TOKEN',
                page: 1,
                limit: 10,
                testDescription: 'Thiếu token xác thực',
                expectedStatus: 401,
                expectedResult: '{"error": "Unauthorized"}'
            },
            // TC6: Token không hợp lệ
            {
                bearerToken: 'INVALID_TOKEN',
                page: 1,
                limit: 10,
                testDescription: 'Token không hợp lệ',
                expectedStatus: 401,
                expectedResult: '{"error": "Invalid or expired token"}'
            },
            // TC7: Page số âm
            {
                bearerToken: '',
                page: -1,
                limit: 10,
                testDescription: 'Page số âm',
                expectedStatus: 400,
                expectedResult: '{"error": "Page must be positive number"}'
            },
            // TC8: Limit số âm
            {
                bearerToken: '',
                page: 1,
                limit: -5,
                testDescription: 'Limit số âm',
                expectedStatus: 400,
                expectedResult: '{"error": "Limit must be positive number"}'
            },
            // TC9: Page = 0
            {
                bearerToken: '',
                page: 0,
                limit: 10,
                testDescription: 'Page = 0',
                expectedStatus: 400,
                expectedResult: '{"error": "Page must be positive number"}'
            },
            // TC10: Limit = 0
            {
                bearerToken: '',
                page: 1,
                limit: 0,
                testDescription: 'Limit = 0',
                expectedStatus: 400,
                expectedResult: '{"error": "Limit must be positive number"}'
            },
            // TC11: Limit quá lớn
            {
                bearerToken: '',
                page: 1,
                limit: 1000,
                testDescription: 'Limit quá lớn (1000)',
                expectedStatus: 400,
                expectedResult: '{"error": "Limit exceeds maximum allowed"}'
            },
            // TC12: Page rất lớn (không có dữ liệu)
            {
                bearerToken: '',
                page: 9999,
                limit: 10,
                testDescription: 'Page rất lớn (9999) - không có dữ liệu',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC13: Kiểm tra SQL Injection trong page
            {
                bearerToken: '',
                page: "1' OR '1'='1",
                limit: 10,
                testDescription: 'Kiểm tra SQL Injection trong page',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid page parameter"}'
            },
            // TC14: Kiểm tra SQL Injection trong limit
            {
                bearerToken: '',
                page: 1,
                limit: "10' OR '1'='1",
                testDescription: 'Kiểm tra SQL Injection trong limit',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid limit parameter"}'
            },
            // TC15: Page và limit với giá trị string không hợp lệ
            {
                bearerToken: '',
                page: 'abc',
                limit: 'xyz',
                testDescription: 'Page và limit với giá trị string không hợp lệ',
                expectedStatus: 400,
                expectedResult: '{"error": "Invalid parameter format"}'
            },
            // TC16: Limit = 1 (minimum valid)
            {
                bearerToken: '',
                page: 1,
                limit: 1,
                testDescription: 'Limit = 1 (minimum valid)',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC17: Limit = 50 (maximum valid)
            {
                bearerToken: '',
                page: 1,
                limit: 50,
                testDescription: 'Limit = 50 (maximum valid)',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            },
            // TC18: Không có query parameters
            {
                bearerToken: '',
                page: '',
                limit: '',
                testDescription: 'Không có query parameters (sử dụng default)',
                expectedStatus: 200,
                expectedResult: '{"message": "Feed", "statusCode": 200, "status": "success", "data": []}'
            }
        ];

        // Thêm dữ liệu vào sheet theo thứ tự yêu cầu
        for (var i = 0; i < testData.length; i++) {
            var row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(testData[i].bearerToken);
            row.createCell(1).setCellValue(testData[i].page.toString());
            row.createCell(2).setCellValue(testData[i].limit.toString());
            row.createCell(3).setCellValue(testData[i].testDescription);
            row.createCell(4).setCellValue(testData[i].expectedStatus);
            row.createCell(5).setCellValue(testData[i].expectedResult);
            // Cột 6 và 7 sẽ được ghi kết quả sau khi chạy test
        }

        // Lưu workbook
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        workbook.close();
        fis.close();
        fos.close();

        return true;
    } catch (e) {
        karate.log('Error in add-get-posts-feed-data.js:', e);
        return false;
    }
} 