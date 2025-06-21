Feature: Like Single Call Helper - Thực hiện API call like với bearer token

Scenario: Gọi API like với bearer token và targetId (type cố định là post)
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/likes'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    # Xử lý request body với type cố định là "post"
    * def requestBody = { targetId: '#(targetId)', type: 'post' }
    And request requestBody
    When method POST
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling like API với bearerToken:', bearerToken
    And print 'Request body:', requestBody
    And print 'Response status:', actualStatus, 'body:', actualResponse 