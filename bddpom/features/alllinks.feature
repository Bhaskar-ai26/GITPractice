Feature: All Links

  Background:
    Given I navigate to hrm login page
    When I enter valid username as "testadmin" and password as "Vibetestq@123#" details
    And I click the login button
    Then I should be redirected to the dashboard page

  Scenario: Verify all links on the dashboard
    Then I should see the all links on the dashboard
    When I click on Admin link
    Then I should be redirected to admin page
    When I click on PIM link
    Then I should be redirected to PIM page
    When I click on Leave link
    Then I should be redirected to Leave page
    When I click on Time link
    Then I should be redirected to Time page
    When I click on Recruitment link
    Then I should be redirected to Recruitment page
    When I click on My Info link
    Then I should be redirected to My Info page
    When I click on Performance link
    Then I should be redirected to Performance page
    When I click on Dashboard link
    Then I should be redirected to Dashboard page
