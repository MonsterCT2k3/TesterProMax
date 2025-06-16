Feature: Test Resources API của Reqres.in

  Background:
    * url baseUrl

  Scenario: Lấy danh sách resources
    Given path '/unknown'
    When method get
    Then status 200
    And match response.page == 1
    And match response.per_page == 6
    And match response.total == 12
    And match response.total_pages == 2
    And match response.data == '#[6]'
    And match response.data[*].id == '#number'
    And match response.data[*].name == '#string'
    And match response.data[*].year == '#number'
    And match response.data[*].color == '#string'
    And match response.data[*].pantone_value == '#string'

  Scenario: Lấy thông tin resource cụ thể
    Given path '/unknown/2'
    When method get
    Then status 200
    And match response.data.id == 2
    And match response.data.name == 'fuchsia rose'
    And match response.data.year == 2001
    And match response.data.color == '#C74375'
    And match response.data.pantone_value == '17-2031'
    And match response.support.url == 'https://reqres.in/#support-heading'
    And match response.support.text == '#string'

  Scenario: Lấy resource không tồn tại
    Given path '/unknown/23'
    When method get
    Then status 404
    And match response == {}

  Scenario: Test delayed response
    Given path '/users'
    And param delay = 3
    When method get
    Then status 200
    And match response.data == '#array'
    # Test sẽ mất khoảng 3 giây để hoàn thành 