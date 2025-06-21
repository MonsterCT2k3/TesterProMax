Feature: Logout Single Call Helper - Thực hiện API call đăng xuất với bearer token

Scenario: Gọi API logout với bearer token
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/auth/logout'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    When method POST
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling logout API với bearerToken:', bearerToken
    And print 'Response status:', actualStatus, 'body:', actualResponse 