Feature: Edit employee

  Background:
    Given I navigate to hrm login page
    When I enter valid username as "testadmin" and password as "Vibetestq@123#" details
    And I click the login button
    Then I should be redirected to the dashboard page

  Scenario: Edit an existing employee's first name
    Given an employee with first name "Test1234" exists
    When I search for employee "Test1234"
    And I open the first employee in the results
    And I change the first name to "Updated"
    And I click the save button
    Then I should see the saved message
