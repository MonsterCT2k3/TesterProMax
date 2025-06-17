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
    * def registerSingleCall = read('classpath:features/helpers/register-single-call.feature')

  Scenario: Chạy tất cả test cases từ Excel Register sheet
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
        karate.log('Expected Status: ' + testCase.expectedStatus);
        karate.log('Expected Result: ' + testCase.expectedResult);
        karate.log('==========================================');
        
        var requestBody = {};
        if (testCase.email && testCase.email !== '' && testCase.email !== 'null') {
          requestBody.email = testCase.email;
        }
        if (testCase.password && testCase.password !== '' && testCase.password !== 'null') {
          requestBody.password = testCase.password;
        }
        if (testCase.name && testCase.name !== '' && testCase.name !== 'null') {
          requestBody.name = testCase.name;
        }
        if (testCase.username && testCase.username !== '' && testCase.username !== 'null') {
          requestBody.username = testCase.username;
        }
        
        var response = karate.call('classpath:features/helpers/register-single-call.feature', {
          email: testCase.email === 'null' ? null : testCase.email,
          password: testCase.password === 'null' ? null : testCase.password,
          name: testCase.name === 'null' ? null : testCase.name,
          username: testCase.username === 'null' ? null : testCase.username
        });
        
        var actualStatus = response.actualStatus;
        var actualResult = '';
        var testResult = 'FAIL';
        
        // Ghi response thực tế vào result
        if (response.actualResponse) {
          actualResult = JSON.stringify(response.actualResponse);
        } else {
          actualResult = 'No response body';
        }
        
        // Kiểm tra xem kết quả có khớp với expected không
        var isExpectedStatus = (actualStatus == testCase.expectedStatus);
        if (isExpectedStatus) {
          testResult = 'PASS';
          karate.log('✓ TEST CASE #' + (index + 1) + ' PASSED');
        } else {
          testResult = 'FAIL';
          karate.log('✗ TEST CASE #' + (index + 1) + ' FAILED');
          karate.log('  Expected Status: ' + testCase.expectedStatus);
          karate.log('  Actual Status: ' + actualStatus);
          karate.log('  Expected Result: ' + testCase.expectedResult);
          karate.log('  Actual Result: ' + actualResult);
        }
        
        karate.log('Actual Status: ' + actualStatus);
        karate.log('Actual Result: ' + actualResult);
        karate.log('Test Result: ' + testResult);
        karate.log('==========================================');
        
        return {
          responseStatus: actualStatus,
          result: testResult + ' - ' + actualResult
        };
      }
      """
    
    # Chạy từng test case với detailed logging
    * def results = karate.map(testData, runTest)
    * def testResults = results
    
    # Tổng kết kết quả
    * def passCount = 0
    * def failCount = 0
    * def totalCount = testResults.length
    
    * def countResults = 
      """
      function(result, index) {
        if (result.result && result.result.indexOf('PASS') >= 0) {
          passCount++;
        } else {
          failCount++;
        }
      }
      """
    * karate.forEach(testResults, countResults)
    
    * print '=== TỔNG KẾT KẾT QUẢ ==='
    * print 'TỔNG SỐ TEST CASES: ' + totalCount
    * print 'SỐ TEST PASS: ' + passCount
    * print 'SỐ TEST FAIL: ' + failCount
    * print 'TỶ LỆ PASS: ' + Math.round((passCount * 100.0) / totalCount) + '%'
    
    # Ghi kết quả vào Excel
    * print 'Đang ghi kết quả vào Excel...'
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✓ Đã ghi kết quả vào Excel thành công!')
    * if (!writeSuccess) karate.log('✗ Lỗi khi ghi kết quả vào Excel!')

Scenario Outline: Register Test Case <rowNum>
    * print '-------------------------------------------------------------------------'
    * print 'Executing test case #' + rowNum + ': ' + testDescription
    * print '-------------------------------------------------------------------------'

    # Gọi API register
    * def result = call registerSingleCall { 
        email: '#(email)', 
        password: '#(password)', 
        name: '#(name)', 
        username: '#(username)',
        phoneNumber: '#(phoneNumber)',
        expectedStatus: '#(expectedStatus)',
        expectedResult: '#(expectedResult)'
    }

    # Cập nhật kết quả vào Excel
    * def writeResult = writeToExcel('register', rowNum, result.responseStatus, result.response)
    * print 'Test case #' + rowNum + ' completed with status:', result.responseStatus
    * print 'Response:', result.response

    Examples:
    | read('classpath:data/data.xlsx', 'register') 