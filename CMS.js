const inquirer = require("inquirer");

class CMS {
  constructor() {}

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
            break;
          case "View all roles":
            // Logic for viewing all roles
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
}

module.exports = CMS;
