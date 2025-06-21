Feature: GetUsers Testing từ Excel - Sheet getUsers

  Background:
    * url baseUrl
    * def config = karate.call('classpath:karate-config.js')
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'getUsers'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []
    * def globalBearerToken = config.bearerToken
    * print 'Sử dụng global bearer token từ config:', globalBearerToken

  Scenario: Chạy tất cả test cases getUsers từ Excel
    * def runTest = 
      """
      function(testCase, index) {
        karate.log('Đang chạy test case #' + (index + 1) + ': ' + testCase.testDescription);
        
        // Chuẩn bị dữ liệu test
        var bearerToken = testCase.bearerToken && testCase.bearerToken.trim() !== '' ? testCase.bearerToken : globalBearerToken;
        var page = testCase.page;
        var limit = testCase.limit;
        
        // Gọi helper feature
        var result = karate.call('classpath:features/helpers/get-users-single-call.feature', {
          bearerToken: bearerToken,
          page: page,
          limit: limit
        });
        
        // Chuẩn bị kết quả để ghi vào Excel
        var testResult = {
          bearerToken: testCase.bearerToken,
          page: testCase.page,
          limit: testCase.limit,
          testDescription: testCase.testDescription,
          expectedStatus: testCase.expectedStatus,
          expectedResult: testCase.expectedResult,
          responseStatus: result.actualStatus,
          result: JSON.stringify(result.actualResponse)
        };
        
        testResults.push(testResult);
        
        karate.log('✅ Test case #' + (index + 1) + ' completed - Status: ' + result.actualStatus);
        
        return testResult;
      }
      """

    # Chạy tất cả test cases
    * def results = karate.map(testData, runTest)
    * print 'Đã hoàn thành ' + results.length + ' test cases'

    # Ghi kết quả vào Excel
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✅ Đã ghi kết quả test vào Excel thành công!')
    * if (!writeSuccess) karate.log('❌ Lỗi khi ghi kết quả vào Excel!')

    # Log tổng hợp
    * print '=== TỔNG HỢP KẾT QUẢ GETUSERS API TESTING ==='
    * print 'Số test cases: ' + results.length
    * print 'Excel file: ' + excelFilePath
    * print 'Sheet name: ' + sheetName
    * print '=== KẾT THÚC GETUSERS TESTING ===' 