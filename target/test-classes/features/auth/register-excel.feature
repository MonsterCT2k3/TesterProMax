Feature: Register Comprehensive Testing - Tất cả các trường hợp test

  Background:
    * url baseUrl
    * def readExcel = read('classpath:utils/read-excel.js')
    * def writeToExcel = read('classpath:utils/write-excel.js')
    * def addRegisterData = read('classpath:utils/add-register-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def sheetName = 'register'

  Scenario: Setup và chạy comprehensive register test cases
    # Bước 1: Thêm dữ liệu test cases vào Excel
    * print '=== BƯỚC 1: SETUP DỮ LIỆU TEST ==='
    * def setupResult = addRegisterData()
    * if (!setupResult) karate.fail('Không thể setup dữ liệu test vào Excel!')
    * print 'Đã setup dữ liệu test vào Excel thành công!'
    
    # Bước 2: Đọc dữ liệu từ Excel
    * print '=== BƯỚC 2: ĐỌC DỮ LIỆU TỪ EXCEL ==='
    * def testData = readExcel(excelFilePath, sheetName)
    * print 'Đọc được ' + testData.length + ' test cases từ Excel sheet: ' + sheetName
    * def testResults = []
    
    # Bước 3: Chạy từng test case
    * print '=== BƯỚC 3: CHẠY CÁC TEST CASES ==='
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
        if (testCase.phoneNumber && testCase.phoneNumber !== '' && testCase.phoneNumber !== 'null') {
          requestBody.phoneNumber = testCase.phoneNumber;
        }
        
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
        var actualResult = '';
        var testResult = 'FAIL';
        
        // Ghi response thực tế vào result
        if (response.response) {
          actualResult = JSON.stringify(response.response);
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
        }
        
        karate.log('Actual Status: ' + actualStatus);
        karate.log('Actual Result: ' + actualResult);
        karate.log('Test Result: ' + testResult);
        karate.log('==========================================');
        
        return {
          responseStatus: actualStatus,
          result: actualResult
        };
      }
      """
    
    # Chạy từng test case với detailed logging
    * def results = karate.map(testData, runTest)
    * def testResults = results
    
    # Bước 4: Tổng kết kết quả
    * print '=== BƯỚC 4: TỔNG KẾT KẾT QUẢ ==='
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
    
    * print 'TỔNG SỐ TEST CASES: ' + totalCount
    * print 'SỐ TEST PASS: ' + passCount
    * print 'SỐ TEST FAIL: ' + failCount
    * print 'TỶ LỆ PASS: ' + Math.round((passCount * 100.0) / totalCount) + '%'
    
    # Bước 5: Ghi kết quả vào Excel
    * print '=== BƯỚC 5: GHI KẾT QUẢ VÀO EXCEL ==='
    * def writeSuccess = writeToExcel(excelFilePath, sheetName, testResults)
    * if (writeSuccess) karate.log('✓ Đã ghi kết quả vào Excel thành công!')
    * if (!writeSuccess) karate.log('✗ Lỗi khi ghi kết quả vào Excel!')
    
    * print '=== HOÀN THÀNH COMPREHENSIVE REGISTER TESTING ===' 