//importing neccessary modules
const figlet = require("figlet");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { table } = require("cli-table");

//create connection between the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Azsx340302@",
  database: "employees_db",
});

//function to start prompting a user what action they want to take
const promptUser = async () => {
  //store the answer from the user prompt
  const answer = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
      name: "action",
    },
  ]);
  let query = "";
  //switch statement to display different database table based on the user action
  switch (answer.action) {
    //when a user selects "View All Employees", update the query
    //joining the tables based on the primary key
    case "View All Employees":
      query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employee AS e
JOIN role AS r ON e.role_id = r.id 
JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id`;
      //execute the query and fetch the results
      db.query(query, function (err, results) {
        if (err) {
          console.error("Error detected: ", err);
        }
        //display the results in a table format
        console.table(results);
      });
      break;
    //when a user selects "View All Roles", update the query 
    case "View All Roles":
      query = `SELECT r.id AS id, r.title, d.name AS department, r.salary
FROM role AS r
JOIN department AS d ON r.department_id = d.id`;
      //execute the query and fetch the results
      db.query(query, function (err, results) {
        if (err)    {
            console.error("Error detected: " ,err);
        }
        console.table(results);
      });
      break;
      //when a user selects "View All Departments", update the query 
      case "View All Departments":
        query = `SELECT * FROM department`;
        //execute the query and fetch the results
        db.query(query, function (err, results) {
          if (err)  {
            console.error("Error dectected: ", err);
          }
          console.table(results);
        });
        break;
      


  }
};
//init function to start the app
const init = () => {
    //add figfont of "Employee Management" in the beginning
  figlet("Employee Management", function (err, data) {
    if (err) {
      console.error("Something went wrong..." + err);
      return;
    }
    //log the figfont to the console, then start prompting.
    console.log(data);
    promptUser();
  });
};
init();
