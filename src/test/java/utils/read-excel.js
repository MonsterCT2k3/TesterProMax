function(filePath, sheetName) {
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

        karate.log('Headers found:', headers);

        // Đọc data rows
        for (var rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            var row = sheet.getRow(rowIndex);
            if (!row) continue;

            var rowData = {};
            for (var colIndex = 0; colIndex < headers.length; colIndex++) {
                var cell = row.getCell(colIndex);
                var cellValue = '';

                if (cell) {
                    var cellType = cell.getCellType();
                    var CellType = Java.type('org.apache.poi.ss.usermodel.CellType');

                    if (cellType == CellType.STRING) {
                        cellValue = cell.getStringCellValue();
                    } else if (cellType == CellType.NUMERIC) {
                        cellValue = cell.getNumericCellValue();
                    } else if (cellType == CellType.BOOLEAN) {
                        cellValue = cell.getBooleanCellValue();
                    } else {
                        cellValue = '';
                    }
                }

                rowData[headers[colIndex]] = cellValue;
            }
            result.push(rowData);
        }

        workbook.close();
        fis.close();

        karate.log('Read data from Excel:', result);
        return result;
    } catch (e) {
        karate.log('Lỗi khi đọc Excel file:', e.message);
        return [];
    }
} 