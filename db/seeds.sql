INSERT INTO department (id, name)
VALUES  (001, "sales"),
        (002, "Enginerring"),
        (003, "Finance"),
        (004, "Legal");

INSERT INTO role(id, title, salary, department_id)
VALUES (001, "Sales Lead", 100000, 001),
        (002, "Salesperson", 80000, 001),
        (003, "Lead Emgineer", 150000, 002),
        (004, "Software Engineer", 120000, 002),
        (005, "Account Manager", 160000, 003),
        (006, "Accountant", 125000, 003),
        (007, "Legal Team Lead", 250000, 004),
        (008, "Lawyer", 190000, 004);

INSERT INTO employee(id, first_name, last_name, manager_id, role_id)
VALUES (001, "John","Doe", NULL, 001),
        (002, "Mike", "Chan", 001, 002),
        (003, "Ashley", "Rodriguez", NULL, 003),
        (004, "Kevin", "Tupik", 003, 004),
        (005, "Kunal", "Singh", NULL, 005),
        (006, "Malia", "Brown", 005, 006),
        (007, "Sarah", "Lourd", NULL, 007),
        (008, "Tom", "Allen", 007, 008);
