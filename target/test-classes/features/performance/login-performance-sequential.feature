Feature: Login API Sequential Performance Test - 100 requests tuần tự

  Background:
    * url 'http://localhost:3000'

  Scenario: 100 Login requests hoàn toàn tuần tự
    * print '=== STARTING SEQUENTIAL PERFORMANCE TEST - 100 REQUESTS ==='
    
    # Simple array of users - avoid complex JSON syntax
    * def userEmails = ['nam@gmail.com', 'quang1@gmail.com', 'test@example.com', 'test2@example.com', 'test28@example.com', 'testit4@gmail.com', 'testit3@gmail.com', 'testit5@gmail.com', 'testit@gmail.com', 'testit2@gmail.com']
    * def passwords = ['123456', 'quang1', 'Password123', 'Password123', 'Password123', 'Password123', 'Password123', 'Password123', 'Password123', 'Password123']
    
    # Initialize results array
    * def results = []
    * def successCount = 0
    * def failCount = 0
    * def totalResponseTime = 0
    * def minTime = 999999
    * def maxTime = 0
    
    # Perform 100 sequential requests
    * def performRequest = 
      """
      function(requestNumber) {
        var userIndex = (requestNumber - 1) % 10;
        var email = userEmails[userIndex];
        var password = passwords[userIndex];
        
        karate.log('*** SEQUENTIAL REQUEST #' + requestNumber + ' ***');
        karate.log('User:', email);
        
        var startTime = java.lang.System.currentTimeMillis();
        
        // Make API call
        var response = karate.call('classpath:features/helpers/login-single-call.feature', {
          email: email,
          password: password
        });
        
        var endTime = java.lang.System.currentTimeMillis();
        var responseTime = endTime - startTime;
        
        karate.log('Request #' + requestNumber + ' completed - Status:', response.actualStatus, 'Time:', responseTime + 'ms');
        
        // Update statistics
        if (response.actualStatus == 200) {
          successCount++;
        } else {
          failCount++;
        }
        
        totalResponseTime += responseTime;
        
        if (responseTime < minTime) {
          minTime = responseTime;
        }
        
        if (responseTime > maxTime) {
          maxTime = responseTime;
        }
        
        // Store result
        results.push({
          requestNumber: requestNumber,
          email: email,
          status: response.actualStatus,
          responseTime: responseTime
        });
        
        return response;
      }
      """
    
    # Execute 100 requests sequentially using loop
    * def i = 1
    * def executeSequentialLoop = 
      """
      function() {
        for (var req = 1; req <= 100; req++) {
          performRequest(req);
        }
      }
      """
    
    * eval executeSequentialLoop()
    
    # Calculate final statistics
    * def averageResponseTime = totalResponseTime / 100
    * def successRate = (successCount / 100) * 100
    
    # Print results
    * print '=== SEQUENTIAL PERFORMANCE TEST RESULTS ==='
    * print 'Total Requests: 100'
    * print 'Successful Requests: ' + successCount
    * print 'Failed Requests: ' + failCount
    * print 'Success Rate: ' + successRate + '%'
    * print 'Average Response Time: ' + averageResponseTime + ' ms'
    * print 'Min Response Time: ' + minTime + ' ms' 
    * print 'Max Response Time: ' + maxTime + ' ms'
    * print 'Total Response Time: ' + totalResponseTime + ' ms'
    
    # Store results in karate shared context for Runner to access
    * karate.set('requestStats', { successCount: successCount, failCount: failCount, successRate: successRate, totalRequests: 100 })
    * print '=== TEST COMPLETED ===' 