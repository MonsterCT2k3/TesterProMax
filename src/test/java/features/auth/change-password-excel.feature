Feature: Change Password Testing từ Excel - Sheet changePassword

  Background:
    * url baseUrl
    * def config = karate.call('classpath:karate-config.js')
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'changePassword'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []
    * def globalBearerToken = config.bearerToken
    * print 'Sử dụng global bearer token từ config:', globalBearerToken

  Scenario: Chạy tất cả test cases change password từ Excel
    * def runTest = 
      """
      function(testCase, index) {
        karate.log('Đang chạy test case #' + (index + 1) + ': ' + testCase.testDescription);
        
        var bearerToken = '';
        
        // Sử dụng bearer token từ test case hoặc global config
        if (testCase.bearerToken && testCase.bearerToken.trim() !== '') {
          if (testCase.bearerToken === 'NO_TOKEN') {
            // TC4: Không có token
            bearerToken = '';
            karate.log('Test case không sử dụng token');
          } else {
            // Sử dụng token từ Excel nếu có
            bearerToken = testCase.bearerToken;
            karate.log('Sử dụng bearer token từ Excel:', bearerToken);
          }
        } else {
          // Sử dụng global token từ config
          bearerToken = globalBearerToken;
          karate.log('Sử dụng global bearer token từ config:', bearerToken);
        }
        
        // Gọi API change password
        var response = karate.call('classpath:features/helpers/change-password-single-call.feature', {
          bearerToken: bearerToken,
          oldPassword: testCase.oldPassword || '',
          newPassword: testCase.newPassword || ''
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
        karate.log('Actual Status:', actualStatus);
        
        karate.log('Test case #' + (index + 1) + ' - Status: ' + actualStatus + ', Result: ' + actualResult);
        
        return {
          responseStatus: actualStatus,
          result: actualResult
        };
      }
      """
    
    * print 'Bắt đầu chạy từng test case...'
    * def results = karate.map(testData, runTest)
    * def testResults = results
    * print 'Hoàn thành tất cả test cases change password. Đang ghi kết quả vào Excel...'
    
    * print 'Ghi kết quả vào Excel...'
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('Đã ghi kết quả change password vào Excel thành công!')
    * if (!writeSuccess) karate.log('Lỗi khi ghi kết quả change password vào Excel!') 