# language: en
Feature: ATM Withdrawal

   In order to avoid having to go to a bank branch,
   As a bank account holder,
   I want to be able to withdraw money from an ATM.

   Scenario: Account with sufficient balance
      Given I have an account with a balance of $100.00
      And the ATM contains sufficient money
      When I request a withdrawal of $20.00
      Then the ATM should dispense $20.00
      And the balance of my account should be $80.00

   Scenario: Attempt to withdraw amount exceeding balance
      Given I have an account with a balance of $10.00
      And the ATM contains sufficient money
      When I request a withdrawal of $20.00
      Then the ATM should not dispense the money
      And should display the message "Insufficient balance"
      And the balance of my account should remain $10.00
