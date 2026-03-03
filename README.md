# BMI Calculator – Salesforce LWC Project
## Project Overview

This project is a Body Mass Index (BMI) Calculator built using Lightning Web Components (LWC) in Salesforce.

The application allows users to:
- Enter weight and height
- Automatically calculate BMI
- Display BMI category (Underweight, Normal, Overweight, Obese)
- Dynamically update results in real time

This project demonstrates practical understanding of **LWC fundamentals, JavaScript logic, reactive properties, and Salesforce deployment using SFDX.**

## **Tech Stack**
- Lightning Web Components (LWC)
- JavaScript (ES6)
- HTML
- Salesforce DX
- Salesforce CLI
- Git & GitHub

## **Concepts Practiced**
- Reactive properties (@track / reactive variables)
- Event handling in LWC
- Conditional rendering
- JavaScript calculations & logic
- Component structure
- Salesforce deployment using CLI
- Version control with Git

## **Project Structure**
force-app/ <br>
 └── main/ <br>
     └── default/ <br>
         └── lwc/ <br>
             └── bmiCalculator/ <br>
                 ├── bmiCalculator.html <br>
                 ├── bmiCalculator.js <br>
                 ├── bmiCalculator.js-meta.xml <br>

## **How to Run This Project**
1. Clone the repository:
   git clone https://github.com/Azeem-Idris/bmiCalculator.git
2. Authorize your Salesforce Org:
   sf org login web
3. Deploy to your org:
   sf project deploy start
4. Add the component to a Lightning App Page using Lightning App Builder.

## **Demo**
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/3343e5e3-15f9-4f67-995a-f29243948df6" />
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/0dd981ce-e8eb-44e3-a658-206e781309c0" />

## **What This Project Demonstrates**
This project proves:
- I can build functional UI components in Salesforce
- I understand frontend logic inside LWC
- I can deploy and manage metadata using Salesforce DX
- I can use GitHub for version control
