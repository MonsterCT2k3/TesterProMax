@ignore
Feature: Register Single Call Helper

Scenario: Register Single Call
    * def config = karate.call('classpath:karate-config.js')
    * url config.baseUrl
    
    * def requestData = 
    """
    {
        email: '#(email)',
        password: '#(password)',
        name: '#(name)',
        username: '#(username)',
        phoneNumber: '#(phoneNumber)'
    }
    """
    
    Given path '/auth/register'
    And request requestData
    When method post
    Then def responseStatus = karate.get('responseStatus')
    And def response = karate.get('response')
    
    * print 'Register API called with:'
    * print 'Request:', requestData
    * print 'Response Status:', responseStatus
    * print 'Response Body:', response 