Feature: Login functionality

  Scenario: Successful login
    Given I navigate to hrm login page
    Then I should see the login page
    When I enter valid username as "testadmin" and password as "Vibetestq@123#" details
    And I click the login button
    Then I should be redirected to the dashboard page