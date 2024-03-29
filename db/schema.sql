-- delete a database if already exists to avoid duplicated file and create a database named employees_db
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
-- use the employees_db database
USE employees_db;

-- create a table called department
CREATE TABLE department (
    -- id field is automatically generated
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
    -- id filed will be related to another table
);
-- create a table called role 
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary MEDIUMINT NOT NULL,
    department_id INT,
    -- indicate that each field of the role table belongs to the department table based on the department id filed that is related to the department_id in the role table
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
    -- id filed will be related to another table
);
-- create a table called employee
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    -- indicate that each field of the employee table belongs to the role table based on the role_id that is related to the id in the role table
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    -- make the id field the primary key and correlated with the manager_id field 
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);