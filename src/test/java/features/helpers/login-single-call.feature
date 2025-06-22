Feature: Login Single Call Helper - Thực hiện một API call login duy nhất

Scenario: Gọi API login với email và password
    * print '*** BEFORE API CALL ***', 'Email:', email, 'URL: http://localhost:3000/auth/login'
    Given url 'http://localhost:3000/auth/login'
    And request { email: '#(email)', password: '#(password)' }
    * print '*** SENDING REQUEST ***', 'Body:', { email: '#(email)', password: '#(password)' }
    When method POST
    * print '*** AFTER API CALL ***', 'Status:', responseStatus
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print '### API CALL COMPLETED ###', 'Email:', email, 'Status:', actualStatus
    And print '### RESPONSE BODY ###', actualResponse 