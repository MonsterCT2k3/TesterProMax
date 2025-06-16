Feature: Register Single Call Helper - Thực hiện một API call register duy nhất

Scenario: Gọi API register với email và password
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/register'
    And request { email: '#(email)', password: '#(password)' }
    When method POST
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling register API với email:', email, 'password:', password
    And print 'Response status:', actualStatus, 'body:', actualResponse 