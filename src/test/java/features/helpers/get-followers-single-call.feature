Feature: Get Followers Single Call Helper - Thực hiện API call lấy danh sách followers với bearer token

Scenario: Gọi API get followers với bearer token
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/follows/followers'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    When method GET
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling get followers API với bearerToken:', bearerToken
    And print 'Response status:', actualStatus, 'body:', actualResponse 