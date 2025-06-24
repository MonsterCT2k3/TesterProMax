Feature: Unfollow Single Call Helper - Thực hiện API call unfollow với bearer token

Scenario: Gọi API unfollow với bearer token và followingId
    * def config = karate.call('classpath:karate-config.js')
    
    # Xử lý URL endpoint dựa trên followingId
    * def baseEndpoint = config.baseUrl + '/follows'
    * def finalUrl = followingId == 'EMPTY' ? baseEndpoint : (followingId == 'NULL_VALUE' ? baseEndpoint + '/null' : baseEndpoint + '/' + followingId)
    Given url finalUrl
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    When method DELETE
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling unfollow API với bearerToken:', bearerToken
    And print 'Following ID:', followingId
    And print 'Final URL:', finalUrl
    And print 'Response status:', actualStatus, 'body:', actualResponse 