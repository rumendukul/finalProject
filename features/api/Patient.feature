@api
Feature: all tests related to patient module

Scenario: verify GET patients return data
  Given doctor is logged in
  When user hits GET "/api-patients" 
  Then verify status code is 200
  

Scenario: verify GET appointments return data
  Given doctor is logged in
  When user hits GET "/api-appointments" 
  Then verify status code is 200

@createPatient
Scenario: verify doctor can create patient with POST
    Given doctor is logged in
    When user hits POST "/api-patients" with body
    Then verify status code is 201