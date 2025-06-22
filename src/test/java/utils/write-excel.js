function(filePath, sheetName, testResults) {
    var FileInputStream = Java.type('java.io.FileInputStream');
    var FileOutputStream = Java.type('java.io.FileOutputStream');
    var XSSFWorkbook = Java.type('org.apache.poi.xssf.usermodel.XSSFWorkbook');
    var File = Java.type('java.io.File');

    try {
        var file = new File(filePath);
        var workbook;

        // Mở file Excel hiện có hoặc tạo mới
        if (file.exists()) {
            var fis = new FileInputStream(file);
            workbook = new XSSFWorkbook(fis);
            fis.close();
        } else {
            workbook = new XSSFWorkbook();
        }

        var sheet = workbook.getSheet(sheetName);
        if (!sheet) {
            karate.log('Sheet không tồn tại: ' + sheetName);
            workbook.close();
            return false;
        }

        // Tìm các cột cần ghi
        var headerRow = sheet.getRow(0);
        var responseStatusColIndex = -1;
        var resultColIndex = -1;
        var testStatusColIndex = -1;
        var failureReasonColIndex = -1;

        for (var i = 0; i < headerRow.getLastCellNum(); i++) {
            var cell = headerRow.getCell(i);
            if (cell) {
                var cellValue = cell.getStringCellValue();
                if (cellValue === 'responseStatus') {
                    responseStatusColIndex = i;
                } else if (cellValue === 'result') {
                    resultColIndex = i;
                } else if (cellValue === 'testStatus') {
                    testStatusColIndex = i;
                } else if (cellValue === 'failureReason') {
                    failureReasonColIndex = i;
                }
            }
        }

        if (responseStatusColIndex === -1 || resultColIndex === -1) {
            karate.log('Không tìm thấy cột responseStatus hoặc result');
            workbook.close();
            return false;
        }

        // Ghi kết quả vào file
        for (var i = 0; i < testResults.length; i++) {
            var rowIndex = i + 1; // Bỏ qua header row
            var row = sheet.getRow(rowIndex);
            if (!row) continue;

            var result = testResults[i];

            // Ghi responseStatus với kiểm tra kiểu dữ liệu
            var statusCell = row.getCell(responseStatusColIndex);
            if (!statusCell) {
                statusCell = row.createCell(responseStatusColIndex);
            }
            var statusValue = result.responseStatus;
            if (statusValue !== null && statusValue !== undefined) {
                // Chuyển sang string và ghi vào Excel
                statusCell.setCellValue(String(statusValue));
            }

            // Ghi result
            var resultCell = row.getCell(resultColIndex);
            if (!resultCell) {
                resultCell = row.createCell(resultColIndex);
            }
            var resultValue = result.result || '';
            resultCell.setCellValue(resultValue);

            // Ghi testStatus (nếu có cột này)
            if (testStatusColIndex !== -1 && result.testStatus) {
                var testStatusCell = row.getCell(testStatusColIndex);
                if (!testStatusCell) {
                    testStatusCell = row.createCell(testStatusColIndex);
                }
                testStatusCell.setCellValue(result.testStatus);
            }

            // Ghi failureReason (nếu có cột này)
            if (failureReasonColIndex !== -1 && result.failureReason) {
                var failureReasonCell = row.getCell(failureReasonColIndex);
                if (!failureReasonCell) {
                    failureReasonCell = row.createCell(failureReasonColIndex);
                }
                failureReasonCell.setCellValue(result.failureReason);
            }
        }

        // Lưu file
        var fos = new FileOutputStream(file);
        workbook.write(fos);
        fos.close();
        workbook.close();

        return true;
    } catch (e) {
        karate.log('Lỗi khi ghi Excel file:', e.message);
        return false;
    }
}