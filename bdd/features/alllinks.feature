Feature: All Links

  Scenario: Verify all links on the dashboard
    Given I see the all links on the dashboard     
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
