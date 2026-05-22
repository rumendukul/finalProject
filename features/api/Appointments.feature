@api @appointments
Feature: all tests related to appointments module

    @getAppointments
    Scenario: verify GET appointments return data
        Given doctor is logged in
        When user hits GET "/api-appointments"
        Then verify status code is 200

    @createAppointment
    Scenario: verify doctor can create appointment with POST
        Given doctor is logged in
        When user hits POST "/api-appointments" with body
        Then verify status code is 201

    @updateAppointment
    Scenario: verify doctor can update appointment with PUT
        Given doctor is logged in
        When user provides "reason" with "updated reason"
        And user hits PUT "/api-appointments"
        Then verify status code is 200
        And verify response body contains "reason" with "updated reason"

    @cancelAppointment
    Scenario: verify POST appointments cancels the appointment
        Given doctor is logged in
        When user provides "cancellation_reason" with "test Cancellation"
        And user hits POST "/api-appointments/{appointmentId}/cancel" 
        Then verify status code is 200
        And verify response body contains "cancellation_reason" with "test Cancellation"



