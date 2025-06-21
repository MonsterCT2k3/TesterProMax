Feature: GetPostsFeed Single Call Helper - Thực hiện API call get posts feed với bearer token

Scenario: Gọi API get posts feed với bearer token, page và limit
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/posts/feed'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    # Thêm query parameters 
    * def queryParams = {}
    * if (page && page.toString().trim() !== '') queryParams.page = page
    * if (limit && limit.toString().trim() !== '') queryParams.limit = limit
    * params queryParams
    
    When method GET
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling getPostsFeed API với bearerToken:', bearerToken
    And print 'Query params:', queryParams
    And print 'Response status:', actualStatus, 'body:', actualResponse 