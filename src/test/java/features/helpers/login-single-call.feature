Feature: Login Single Call Helper - Thực hiện một API call login duy nhất

Scenario: Gọi API login với email và password
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/auth/login'
    And request { email: '#(email)', password: '#(password)' }
    When method POST
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling login API với email:', email, 'password:', password
    And print 'Response status:', actualStatus, 'body:', actualResponse 