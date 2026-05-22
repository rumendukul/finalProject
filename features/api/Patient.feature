@api
Feature: all tests related to patient module

  Scenario: verify GET patients return data
    Given doctor is logged in
    When user hits GET "/api-patients"
    Then verify status code is 200

  @createPatient
  Scenario: verify doctor can create patient with POST
    Given doctor is logged in
    When user hits POST "/api-patients" with body
    Then verify status code is 201

  @updatePatient
  Scenario: verify doctor can update patient with PUT
    Given doctor is logged in
    When user provides "first_name" with "UpdatedFN"
    And user provides "last_name" with "UpdatedLastName"
    And user hits PUT "/api-patients"
    Then verify status code is 200
    And verify response body contains "first_name" with "UpdatedFN"
    And verify response body contains "last_name" with "UpdatedLastName"
