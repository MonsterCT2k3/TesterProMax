Feature: Login API Performance Test - 50 Concurrent Calls

  Background:
    * url 'http://localhost:3000'

  Scenario Outline: Single Login Call per Scenario - 50 Threads
    * def currentUser = { email: '<email>', password: '<password>' }
    * print '*** 50-THREAD CONCURRENT API CALL for user:', currentUser.email, '***'
    
    Given url 'http://localhost:3000/auth/login'
    And request currentUser  
    When method POST
    Then status 200
    And print '50-thread call completed, status:', responseStatus

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