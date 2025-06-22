Feature: Login API Performance Test

  Background:
    * url 'http://localhost:3000'

  Scenario Outline: Login Performance Test for Each User (Multiple Iterations)
    * def currentUser = { email: '<email>', password: '<password>' }
    * print '=== STARTING PERFORMANCE TEST for user:', currentUser.email, '==='
    
    # Call 1
    * print '*** API CALL 1 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 1 completed, status:', responseStatus
    
    # Call 2  
    * print '*** API CALL 2 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 2 completed, status:', responseStatus
    
    # Call 3
    * print '*** API CALL 3 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 3 completed, status:', responseStatus
    
    # Call 4
    * print '*** API CALL 4 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 4 completed, status:', responseStatus
    
    # Call 5
    * print '*** API CALL 5 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 5 completed, status:', responseStatus
    
    # Call 6
    * print '*** API CALL 6 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 6 completed, status:', responseStatus
    
    # Call 7
    * print '*** API CALL 7 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 7 completed, status:', responseStatus
    
    # Call 8
    * print '*** API CALL 8 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 8 completed, status:', responseStatus
    
    # Call 9
    * print '*** API CALL 9 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 9 completed, status:', responseStatus
    
    # Call 10
    * print '*** API CALL 10 ***'
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print 'Call 10 completed, status:', responseStatus
    
    * print '=== COMPLETED 10 API CALLS for user:', currentUser.email, '==='

    Examples:
      | email                 | password    |
      | nam@gmail.com         | 123456      |
      | quang1@gmail.com      | quang1      |
      | test@example.com      | Password123 |
      | test2@example.com     | Password123 |
      | test28@example.com    | Password123 |
      | testit4@gmail.com     | Password123 |
      | testit3@gmail.com     | Password123 |
      | testit5@gmail.com     | Password123 |
      | testit@gmail.com      | Password123 |
      | testit2@gmail.com     | Password123 |
      | nam@gmail.com         | 12345      |
      | quang1@gmail.com      | quang1      |
      | test@example.com      | Password12d |
      | test2@example.com     | Password12 |
      | test28@example.com    | Password12s |
      | testit4@gmail.com     | Password12g |
      | testit3@gmail.com     | Password123 |
      | testit5@gmail.com     | Password123 |
      | testit@gmail.com      | Password123 |
      | testit2@gmail.com     | Password123 |
      | nam@gmail.com         | 123456      |
      | quang1@gmail.com      | quang1      |
      | test@example.com      | Password123 |
      | test2@example.com     | Password123 |
      | test28@example.com    | Password123 |
      | testit4@gmail.com     | Password123 |
      | testit3@gmail.com     | Password123 |
      | testit5@gmail.com     | Password123 |
      | testit@gmail.com      | Password123 |
      | testit2@gmail.com     | Password123 |