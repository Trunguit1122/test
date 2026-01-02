**VIETNAM NATIONAL UNIVERSITY HO CHI MINH CITY**  
**UNIVERSITY OF INFORMATION TECHNOLOGY**  
**FACULTY OF SOFTWARE ENGINEERING**  
**\------------------------------**

**![][image1]**

\<IELTS Practice Website Integrated with AI\>  
Test Plan Document 

Project Code: SE113.Q12-ENGLISH  
Document Code: SE113.Q12-ENGLISH-TESTPLAN-001-v1.1

**TP. HỒ CHÍ MINH \- 2025**

**TABLE OF CONTENTS**

**1	Introduction	[3](#introduction)**

**2	Business Background	[3](#business-background)**

**3	Test Objectives	[3](#test-objectives)**

**4	Scope	[3](#scope)**

**5	Test types Identified	[3](#test-types-identified)**

**6	Problems Perceived	[3](#problems-perceived)**

**7	Architecture	[3](#architecture)**

**8	Environment	[3](#environment)**

**9	Assumptions	[3](#assumptions)**

**10	Functionality	[3](#functionality)**

**11	Security	[4](#security)**

**12	Performance	[4](#performance)**

**13	Usability	[5](#usability)**

**14	Test Team Organization	[6](#test-team-organization)**

**15	Schedule	[6](#schedule)**

**16	Defects Classification Mechanism	[6](#defects-classification-mechanism)**

**17	Configuration Management	[6](#configuration-management)**

**18	Release Criteria	[6](#release-criteria)**

	  
	

**Record of change**

\*A \- Added M \- Modified D \- Deleted

| Effective Date | Changed Items | A\*M, D | Change Description | New Version |
| ----- | ----- | :---: | ----- | :---: |
| 15-Nov-2025 |  | A | New document | 1.0 |
| 20-Dec-2025 |  | M | Modify procedure | 1.1 |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

**SIGNATURE PAGE**

**ORIGINATOR:**	Quang Vinh Nguyen		15-Nov-2025  
Tester			

**REVIEWERS:**	Quang Vinh Nguyen		16-Nov-2025  
	Test Leader  
			Van Pham Nguyen		16-Nov-2025  
			Tester  
			Duc Trung Tran Nguyen	16-Nov-2025  
			Tester

**APPROVAL:**		Trinh Dong Nguyen		19-Jun-2023  
Project Leader	

1. # **Introduction** {#introduction}

1.1 Purpose

This document provides a comprehensive description of the testing plan for the *IELTS Practice Website Integrated with AI* project.

The purpose of this document is to ensure that testing activities are well-organized, traceable, and consistently executed throughout the testing phase. It helps testers, developers, and stakeholders understand what features are tested (such as User Authentication, Speaking/Writing Practice, and AI Scoring), how testing is performed (utilizing Unit, Integration, and System testing strategies), and the criteria used to determine test completion and success .

This test plan serves as a guideline for executing and managing testing efforts to verify the functional behavior, basic non-functional requirements (Security, Performance), and integration of core user features (Frontend, Backend, and AI Service) of the IELTS Practice Website system .  
1.2 General information

Type of Business: The project is an online educational technology (EdTech) web application developed as part of an academic software engineering course. The system allows users to practice IELTS Speaking and Writing skills under simulated exam conditions, receive automated scoring and feedback via AI integration, and track their learning progress over time.

Type of Legal Entity: Not applicable (academic project)

Established: Not applicable

Location: Not applicable

Business Focus / Objective: The main objective of the application is to provide an accessible and interactive environment for IELTS preparation, with a primary focus on delivering immediate, objective feedback for Speaking and Writing skills derived from AI scoring technology.

2. # **Business Background** {#business-background}

1. Type of Business: The project is an online educational technology (EdTech) web application developed as part of an academic software engineering course. The system allows users to practice IELTS Speaking and Writing skills under simulated exam conditions, receive automated scoring and feedback via AI integration, and track their learning progress over time.  
2. Type of Legal Entity: Not applicable (academic project)  
3. Established: Not applicable  
4. Location: Not applicable  
5. Business Focus / Objective: The main objective of the application is to provide an accessible and interactive environment for IELTS preparation, with a primary focus on delivering immediate, objective feedback for Speaking and Writing skills derived from AI scoring technology.

3. # **Test Objectives** {#test-objectives}

## ***Overall Test Objectives***

The overall objective of testing for the IELTS Practice Website Integrated with AI project is to verify that all implemented functionalities operate correctly, reliably, and in accordance with the specified requirements, providing users with an accurate and effective IELTS practice environment.

The testing phase focuses on validating both core system functionalities and AI-powered features, ensuring that users can practice IELTS skills smoothly while receiving reliable scoring and feedback. The primary testing objectives include:

* Validate Core Functionality

  Ensure that all essential user workflows—including account registration, login, profile management, dashboard navigation, and test selection—function correctly without critical errors or data inconsistencies.

* Verify AI Accuracy and Integration

  Confirm that the integration between the application and the AI Scoring Service is stable and reliable. This includes validating that:

  * User inputs (audio recordings for Speaking and text submissions for Writing) are correctly captured and transmitted.  
  * The AI service processes inputs accurately and returns scores and feedback that align with defined evaluation criteria.  
  * AI responses are delivered within an acceptable response time.  
* Ensure System Reliability

  Assess the system’s ability to handle continuous user practice sessions without interruptions, data loss, or unexpected failures—especially during critical operations such as audio recording, test submission, and result generation.

* Assess User Experience (UX)

  Verify that the user interface is intuitive, responsive, and user-friendly. Special attention is given to exam simulation features, including countdown timers, recording constraints, and submission rules, to ensure they closely reflect real IELTS test conditions.

## ***Detailed Test Objectives by Module***

Testing objectives are defined based on the implemented modules and corresponding test cases for the current release. Each module is verified through test cases that cover functional behavior, validation rules, error handling, and AI interaction where applicable.

## ***Test Coverage Summary***

The testing scope covers all implemented user-facing features and AI-integrated functionalities in the current project version. Test cases are designed to include:

* Positive and negative scenarios  
* Boundary and validation checks  
* AI integration and response verification  
* Error handling and system stability scenarios  
* 

The coverage ensures that both functional and basic non-functional requirements (performance, reliability, and usability) are adequately tested to support a dependable IELTS practice experience.

## ***Alignment with Test Case Specification***

The test objectives and testing scope defined in this Test Plan are fully aligned with the Test Case Specification for the IELTS Practice Website Integrated with AI.

Each test case is designed based on approved functional requirements, use cases, and business rules. Every test case is uniquely identified and traceable to its corresponding use case (UC) and business requirement (BR), ensuring clear coverage and accountability throughout the testing process.

4. # **Scope**  {#scope}

## **4.1 Test Execution Summary**

| Category | Total TCs | Executed | Pending |
| :---- | :---: | :---: | :---: |
| Functional Test Cases | 818 | 107 | 711 |
| Security Test Cases | 90 | 0 | 90 |
| **Total** | **908** | **107** | **801** |

**Note:** The 107 executed test cases are automated functional tests (subset of 818 Functional TCs, mapped by FUC IDs).

## **4.2 Executed Test Cases (107 TCs)**

All automated test cases have been implemented and executed using **Selenium WebDriver + TypeScript + Jest** with **Page Object Model (POM)** pattern. All tests passed.

| Test Suite | File | TCs | FUC IDs | Result |
| :---- | :---- | :---: | :---- | :---- |
| Sign Up | signup.test.ts | 27 | FUC-001 to FUC-027 | PASSED |
| Sign In | signin.test.ts | 20 | FUC-051 to FUC-070 | PASSED |
| Teacher | teacher.test.ts | 16 | FUC-351 to FUC-366 | PASSED |
| Progress | progress.test.ts | 26 | FUC-451 to FUC-476 | PASSED |
| Result | result.test.ts | 18 | FUC-651 to FUC-668 | PASSED |
| **Total** | | **107** | | **ALL PASSED** |

## **4.3 Pending Test Cases (801 TCs)**

### **4.3.1 Functional Test Cases - Pending (711 TCs)**

| FUC Range | Module | Total | Executed | Pending |
| :---- | :---- | :---: | :---: | :---: |
| FUC-001 to FUC-050 | Sign Up (UC1) | 50 | 27 | 23 |
| FUC-051 to FUC-100 | Sign In (UC2) | 50 | 20 | 30 |
| FUC-101 to FUC-150 | Forgot Password (UC3) | 50 | 0 | 50 |
| FUC-151 to FUC-200 | Profile Management (UC4) | 50 | 0 | 50 |
| FUC-201 to FUC-350 | Speaking Practice (UC5-UC10) | 150 | 0 | 150 |
| FUC-351 to FUC-450 | Teacher Features (UC11-UC19) | 100 | 16 | 84 |
| FUC-451 to FUC-550 | Progress and Statistics (UC24, UC28) | 100 | 26 | 74 |
| FUC-551 to FUC-650 | Writing Practice (UC20-UC22) | 100 | 0 | 100 |
| FUC-651 to FUC-750 | Results and History (UC23, UC29) | 98 | 18 | 80 |
| FUC-751 to FUC-820 | Other Features (UC25-UC36) | 70 | 0 | 70 |
| **Total** | | **818** | **107** | **711** |

### **4.3.2 Security Test Cases - Pending (90 TCs)**

| REQ ID | Security Validation | TCs | Status |
| :---- | :---- | :---: | :---- |
| REQ008 | Account Lockout Policy | 10 | Pending |
| REQ009 | User Enumeration Prevention | 10 | Pending |
| REQ010 | Reset Token Expiry | 10 | Pending |
| REQ016 | Session Authentication | 10 | Pending |
| REQ022 | Microphone Permission | 10 | Pending |
| REQ033 | Teacher Authorization | 10 | Pending |
| REQ048 | Duplicate Session Prevention | 10 | Pending |
| REQ065 | Access Token Invalidation | 10 | Pending |
| REQ066 | Local Storage Clearance | 10 | Pending |
| **Total** | | **90** | **Not Executed** |

## **4.4 Exclusions (Out of Scope)**

| Feature | Reason |
| :---- | :---- |
| Payment Gateway | Not in SRS |
| Mobile Native App | Web only |
| Third-party OAuth (except Google) | Only Google Sign-up |
| Load/Stress Testing | Deferred to production |
| Cross-browser (IE/Safari) | Chrome and Firefox only |

5. # **Test Types Identified** {#test-types-identified}

This section describes the types of testing to be performed for the IELTS Practice Website project. Each test type may be executed using either manual or automated approaches based on complexity and criticality.

## **5.1 Functional Testing**

Functional testing validates that the system behaves according to the specified requirements and business rules defined in the SRS.

| Attribute | Description |
| :---- | :---- |
| Objective | Verify all 36 Use Cases function correctly as per SRS specifications |
| Test Cases | 820 (Manual) + 107 (Automated) = 927 total functional test cases |
| Approach | Black-box testing based on Business Rules (BR1-BR91) |

**Execution Methods:**

| Method | Test Cases | Coverage | Status |
| :---- | :---: | :---- | :---- |
| Manual Testing | 820 | All 36 UCs, REQ001-REQ091 | Designed - Pending Execution |
| Automated Testing | 107 | UC1, UC2, UC11-UC19, UC23, UC24, UC28, UC29, UC33, UC35 | Executed - 107/107 Passed |

## **5.2 Security Testing**

Security testing ensures the system is protected against vulnerabilities and unauthorized access.

| Attribute | Description |
| :---- | :---- |
| Objective | Validate security controls and protection mechanisms |
| Test Cases | 90 manual test cases covering 9 security requirements |
| Approach | Combination of manual penetration testing and security validation |

**Security Test Coverage:**

| REQ ID | Security Area | Test Cases | Status |
| :---- | :---- | :---: | :---- |
| REQ008 | Account Lockout Policy (BR8) | 10 | Designed - Pending |
| REQ009 | User Enumeration Prevention (BR9) | 10 | Designed - Pending |
| REQ010 | Reset Token Security (BR10) | 10 | Designed - Pending |
| REQ016 | Session Authentication Check (BR16) | 10 | Designed - Pending |
| REQ022 | Microphone Permission Handling (BR22) | 10 | Designed - Pending |
| REQ033 | Teacher Authorization Control | 10 | Designed - Pending |
| REQ048 | Duplicate Session Prevention | 10 | Designed - Pending |
| REQ065 | Access Token Invalidation | 10 | Designed - Pending |
| REQ066 | Local Storage Clearance | 10 | Designed - Pending |
| **Total** | | **90** | |

## **5.3 Integration Testing**

Integration testing verifies the interaction and data flow between system components.

| Attribute | Description |
| :---- | :---- |
| Objective | Validate communication between integrated modules |
| Scope | Frontend-Backend, Backend-Database, Backend-AI Service |
| Approach | API testing using Postman, automated integration via Selenium |

**Key Integration Points:**
* React Frontend to Express.js Backend (REST API calls)
* Express.js Backend to PostgreSQL Database (CRUD operations)
* Express.js Backend to AI Scoring Service (submission and scoring)

## **5.4 Regression Testing**

Regression testing ensures that code changes do not adversely affect existing functionality.

| Attribute | Description |
| :---- | :---- |
| Objective | Verify existing features remain functional after changes |
| Test Cases | 107 automated test cases (Selenium WebDriver) |
| Frequency | After each bug fix, feature update, or code merge |

## **5.5 Performance Testing**

Performance testing evaluates system responsiveness and stability under expected load conditions.

| Metric | Target Threshold |
| :---- | :---- |
| Page Load Time | Less than 3 seconds |
| API Response Time | Less than 2 seconds |
| AI Scoring Response | Less than 30 seconds |
| Concurrent Users | 50 users stability |

## **5.6 Test Type Summary**

| Test Type | Manual TCs | Automated TCs | Total | Execution Status |
| :---- | :---: | :---: | :---: | :---- |
| Functional Testing | 820 | 107 | 927 | Partial (107 Automated Executed) |
| Security Testing | 90 | 0 | 90 | Pending |
| Integration Testing | - | Included in Functional | - | Partial |
| Regression Testing | - | 107 | 107 | Executed |
| Performance Testing | - | - | - | Pending |
| **Total Unique TCs** | **910** | **107** | **1017** | |

6. # **Problems Perceived** {#problems-perceived}

* **AI Service Latency:** The AI API might take longer than 30s to respond, causing timeout errors.  
* **Audio Hardware:** Browser permissions for the microphone might vary across devices.  
* **Network:** Uploading large audio files on slow networks may fail.

7. # **Architecture** {#architecture}

* **Frontend:** ReactJs \+ TypeScript \+ Vite.  
* **Backend:** Express.js \+ TypeScript.  
* **Database:** PostgreSQL.  
* **External Service:** AI Scoring API (e.g., OpenAI/Python Service).

8. # **Environment** {#environment}

* **Server:** Staging / Localhost.  
* **OS on Test Machines:** Windows 10/11, macOS.  
* **Browsers:** Chrome (Latest), Firefox, Edge.  
* **Tools:**  
  - Bug Tracking: Jira / Excel / GitHub Issues.  
  - API Testing: Postman.  
  - Performance: JMeter (optional)

9. # **Assumptions** {#assumptions}

* The AI Scoring API service is up and running during the testing phase.  
* Test data (Student accounts, Questions) is populated in the database.  
* The development team releases the build on time.

10. # **Functionality** {#functionality}

***Constraints and Resolutions***

| Parameter | Customer Constraints | Infosys Limitations |
| :---- | :---- | :---- |
| Browsers | Must support Chrome, Firefox, Edge | Safari/IE is not prioritized in this phase |
| Data | Real student data privacy | Use dummy/mock data for testing. |
|  |  |  |
|  |  |  |
|  |  |  |

***Risk Identified & Mitigation Planned***

* Risk: AI API cost overrun.  
* Mitigation: Limit the number of AI calls per day during testing.

***Test Strategy***

* Use Black Box Testing technique.  
* Execute Test Cases designed based on SRS Business Rules.

***Automation Plans***

***Deliverables***

11. # **Security**  {#security}

***Constraints and Resolutions***

| Parameter | Customer Constraints | Infosys Limitations |
| ----- | ----- | ----- |
| Passwords | Must be hashed (Bcrypt) | Cannot recover lost passwords (only Reset). |
| Access | Strict Role-based access | Admin has full access to all data. |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

***Risk Identified & Mitigation Planned***

***Test Strategy***

* Authentication: Verify invalid login attempts (Brute force protection).  
* Authorization: Verify a Student cannot access Teacher pages (URL manipulation).

***Automation Plans***

***Deliverables***

12. # **Performance**  {#performance}

***Constraints and Resolutions***

| Parameter | Customer Constraints | Infosys Limitations |
| ----- | ----- | ----- |
| Response Time | Pages load \< 2 seconds | AI Scoring may take up to 30s. |
| Concurrency | 50 concurrent users | Server resources are limited (Student tier). |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

***Risk Identified & Mitigation Planned***

***Test Strategy***

* Simulate multiple users submitting tests simultaneously to check for database locks or crashes.

***Automation Plans***

***Deliverables***

13. # **Usability** {#usability}

***Constraints and Resolutions***

| Parameter | Customer Constraints | Infosys Limitations |
| :---- | :---- | :---- |
| Interface | Responsive on Desktop/Tablet | Mobile layout is not fully optimized yet. |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

***Risk Identified & Mitigation Planned***

***Test Strategy***

* Verifying navigation flow is intuitive.  
* Check error messages are user-friendly (as defined in SRS Messages table).

***Automation Plans***  
***Deliverables***

***Compatibility Constraints and Resolutions***

| Parameter | Customer Constraints | Infosys Limitations |
| :---- | :---- | :---- |
| Constraint 1 |  |  |
| Constraint 2 |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

***Risk Identified & Mitigation Planned***

***Test Strategy***

***Automation Plans***

***Deliverables***

14. # **Test Team Organization** {#test-team-organization}

15. # **Schedule** {#schedule}

Test Schedule and Estimation  
It includes details about the target start and end date of test execution, and a detailed schedule of all testing milestones, activities, and deadlines.

Example:

Test case design:  
Start Date – \<Test Case design start date\>  
End Date – \<Test Case design end date\>  
Sign-in/Sign-up: 6 hours  
Shopping cart: 8 hours

16. # **Defects Classification Mechanism** {#defects-classification-mechanism}

| Type of Defects  | Functionality  | Performance  | Security  | Usability | Compatibility  |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Critical |  |  |  |  |  |
| Major |  |  |  |  |  |
| Minor |  |  |  |  |  |
| Cosmetics |  |  |  |  |  |

***Defects Logging and Status Changing  Mechanism***

***Turn Around Time for defect fixes***

17. # **Configuration Management**  {#configuration-management}

18. # **Release Criteria** {#release-criteria}

19. # **APPENDIX**

| ID | Test Case Field | Description |
| :---- | :---- | :---- |
| 1 | Test case ID | Test case ID Each test case should have a unique ID |
| 2 | Test Priority | Test Priority is very useful while executing tests. There are types of priorities: \- Low \- Medium \- High |
| 3 | Test Designed by | Name of test case writer (tester) |
| 4 | Date of test designed | The date on which the tests were created |
| 5 | Test Executed by | Tester’s Name |
| 6 | Date of the Test Execution | Date of test execution |
| 7 | Name or Test Title | The title should provide a brief description of the test case, such as "Reset password". The title is quite important because it is often the first or only thing you see when glancing at a list of test cases. Clear titles are the key to helping testers quickly find the right test cases. |
| 8 | Description/Summary of Test | Detailed description for the test case (test case). In this section, you can also set up categories to organize test cases into logical groups. |
| 9 | Pre-condition | Any requirements that need to be completed before test case execution |
| 10 | Test Steps | Test Steps Test steps, give the tester a numbered list of steps to be performed in the system, making the test case easier to understand. There should be 3-8 testing steps per test case. Too many steps will make it difficult for programmers and testers to reproduce the steps when a bug report is issued based on the test case. |
| 11 | Test Data | Test Data You can enter test data directly into the test data fields, or specify a separate file containing test data for 1 or more test cases. By using such a test data file, you avoid hard-coding test data in test cases, so a single test case can be used to test a set of test cases.  |
| 12 | Expected Results | Expected Results Refers to the expected results including errors or messages appearing on the screen. The tester needs to know the expected result to evaluate whether this test case is successful or not. Details about the optimal level of this field vary depending on the situation. |
| 13 | Post-Condition | Post-Condition What is the state of the system after running the test case? |
| 14 | Status (Fail/Pass) | Status (Fail/Pass) Mark this field as failed if the actual result is not the same as the expected result. Mark this field as Pass if the actual result is the same as the expected result. |
| 15 | Notes/Comments/Questions | Notes/Comments/Questions If some special conditions need to be noted related to the fields above. |
| 16 | Requirements | Requirements List of requirements for a specific testing cycle. |
| 17 | Attachments/References | Attachments/References Files and documents attached to the test case, such as screenshots and other supporting documents |
| 18 | Automation? (Yes/No) | Automation? (Yes/No) Fill in "YES" when the test cases using test automation. |

[image1]: <data:image/png;base64,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>