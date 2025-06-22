Feature: Debug Login Test - Kiểm tra xem có call API thực sự không

  Background:
    * url 'http://localhost:3000'

  Scenario: Test Single Login Call 
    * print '=== STARTING SINGLE LOGIN TEST ==='
    Given url 'http://localhost:3000/auth/login'
    And request { email: 'nam@gmail.com', password: '123456' }
    When method POST
    Then status 200
    And print '=== RESPONSE STATUS:', responseStatus
    And print '=== RESPONSE BODY:', response
    And print '=== LOGIN TEST COMPLETED ==='

  Scenario: Test Multiple Login Calls
    * print '=== STARTING MULTIPLE LOGIN TEST ==='
    
    # Test call helper trực tiếp 3 lần
    * print '=== CALL 1 ==='
    * call read('classpath:features/helpers/login-single-call.feature') { email: 'nam@gmail.com', password: '123456' }
    
    * print '=== CALL 2 ==='  
    * call read('classpath:features/helpers/login-single-call.feature') { email: 'quang1@gmail.com', password: 'quang1' }
    
    * print '=== CALL 3 ==='
    * call read('classpath:features/helpers/login-single-call.feature') { email: 'nam@gmail.com', password: '123456' }
    
    * print '=== ALL CALLS COMPLETED ===' 