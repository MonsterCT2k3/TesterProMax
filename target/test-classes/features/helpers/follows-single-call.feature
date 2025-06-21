Feature: Follows Single Call Helper - Thực hiện API call follows với bearer token

Scenario: Gọi API follows với bearer token và followingId
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/follows'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    # Xử lý request body
    * def requestBody = { followingId: '#(followingId)' }
    And request requestBody
    When method POST
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling follows API với bearerToken:', bearerToken
    And print 'Request body:', requestBody
    And print 'Response status:', actualStatus, 'body:', actualResponse 