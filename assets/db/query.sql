source schema.sql;
source seeds.sql;

SELECT id, department_name AS 'name'
FROM department;

SELECT e_role.id, title, department.department_name AS 'department', salary
FROM e_role
JOIN department ON department.id = e_role.department_id;

SELECT employee.id, first_name, last_name, e_role.title, department.department_name AS 'department', salary, manager_id
FROM employee
JOIN e_role, department