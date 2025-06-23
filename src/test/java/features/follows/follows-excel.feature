Feature: Follows Testing từ Excel - Sheet follows

  Background:
    * url baseUrl
    * def config = karate.call('classpath:karate-config.js')
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'follows'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []
    * def globalBearerToken = config.bearerToken
    * print 'Sử dụng global bearer token từ config:', globalBearerToken

  Scenario: Chạy tất cả test cases follows từ Excel
    * def evaluateTestCase = 
      """
      function(testCase, actualStatus, actualResponse) {
        var expectedStatus = testCase.expectedStatus;
        
        // Chỉ so sánh Status Code
        if (actualStatus != expectedStatus) {
          return {
            status: 'FAIL',
            reason: 'Status mismatch: Expected ' + expectedStatus + ', got ' + actualStatus
          };
        }
        
        return {
          status: 'PASS',
          reason: 'All validations passed'
        };
      }
      """

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
          } else if (testCase.bearerToken === 'INVALID_TOKEN') {
            // TC5: Token không hợp lệ
            bearerToken = 'invalid_token_123';
            karate.log('Test case sử dụng token không hợp lệ');
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
        
        // Gọi API follows
        var response = karate.call('classpath:features/helpers/follows-single-call.feature', {
          bearerToken: bearerToken,
          followingId: testCase.followingId || ''
        });
        
        var actualStatus = response.actualStatus;
        var actualResult = '';
        
        // Ghi response thực tế vào result
        if (response.actualResponse) {
          actualResult = JSON.stringify(response.actualResponse);
        } else {
          actualResult = 'No response body';
        }
        
        // ===== ĐÁNH GIÁ PASS/FAIL =====
        var testEvaluation = evaluateTestCase(testCase, actualStatus, response.actualResponse);
        
        // Log kết quả đánh giá
        if (testEvaluation.status === 'FAIL') {
          karate.log('❌ TEST FAILED - ' + testEvaluation.reason);
        } else {
          karate.log('✅ TEST PASSED - ' + testEvaluation.reason);
        }
        
        // Log chi tiết để debug
        karate.log('Test Case Data:', testCase);
        karate.log('Expected Status:', testCase.expectedStatus);
        karate.log('Expected Result:', testCase.expectedResult);
        karate.log('Actual Status:', actualStatus);
        karate.log('Test Status:', testEvaluation.status);
        
        karate.log('Test case #' + (index + 1) + ' - Status: ' + actualStatus + ', Test Result: ' + testEvaluation.status);
        
        return {
          responseStatus: actualStatus,
          result: actualResult,
          testStatus: testEvaluation.status,
          failureReason: testEvaluation.reason
        };
      }
      """
    
    * print 'Bắt đầu chạy từng test case...'
    * def results = karate.map(testData, runTest)
    * def testResults = results
    
    # Đếm số test cases pass/fail
    * def passedTests = []
    * def failedTests = []
    * karate.forEach(testResults, function(test) { if (test.testStatus === 'PASS') passedTests.push(test); else failedTests.push(test); })
    
    * print '=== FOLLOWS TEST SUMMARY ==='
    * print 'Total test cases: ' + testResults.length
    * print 'Passed: ' + passedTests.length
    * print 'Failed: ' + failedTests.length
    * if (testResults.length > 0) print ('Success rate: ' + Math.round((passedTests.length / testResults.length) * 100) + '%')
    
    # Log failed tests
    * if (failedTests.length > 0) karate.forEach(failedTests, function(test, index) { karate.log('❌ Failed test #' + (index + 1) + ': ' + test.failureReason); })
    
    * print 'Hoàn thành tất cả test cases follows. Đang ghi kết quả vào Excel...'
    
    # Ghi kết quả vào Excel
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✅ Đã ghi kết quả follows vào Excel thành công!')
    * if (!writeSuccess) karate.log('❌ Lỗi khi ghi kết quả follows vào Excel!')
    
    # Warning nếu có test cases failed
    * if (failedTests.length > 0) karate.log('⚠️ WARNING: ' + failedTests.length + ' out of ' + testResults.length + ' test cases failed') 