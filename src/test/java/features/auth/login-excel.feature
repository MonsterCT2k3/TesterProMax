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
    * def evaluateTestCase = 
      """
      function(testCase, actualStatus, actualResponse) {
        var expectedStatus = testCase.expectedStatus;
        
        // 1. Kiểm tra Status Code (Bắt buộc)
        if (actualStatus != expectedStatus) {
          return {
            status: 'FAIL',
            reason: 'Status mismatch: Expected ' + expectedStatus + ', got ' + actualStatus
          };
        }
        
        // 2. Kiểm tra thêm nếu có expectedResult
        if (testCase.expectedResult && testCase.expectedResult.trim() !== '') {
          try {
            var expectedObj = JSON.parse(testCase.expectedResult);
            
            // Kiểm tra success response
            if (expectedStatus == 200 || expectedStatus == 201) {
              if (!actualResponse.success && !actualResponse.status) {
                return {
                  status: 'FAIL',
                  reason: 'Missing success indicator in response'
                };
              }
              if (expectedObj.token && !actualResponse.token) {
                return {
                  status: 'FAIL',
                  reason: 'Missing token in success response'
                };
              }
            }
            
            // Kiểm tra error response
            if (expectedStatus >= 400) {
              if (expectedObj.error && !actualResponse.error && !actualResponse.message) {
                return {
                  status: 'FAIL',
                  reason: 'Missing error message in error response'
                };
              }
            }
          } catch (e) {
            karate.log('Could not parse expectedResult as JSON, skipping detailed validation');
          }
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
    
    # Chạy từng test case
    * def results = karate.map(testData, runTest)
    * def testResults = results
    
    # Đếm số test cases pass/fail
    * def passedTests = []
    * def failedTests = []
    * karate.forEach(testResults, function(test) { if (test.testStatus === 'PASS') passedTests.push(test); else failedTests.push(test); })
    
    * print '=== LOGIN TEST SUMMARY ==='
    * print 'Total test cases: ' + testResults.length
    * print 'Passed: ' + passedTests.length
    * print 'Failed: ' + failedTests.length
    * if (testResults.length > 0) print ('Success rate: ' + Math.round((passedTests.length / testResults.length) * 100) + '%')
    
    # Log failed tests
    * if (failedTests.length > 0) karate.forEach(failedTests, function(test, index) { karate.log('❌ Failed test #' + (index + 1) + ': ' + test.failureReason); })
    
    * print 'Hoàn thành tất cả test cases. Đang ghi kết quả vào Excel...'
    
    # Ghi kết quả vào Excel
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✅ Đã ghi kết quả vào Excel thành công!')
    * if (!writeSuccess) karate.log('❌ Lỗi khi ghi kết quả vào Excel!')
    
    # Warning nếu có test cases failed
    * if (failedTests.length > 0) karate.log('⚠️ WARNING: ' + failedTests.length + ' out of ' + testResults.length + ' test cases failed') 