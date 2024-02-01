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

//method to view all the departments
const viewDepartments = async () => {
  const query_VD = `SELECT * FROM department`;
  try {
    //ensures that the query returns a promise to use await and store the results in an array called departments 
    const [department] = await db.promise().query(query_VD);
    //it returns all the records as objects in an array 
    return [department];
  } catch (err) {
    console.error("Error Detected: ", err);
    return [];
  }
};

//method to view all the roles 
const viewRoles = async () => {
  //joining the tables based on the primary key
  const query_VR = `SELECT r.id AS id, r.title, d.name AS department, r.salary
  FROM role AS r
  JOIN department AS d ON r.department_id = d.id`;
  try {
    const [roles] = await db.promise().query(query_VR);
    return [roles];
  } catch (err) {
    console.error("Error detected: " , err);
    return [];
  };
};

//method to view all the employees 
const viewEmployees = async () => {
  const query_VE = 
  `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employee AS e
JOIN role AS r ON e.role_id = r.id 
JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id`;
  try {
    const [employees] = await db.promise().query(query_VE);
    return [employees];
  } catch (err) {
    console.error("Error Detected: ", err);
    return [];
  };
};

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
    //when a user selects "View All Employees", call viewEmployees method 
    case "View All Employees":
      const employees = await viewEmployees();
      console.table(employees[0]);
      break;
    //when a user selects "View All Roles", call viewroles method 
    case "View All Roles":
      const roles = await viewRoles();
      console.table(roles[0]);
      break;
    //when a user selects "View All Departments", call viewDepartments method.
    case "View All Departments":
      const departments = await viewDepartments();
      console.table(departments[0]);
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
