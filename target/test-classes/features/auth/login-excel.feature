Feature: Login Testing từ Excel - Sheet Login

  Background:
    * url baseUrl
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'login'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []

  Scenario: Chạy tất cả test cases từ Excel Login sheet
    * def runTest = 
      """
      function(testCase, index) {
        karate.log('Đang chạy test case #' + (index + 1) + ': ' + testCase.testDescription);
        
        var requestBody = {};
        if (testCase.email && testCase.email !== '') {
          requestBody.email = testCase.email;
        }
        if (testCase.password && testCase.password !== '') {
          requestBody.password = testCase.password;
        }
        
        var response = karate.call('classpath:features/helpers/login-single-call.feature', {
          email: testCase.email || '',
          password: testCase.password || ''
        });
        
        var actualStatus = response.actualStatus;
        var actualResult = '';
        
        // Ghi response thực tế vào result
        if (response.actualResponse) {
          actualResult = JSON.stringify(response.actualResponse);
        } else {
          actualResult = 'No response body';
        }
        
        // Kiểm tra xem kết quả có khớp với expected không (chỉ để log)
        var isExpectedStatus = (actualStatus == testCase.expectedStatus);
        if (!isExpectedStatus) {
          karate.log('STATUS MISMATCH - Expected: ' + testCase.expectedStatus + ', Actual: ' + actualStatus);
        }
        
        // Log chi tiết để debug
        karate.log('Test Case Data:', testCase);
        karate.log('Expected Status:', testCase.expectedStatus);
        karate.log('Expected Result:', testCase.expectedResult);
        karate.log('Actual Status:', actualStatus);
        karate.log('Is Expected Status:', isExpectedStatus);
        
        karate.log('Test case #' + (index + 1) + ' - Status: ' + actualStatus + ', Result: ' + actualResult);
        
        return {
          responseStatus: actualStatus,
          result: actualResult
        };
      }
      """
    
    # Chạy từng test case
    * def results = karate.map(testData, runTest)
    * def testResults = results
    * print 'Hoàn thành tất cả test cases. Đang ghi kết quả vào Excel...'
    
    # Ghi kết quả vào Excel
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('Đã ghi kết quả vào Excel thành công!')
    * if (!writeSuccess) karate.log('Lỗi khi ghi kết quả vào Excel!') 