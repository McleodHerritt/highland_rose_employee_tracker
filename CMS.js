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
            // Logic for viewing all departments
            return this.viewAllDepartments();
          case "View all roles":
            // Logic for viewing all roles
            return this.viewAllRoles();
            break;
          case "View all employees":
            // Logic for viewing all employees
            break;
          case "Add a department":
            // Logic for adding a department
            break;
          case "Add a role":
            // Logic for adding a role
            break;
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
    this.runQuery(query);
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

    this.runQuery(query);
  }

  runQuery(query) {
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
