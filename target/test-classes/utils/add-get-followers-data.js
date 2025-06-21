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

        // Tạo header row theo ảnh
        var headerRow = sheet.createRow(0);
        var headers = [
            'bearerToken',
            'expectedStatus',
            'expectedResult',
            'testDescription',
            'responseStatus',
            'result'
        ];

        for (var i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Dữ liệu test cases cho getFollowers
        var testCases = [
            {
                bearerToken: '', // TC1: Sử dụng global token
                expectedStatus: '200',
                expectedResult: '{"status":"success","data":[]}',
                testDescription: 'TC1: Lấy danh sách followers thành công với token hợp lệ'
            },
            {
                bearerToken: 'NO_TOKEN',
                expectedStatus: '401',
                expectedResult: '{"error": "Unauthorized"}',
                testDescription: 'TC2: Lấy danh sách followers thất bại - Không truyền bearer token'
            },
            {
                bearerToken: 'invalid_token_12345',
                expectedStatus: '401',
                expectedResult: '{"error": "Invalid or expired token"}',
                testDescription: 'TC3: Lấy danh sách followers thất bại - Bearer token không hợp lệ'
            }
        ];

        // Thêm dữ liệu vào sheet
        for (var i = 0; i < testCases.length; i++) {
            var dataRow = sheet.createRow(i + 1);
            var testCase = testCases[i];

            dataRow.createCell(0).setCellValue(testCase.bearerToken);
            dataRow.createCell(1).setCellValue(testCase.expectedStatus);
            dataRow.createCell(2).setCellValue(testCase.expectedResult);
            dataRow.createCell(3).setCellValue(testCase.testDescription);
            dataRow.createCell(4).setCellValue(''); // responseStatus - sẽ được điền sau
            dataRow.createCell(5).setCellValue(''); // result - sẽ được điền sau
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

        karate.log('Đã thêm ' + testCases.length + ' test cases getFollowers vào Excel');
        return true;

    } catch (e) {
        karate.log('Lỗi khi thêm dữ liệu getFollowers:', e);
        return false;
    }
} 