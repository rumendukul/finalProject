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


Scenario: verify doctor can create patient with POST
    Given doctor is logged in
    When user hits POST "/api-patients" with body 
    """
    {
        "first_name": "Mary",
        "last_name": "Jane",
        "dob": "2000-05-20",
        "gender": "Female",
        "phone": "1234567800",
        "email": "maryjane@example.com",
        "address": "123 John Street, Cityville",
        "emergency_contact_name": "Hazel",
        "emergency_contact_phone": "3245678767",
        "insurance_provider": "Aetna",
        "insurance_policy_number": "AC2387"
    }
    """
    Then verify status code is 201