function readExcel(filePath, sheetName) {
    var FileInputStream = Java.type('java.io.FileInputStream');
    var XSSFWorkbook = Java.type('org.apache.poi.xssf.usermodel.XSSFWorkbook');
    var File = Java.type('java.io.File');

    try {
        // Đọc file Excel
        var file = new File(filePath);
        var fis = new FileInputStream(file);
        var workbook = new XSSFWorkbook(fis);

        // Lấy sheet (nếu không có sheetName thì lấy sheet đầu tiên)
        var sheet = sheetName ? workbook.getSheet(sheetName) : workbook.getSheetAt(0);

        if (!sheet) {
            throw new Error('Sheet không tồn tại: ' + sheetName);
        }

        var result = [];
        var headerRow = sheet.getRow(0);
        var headers = [];

        // Đọc headers
        for (var i = 0; i < headerRow.getLastCellNum(); i++) {
            var cell = headerRow.getCell(i);
            headers.push(cell ? cell.getStringCellValue() : '');
        }

        // Đọc data rows
        for (var rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            var row = sheet.getRow(rowIndex);
            if (!row) continue;

            var rowData = {};
            for (var colIndex = 0; colIndex < headers.length; colIndex++) {
                var cell = row.getCell(colIndex);
                var cellValue = '';

                if (cell) {
                    switch (cell.getCellType()) {
                        case cell.getCellType().STRING:
                            cellValue = cell.getStringCellValue();
                            break;
                        case cell.getCellType().NUMERIC:
                            cellValue = cell.getNumericCellValue();
                            break;
                        case cell.getCellType().BOOLEAN:
                            cellValue = cell.getBooleanCellValue();
                            break;
                        default:
                            cellValue = '';
                    }
                }

                rowData[headers[colIndex]] = cellValue;
            }
            result.push(rowData);
        }

        workbook.close();
        fis.close();

        return result;
    } catch (e) {
        karate.log('Lỗi khi đọc Excel file:', e.message);
        return [];
    }
}

function writeToExcel(filePath, sheetName, testResults) {
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

        // Tìm cột responseStatus và result
        var headerRow = sheet.getRow(0);
        var responseStatusColIndex = -1;
        var resultColIndex = -1;

        for (var i = 0; i < headerRow.getLastCellNum(); i++) {
            var cell = headerRow.getCell(i);
            if (cell) {
                var cellValue = cell.getStringCellValue();
                if (cellValue === 'responseStatus') {
                    responseStatusColIndex = i;
                } else if (cellValue === 'result') {
                    resultColIndex = i;
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

            // Ghi responseStatus
            var statusCell = row.getCell(responseStatusColIndex);
            if (!statusCell) {
                statusCell = row.createCell(responseStatusColIndex);
            }
            statusCell.setCellValue(result.responseStatus || '');

            // Ghi result
            var resultCell = row.getCell(resultColIndex);
            if (!resultCell) {
                resultCell = row.createCell(resultColIndex);
            }
            resultCell.setCellValue(result.result || '');
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

function readCSV(filePath) {
    var Files = Java.type('java.nio.file.Files');
    var Paths = Java.type('java.nio.file.Paths');

    try {
        var lines = Files.readAllLines(Paths.get(filePath));
        var result = [];

        if (lines.size() === 0) return result;

        // Đọc header
        var headers = lines.get(0).split(',');

        // Đọc data
        for (var i = 1; i < lines.size(); i++) {
            var values = lines.get(i).split(',');
            var rowData = {};

            for (var j = 0; j < headers.length; j++) {
                var value = j < values.length ? values[j].trim() : '';
                // Convert number strings to numbers
                if (value && !isNaN(value)) {
                    value = parseInt(value);
                }
                rowData[headers[j].trim()] = value;
            }
            result.push(rowData);
        }

        return result;
    } catch (e) {
        karate.log('Lỗi khi đọc CSV file:', e.message);
        return [];
    }
} 