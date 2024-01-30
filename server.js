const figlet = require('figlet');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { table } = require('cli-table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Azsx340302@',
        database: 'employees_db'
    }
);

const promptUser = async () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
            name: 'action'
        }
    ])
    .then((answer) => {
        let query = '';
        switch(answer.action) {
            case "View All Employees":
                query = ''
                db.query(query, function (err, results) {
                    console.table(results);
                });
                break;
            case "View All Roles":
                query = `SELECT role.id AS id, role.title, department.name AS department, role.salary AS salary
                FROM role
                JOIN department ON role.department_id = department.id`
                db.query(query, function (err, results) {
                    console.table(results);
                });
                break;

        }
    })
}
const init = () => {
    figlet("Employee Management", function (err, data)  {
        if (err)    {
            console.error("Something went wrong..." + err);
            return;
        }
        console.log(data);
    });    
    promptUser()
}
init();