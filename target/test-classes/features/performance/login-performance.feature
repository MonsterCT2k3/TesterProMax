Feature: Login API Performance Test

  Background:
    * url 'http://localhost:3000'
    * def requestData = { email: 'nam@gmail.com', password: '123456' }

  Scenario: Login Performance Test
    Given path '/auth/login'
    And request requestData
    When method post
    * print 'Response status:', responseStatus
    * print 'Response body:', response
    
    # Thay vì hardcode status 200, kiểm tra nếu status là success
    * assert responseStatus >= 200 && responseStatus < 300
    
    * def responseTime = responseTime
    * print 'Response time was:', responseTime, 'ms'