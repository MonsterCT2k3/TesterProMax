Feature: GetPostsFeed Testing từ Excel - Sheet getPostsFeed

  Background:
    * url baseUrl
    * def config = karate.call('classpath:karate-config.js')
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'getPostsFeed'
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []
    * def globalBearerToken = config.bearerToken
    * print 'Sử dụng global bearer token từ config:', globalBearerToken

  Scenario: Chạy tất cả test cases getPostsFeed từ Excel
    * def evaluateTestCase = 
      """
      function(testCase, actualStatus, actualResponse) {
        var expectedStatus = testCase.expectedStatus;
        
        // Kiểm tra Status Code (Bắt buộc)
        if (actualStatus != expectedStatus) {
          return {
            status: 'FAIL',
            reason: 'Status mismatch: Expected ' + expectedStatus + ', got ' + actualStatus
          };
        }
        
        // Nếu status code khớp thì PASS
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
            // TC5: Không có token
            bearerToken = '';
            karate.log('Test case không sử dụng token');
          } else if (testCase.bearerToken === 'INVALID_TOKEN') {
            // TC6: Token không hợp lệ
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
        
        // Gọi API getPostsFeed
        var response = karate.call('classpath:features/helpers/get-posts-feed-single-call.feature', {
          bearerToken: bearerToken,
          page: testCase.page || '',
          limit: testCase.limit || ''
        });
        
        var actualStatus = response.actualStatus;
        var actualResult = '';
        
        // Ghi response thực tế vào result
        if (response.actualResponse) {
          actualResult = JSON.stringify(response.actualResponse);
        } else {
          actualResult = 'No response body';
        }
        
        // Đánh giá test case
        var testEvaluation = evaluateTestCase(testCase, actualStatus, response.actualResponse);
        
        // Log kết quả đánh giá
        if (testEvaluation.status === 'PASS') {
          karate.log('✅ TEST PASSED - ' + testEvaluation.reason);
        } else {
          karate.log('❌ TEST FAILED - ' + testEvaluation.reason);
        }
        
        karate.log('Test case #' + (index + 1) + ' - Status: ' + actualStatus + ', Result: ' + actualResult);
        
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
    * print 'Hoàn thành tất cả test cases getPostsFeed. Đang ghi kết quả vào Excel...'
    
    # ===== THỐNG KÊ TEST RESULTS =====
    * def passedTests = karate.filter(testResults, function(item) { return item.testStatus === 'PASS'; })
    * def failedTests = karate.filter(testResults, function(item) { return item.testStatus === 'FAIL'; })
    * def totalTests = testResults.length
    * def passedCount = passedTests.length
    * def failedCount = failedTests.length
    * def successRate = Math.round((passedCount / totalTests) * 100)
    
    # Log kết quả tổng kết
    * print '=================================='
    * print '📊 GETPOSTSFEED TEST SUMMARY 📊'
    * print '=================================='
    * print '📋 Tổng số test: ' + totalTests
    * print '✅ Passed: ' + passedCount + ' (' + successRate + '%)'
    * print '❌ Failed: ' + failedCount + ' (' + (100 - successRate) + '%)'
    * print '=================================='
    
    # Log failed tests
    * if (failedTests.length > 0) karate.forEach(failedTests, function(test, index) { karate.log('❌ Failed test #' + (index + 1) + ': ' + test.failureReason); })
    
    * print 'Ghi kết quả vào Excel...'
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('Đã ghi kết quả getPostsFeed vào Excel thành công!')
    * if (!writeSuccess) karate.log('Lỗi khi ghi kết quả getPostsFeed vào Excel!') 