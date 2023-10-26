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
            "View total utilized budget of a department",
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
            return this.addEmployee();
          case "Update an employee role":
            return this.updateEmployeeRole();
          case "View total utilized budget of a department":
            return this.viewDepartmentBudget();
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
    // fetch the existing departments to let the user choose
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

  addEmployee() {
    // Fetch existing roles for the employee to choose from
    this.dbConnection.query("SELECT id, title FROM role", (err, roles) => {
      if (err) {
        console.error(err);
        return;
      }

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      // Fetch existing employees to choose a manager
      this.dbConnection.query(
        'SELECT id, CONCAT(first_name, " ", last_name) AS fullName FROM employee',
        (err, employees) => {
          if (err) {
            console.error(err);
            return;
          }

          const employeeChoices = employees.map((emp) => ({
            name: emp.fullName,
            value: emp.id,
          }));

          employeeChoices.unshift({ name: "None", value: null }); // In case an employee has no manager

          return inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "Enter the employee's first name:",
                validate: (input) =>
                  input ? true : "Please enter a first name.",
              },
              {
                type: "input",
                name: "lastName",
                message: "Enter the employee's last name:",
                validate: (input) =>
                  input ? true : "Please enter a last name.",
              },
              {
                type: "list",
                name: "roleId",
                message: "Choose the role for the employee:",
                choices: roleChoices,
              },
              {
                type: "list",
                name: "managerId",
                message: "Choose the manager for the employee:",
                choices: employeeChoices,
              },
            ])
            .then((answer) => {
              const query =
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);";
              this.dbConnection.query(
                query,
                [
                  answer.firstName,
                  answer.lastName,
                  answer.roleId,
                  answer.managerId,
                ],
                (err, result) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log(
                    `Added new employee: ${answer.firstName} ${answer.lastName}`
                  );
                  this.promptMainMenu();
                }
              );
            });
        }
      );
    });
  }

  updateEmployeeRole() {
    // Fetch existing employees for the user to choose from
    this.dbConnection.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS fullName FROM employee',
      (err, employees) => {
        if (err) {
          console.error(err);
          return;
        }

        const employeeChoices = employees.map((emp) => ({
          name: emp.fullName,
          value: emp.id,
        }));

        // Fetch existing roles for the user to choose the new role from
        this.dbConnection.query("SELECT id, title FROM role", (err, roles) => {
          if (err) {
            console.error(err);
            return;
          }

          const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
          }));

          return inquirer
            .prompt([
              {
                type: "list",
                name: "employeeId",
                message: "Choose the employee whose role you want to update:",
                choices: employeeChoices,
              },
              {
                type: "list",
                name: "newRoleId",
                message: "Choose the new role for this employee:",
                choices: roleChoices,
              },
            ])
            .then((answer) => {
              const query = "UPDATE employee SET role_id = ? WHERE id = ?;";
              this.dbConnection.query(
                query,
                [answer.newRoleId, answer.employeeId],
                (err, result) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log(`Updated role for the selected employee.`);
                  this.promptMainMenu();
                }
              );
            });
        });
      }
    );
  }

  viewDepartmentBudget() {
    const query = `
        SELECT 
            department.name AS 'Department',
            SUM(role.salary) AS 'Total Utilized Budget'
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        GROUP BY department.id, department.name
    `;

    this.runViewTableQuery(query);
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
