USE employee_db;

-- Populate the department table
INSERT INTO department (name)
VALUES ('Human Resources'),
       ('Engineering'),
       ('Finance');

-- Populate the role table
INSERT INTO role (title, salary, department_id)
VALUES ('HR Manager', 65345.00, 1),
       ('Software Engineer', 82500.00, 2),
       ('Accountant', 62000.00, 3),
       ('Engineering Lead', 130000.00, 2);

-- Populate the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Clark', 1, NULL),  -- Bob Clark is an HR Manager without a manager
       ('Jane', 'Smith', 2, NULL),  -- Jane Smith is a Software Engineer without a manager
       ('Robert', 'Brown', 3, NULL),  -- Robert Brown is an Accountant without a manager
       ('Nicole', 'Herritt', 2, 2),  -- Nicole Herritt is a Software Engineer with Jane Smith as her manager
       ('Randy', 'Herritt', 4, NULL);  -- Randy Herritt is an Engineering Lead without a manager
