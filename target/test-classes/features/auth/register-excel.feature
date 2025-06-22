Feature: Register Testing từ Excel - Sheet Register

  Background:
    * url baseUrl
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'register'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []

  Scenario: Chạy tất cả test cases từ Excel Register sheet
    * def evaluateTestCase = 
      """
      function(testCase, actualStatus, actualResponse) {
        var expectedStatus = testCase.expectedStatus;
        
        // Chỉ so sánh Status Code
        if (actualStatus != expectedStatus) {
          return {
            testStatus: 'FAIL',
            failureReason: 'Status mismatch - Expected: ' + expectedStatus + ', Actual: ' + actualStatus
          };
        }
        
        // Nếu status code khớp thì PASS
        return { testStatus: 'PASS', failureReason: '' };
      }
      """

    * def runTest = 
      """
      function(testCase, index) {
        karate.log('==========================================');
        karate.log('ĐANG CHẠY TEST CASE #' + (index + 1) + '/' + testData.length);
        karate.log('Description: ' + testCase.testDescription);
        karate.log('Email: "' + testCase.email + '"');
        karate.log('Password: "' + testCase.password + '"');
        karate.log('Name: "' + testCase.name + '"');
        karate.log('Username: "' + testCase.username + '"');
        karate.log('PhoneNumber: "' + testCase.phoneNumber + '"');
        karate.log('Expected Status: ' + testCase.expectedStatus);
        karate.log('Expected Result: ' + testCase.expectedResult);
        karate.log('==========================================');
        
        var response = karate.call('classpath:features/helpers/register-single-call.feature', {
          email: testCase.email === 'null' ? null : testCase.email,
          password: testCase.password === 'null' ? null : testCase.password,
          name: testCase.name === 'null' ? null : testCase.name,
          username: testCase.username === 'null' ? null : testCase.username,
          phoneNumber: testCase.phoneNumber === 'null' ? null : testCase.phoneNumber,
          expectedStatus: testCase.expectedStatus,
          expectedResult: testCase.expectedResult
        });
        
        var actualStatus = response.responseStatus;
        var actualResponse = response.response;
        
        // Đánh giá test case
        var evaluation = evaluateTestCase(testCase, actualStatus, actualResponse);
        
        // Log kết quả
        karate.log('Actual Status: ' + actualStatus);
        karate.log('Actual Response: ' + JSON.stringify(actualResponse));
        karate.log('Test Status: ' + evaluation.testStatus);
        if (evaluation.failureReason) {
          karate.log('Failure Reason: ' + evaluation.failureReason);
        }
        
        if (evaluation.testStatus === 'PASS') {
          karate.log('✓ TEST CASE #' + (index + 1) + ' PASSED');
        } else {
          karate.log('✗ TEST CASE #' + (index + 1) + ' FAILED: ' + evaluation.failureReason);
        }
        karate.log('==========================================');
        
        return {
          responseStatus: actualStatus,
          result: actualResponse ? JSON.stringify(actualResponse) : 'No response body',
          testStatus: evaluation.testStatus,
          failureReason: evaluation.failureReason || ''
        };
      }
      """
    
    # Chạy từng test case
    * def results = karate.map(testData, runTest)
    * def testResults = results
    
    # Ghi kết quả vào Excel
    * print '=== GHI KẾT QUẢ VÀO EXCEL ==='
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✓ Đã ghi kết quả vào Excel thành công!')
    * if (!writeSuccess) karate.log('✗ Lỗi khi ghi kết quả vào Excel!')
    
    # Tổng kết và báo cáo
    * def passedTests = karate.filter(testResults, function(x) { return x.testStatus === 'PASS' })
    * def failedTests = karate.filter(testResults, function(x) { return x.testStatus === 'FAIL' })
    
    * print '=== REGISTER TEST SUMMARY ==='
    * print 'Total test cases: ' + testResults.length
    * print 'Passed: ' + passedTests.length
    * print 'Failed: ' + failedTests.length
    * if (testResults.length > 0) print ('Success rate: ' + Math.round((passedTests.length / testResults.length) * 100) + '%')
    
    # Warning nếu có test cases failed
    * if (failedTests.length > 0) karate.log('⚠️ WARNING: ' + failedTests.length + ' out of ' + testResults.length + ' test cases failed')
    
    * print '=== HOÀN THÀNH REGISTER TESTING ===' 