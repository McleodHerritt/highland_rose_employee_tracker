const inquirer = require("inquirer");

class CMS {
  constructor() {}

  run() {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "test",
          message: "inquirer test:",
        },
      ])
      .then((answers) => {
        console.log("entered " + answers.test);
      });
  }
}

module.exports = CMS;
