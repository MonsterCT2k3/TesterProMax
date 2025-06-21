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
            var cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // Dữ liệu test cho getUsers API
        var testData = [
            // Valid tests
            ['', '1', '10', 'TC1: Valid page and limit', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '1', '', 'TC2: Get first page without limit', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '', '5', 'TC3: Get users with small limit', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '2', '20', 'TC4: Get second page with larger limit', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '3', '15', 'TC5: Get middle page', '200', '{"statusCode": 200, "status": "success"}', '', ''],

            // Edge cases
            ['', '', '', 'TC6: No query parameters', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '0', '10', 'TC7: Zero page', '400', '{"statusCode": 400, "message": "Invalid page"}', '', ''],
            ['', '1', '0', 'TC8: Zero limit', '400', '{"statusCode": 400, "message": "Invalid limit"}', '', ''],
            ['', '9999', '10', 'TC9: Large page number', '200', '{"statusCode": 200, "status": "success"}', '', ''],
            ['', '1', '9999', 'TC10: Large limit value', '400', '{"statusCode": 400, "message": "Limit too large"}', '', ''],

            // Invalid tests
            ['', '-1', '10', 'TC11: Negative page', '400', '{"statusCode": 400, "message": "Invalid page"}', '', ''],
            ['', '1', '-5', 'TC12: Negative limit', '400', '{"statusCode": 400, "message": "Invalid limit"}', '', ''],
            ['', 'abc', '10', 'TC13: Non-numeric page', '400', '{"statusCode": 400, "message": "Invalid page format"}', '', ''],
            ['', '1', 'xyz', 'TC14: Non-numeric limit', '400', '{"statusCode": 400, "message": "Invalid limit format"}', '', ''],
            ['', '1', '10', 'TC15: Empty bearer token', '401', '{"statusCode": 401, "message": "Unauthorized"}', '', '']
        ];

        // Thêm dữ liệu vào sheet
        for (var i = 0; i < testData.length; i++) {
            var row = sheet.createRow(i + 1);
            for (var j = 0; j < testData[i].length; j++) {
                var cell = row.createCell(j);
                cell.setCellValue(testData[i][j]);
            }
        }

        // Auto-size columns
        for (var i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        fis.close();

        // Ghi file
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        fos.close();
        workbook.close();

        karate.log('✅ Đã tạo thành công ' + testData.length + ' test cases cho getUsers API trong sheet: ' + sheetName);
        return true;

    } catch (e) {
        karate.log('❌ Lỗi khi tạo test data cho getUsers: ' + e.message);
        return false;
    }
} 