Feature: Change Password Single Call Helper - Thực hiện API call đổi mật khẩu với bearer token

Scenario: Gọi API change password với bearer token
    * def config = karate.call('classpath:karate-config.js')
    Given url config.baseUrl + '/users/change-password'
    
    # Thêm header Authorization nếu có bearer token
    * if (bearerToken && bearerToken.trim() !== '') karate.set('Authorization', 'Bearer ' + bearerToken)
    * configure headers = { Authorization: '#(Authorization)' }
    
    # Xử lý request body với null values
    * def oldPwd = oldPassword === 'NULL_VALUE' ? null : oldPassword
    * def newPwd = newPassword === 'NULL_VALUE' ? null : newPassword
    * def requestBody = { oldPassword: '#(oldPwd)', newPassword: '#(newPwd)' }
    And request requestBody
    When method PATCH
    Then def actualStatus = responseStatus
    And def actualResponse = response
    And print 'Calling change password API với bearerToken:', bearerToken
    And print 'Request body - oldPassword:', oldPwd, 'newPassword:', newPwd
    And print 'Response status:', actualStatus, 'body:', actualResponse 