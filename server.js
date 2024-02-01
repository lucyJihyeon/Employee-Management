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

const updateRole = async () => {
  const eeNames = [];
  let fullName = await viewFullname();
  fullName[0].forEach(name => {
    eeNames.push(name.full_name);
  });
  let rolesArray = [];
  //store the roles
  let roles = await viewRoles();
  roles[0].forEach(role => {
    rolesArray.push(role.title);
  });
  const eeUpdates = await inquirer.prompt([
    {
      type: 'list',
      message: "Which employee's role do you want to update?",
      choices: eeNames,
      name: "name"
    },
    {
      type: 'list',
      message: "Which role do you want to assign the selected employee?",
      choices: rolesArray,
      name: "role"
    }
  ]);
  const sql_RU = `UPDATE employee
SET role_id = ?
WHERE id = ?`;
//from the roles objects array, find the one that matches the employeeInfo.role(user prompt)
const selectedRole = roles[0].find(role => role.title === eeUpdates.role);
//the matching object's id is the role id.
const role_id = selectedRole.id;
if (!selectedRole) {
  console.error('Error: Role not found');
  return;
}
const selectedEE = fullName[0].find(name => name.full_name === eeUpdates.name);
const ee_id = selectedEE.id;
try {
  await db.promise().query(sql_RU, [role_id, ee_id]); 
  console.log(`Updated ${eeUpdates.name}'s role successfully updated.`);
} catch (err)  {
console.error("Error Detected: ", err);
};
}

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

//method to view all of the employees' full names
const viewFullname = async () => {
  const sql_fullName = `SELECT id, CONCAT(first_name, " ", last_name) AS full_name
FROM employee`;
  try {
    // fetch the names and store them in an array named fullNames
    const [fullNames] = await db.promise().query(sql_fullName);
    return [fullNames];
  }catch (err) {
    console.error("Error Detected: ", err);
    return [];
  };
};

//method to add an employee to the database 
const addEmployee = async () => {
  let rolesArray = [];
  //store the roles
  let roles = await viewRoles();
  roles[0].forEach(role => {
    rolesArray.push(role.title);
  });
  //store the employee' full names
  let managerArray = ["None"];
  let fullName = await viewFullname();
  fullName[0].forEach(name => {
    managerArray.push(name.full_name);
  });

  //prompt the user to retrieve the necessary data about the new employee
  const employeeInfo = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: 'first_name'
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "last_name"
    },
    {
      type: "list",
      message: "What is the employee's role?",
      choices: rolesArray,
      name: "role"
    },
    {
      type: "list",
      message: "Who is the employee's manager?",
      choices: managerArray,
      name: "manager"
    }
   ]);
   //from the roles objects array, find the one that matches the employeeInfo.role(user prompt)
   const selectedRole = roles[0].find(role => role.title === employeeInfo.role);
   if (!selectedRole) {
    console.error("Error: Role not found");
    return;
   }
   //the matching object's id is the role id.
   const role_id = selectedRole.id;

   //if an user selected "None", set up as null
   let manager_id = null;
   //if an user selected a manager and it matches the employee's full name, return the matching object
   if (employeeInfo.manager !== "None") {
    const selectedManager = fullName[0].find(name => name.full_name === employeeInfo.manager);
    manager_id = selectedManager.id;
   };
   //use query method to add the new employee 
   const sql_NewEmployee = `INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES(?, ?, ?, ?)`;
   try {
      await db.promise().query(sql_NewEmployee, [employeeInfo.first_name, employeeInfo.last_name, manager_id, role_id]); 
      console.log(`Added ${employeeInfo.first_name} ${employeeInfo.last_name} to the database`);
   } catch (err)  {
    console.error("Error Detected: ", err);
   };
};

//function to add a role to the database
const addRole = async() => {
  //retrieve all the department objects from the veiwDepartments function
  let departmentArray = [];
  let departments = await viewDepartments();
  departments[0].forEach(dep => {
    departmentArray.push(dep.name);
  });
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      message: "What is the name of the role?",
      name: 'role'
    },
    {
      type: 'input',
      message: "What is the salary of the role?",
      name: 'salary'
    },
    {
      type: 'list',
      message: "Which department does the role belong to?",
      choices: departmentArray,
      name: 'department'
    }
  ]);
  //find the department record that matches the department name and gather the associated id of it
  const selectedDep = departments[0].find(dep => dep.name === roleInfo.department);
  const dep_id = selectedDep.id;

  //add the role record with the roleInfo data
  const sql_AR = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
  try {
    await db.promise().query(sql_AR, [roleInfo.role, Number(roleInfo.salary), dep_id]); 
    console.log(`Added ${roleInfo.role} to the database`);
 } catch (err)  {
  console.error("Error Detected: ", err);
 };
};

//method to add a new department to the database
const addDepartment = async () => {
  //prompt the user to enter the name of the department
  const newDep = await inquirer.prompt([
    {
      type: 'input',
      message: "What is the name of the department?",
      name: "name"
    }
  ]);
  //add a new record to the department table with the value of the new department name
  const sql_AD = `INSERT INTO department (name)
VALUES (?)`;
  try {
    await db.promise().query(sql_AD, [newDep.name]); 
    console.log(`Added ${newDep.name} to the database`);
 } catch (err)  {
  console.error("Error Detected: ", err);
 };
}

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
    case "Add Employee": 
      await addEmployee();
      break;
    case "Update Employee Role":
      await updateRole();
      break;
    case "Add Role":
      await addRole();
      break;
    case "Add Department":
      await addDepartment();
      break;
    //if a user selects "Quit", exit out of the program.
    case "Quit":
      console.log("Exiting the program.");
      process.exit(0);
  }
  //call promptUser() again for the next iteration.
  await promptUser();
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
