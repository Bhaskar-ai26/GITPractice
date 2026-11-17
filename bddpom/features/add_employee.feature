Feature: Add employee

  Background:
    Given I navigate to hrm login page
    When I enter valid username as "testadmin" and password as "Vibetestq@123#" details
    And I click the login button
    Then I should be redirected to the dashboard page

  Scenario: Add a new employee with first and last name
    When I open the Add Employee page
    And I enter first name "Test123" and last name "Employee"
    And I click the save button
    Then I should see the employee personal details page

  Scenario: Add employee without last name shows validation
    When I open the Add Employee page
    And I enter first name "Test1234" and last name ""
    And I click the save button
    Then I should see a required field validation message
