const { table } = require("console");
const inquirer = require("inquirer");
const mqsql = require("mysql2");

class CMS {
  constructor(dbConnection) {
    this.dbConnection = dbConnection;
  }

  run() {
    return this.promptMainMenu();
  }

  promptMainMenu() {
    return inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: "What would you like to do?",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit",
          ],
        },
      ])
      .then((answers) => {
        switch (answers.action) {
          case "View all departments":
            return this.viewAllDepartments();
          case "View all roles":
            return this.viewAllRoles();
          case "View all employees":
            return this.viewAllEmployees();
          case "Add a department":
            return this.addDepartment();
          case "Add a role":
            return this.addRole();
          case "Add an employee":
            // Logic for adding an employee
            break;
          case "Update an employee role":
            // Logic for updating an employee role
            break;
          case "Exit":
            // Exit the application
            process.exit(0);
            break;
        }
        // After an action is completed, show the menu again
        return this.promptMainMenu();
      });
  }

  viewAllDepartments() {
    const query = "SELECT id, name FROM department";
    this.runViewTableQuery(query);
  }

  viewAllRoles() {
    const query = `
      SELECT role.id AS 'Role ID', 
             role.title AS 'Job Title', 
             department.name AS 'Department', 
             role.salary AS 'Salary'
      FROM role
      LEFT JOIN department ON role.department_id = department.id;
    `;

    this.runViewTableQuery(query);
  }

  viewAllEmployees() {
    const query = `
    SELECT e.id AS 'Employee ID',
           e.first_name AS 'First Name',
           e.last_name AS 'Last Name',
           role.title AS 'Job Title',
           department.name AS 'Department',
           role.salary AS 'Salary',
           CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id;
  `;

    this.runViewTableQuery(query);
  }

  addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Enter the name of the new department:",
          validate: (input) => {
            if (input) return true;
            else {
              console.log("Please enter a department name.");
              return false;
            }
          },
        },
      ])
      .then((answer) => {
        const query = "INSERT INTO department (name) VALUES (?);";

        this.dbConnection.query(query, answer.departmentName, (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Added new department:", answer.departmentName);

          this.promptMainMenu();
        });
      });
  }

  addRole() {
    // First, let's fetch the existing departments to let the user choose
    this.dbConnection.query(
      "SELECT id, name FROM department",
      (err, departments) => {
        if (err) {
          console.error(err);
          return;
        }

        const departmentChoices = departments.map((dept) => ({
          name: dept.name,
          value: dept.id,
        }));

        return inquirer
          .prompt([
            {
              type: "input",
              name: "roleName",
              message: "Enter the name of the new role:",
              validate: (input) => {
                if (input) return true;
                else {
                  console.log("Please enter a role name.");
                  return false;
                }
              },
            },
            {
              type: "input",
              name: "salary",
              message: "Enter the salary for the new role:",
              validate: (input) => {
                const valid = !isNaN(parseFloat(input));
                return valid || "Please enter a valid salary.";
              },
            },
            {
              type: "list",
              name: "departmentId",
              message: "Choose the department for the new role:",
              choices: departmentChoices,
            },
          ])
          .then((answer) => {
            const query =
              "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);";
            this.dbConnection.query(
              query,
              [answer.roleName, answer.salary, answer.departmentId],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log("Added new role:", answer.roleName);
                this.promptMainMenu();
              }
            );
          });
      }
    );
  }

  runViewTableQuery(query) {
    this.dbConnection.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return;
      }
      console.table(rows);
      // Return to the main menu after displaying the results
      this.promptMainMenu();
    });
  }
}

module.exports = CMS;
