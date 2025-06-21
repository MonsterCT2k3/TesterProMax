Feature: Unfollow Single Call Helper - Thực hiện API call unfollow với bearer token

Scenario: Gọi API unfollow với bearer token và followingId
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/follows/' + followingId
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    When method DELETE
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling unfollow API với bearerToken:', bearerToken
    And print 'Following ID:', followingId
    And print 'Response status:', actualStatus, 'body:', actualResponse 