// Import and require mysql2
const mysql = require('mysql2');

const cTable = require('console.table'); 

require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_name
  },
);

const inquirer = require('inquirer');
const userPrompts = require('./assets/db/prompt')

function mainAccess() {

  let lastCall;

  let departList = [];
  db.query('SELECT department_name AS "department" FROM department',(err,results)=>{
    if (err) throw err;
    departList = results.map(({ id, department_name }) => ( department_name ));
  });

  let roleList = [];
  db.query('SELECT title FROM e_role',(err,results)=>{
    if (err) throw err;
    roleList = results.map(({ id, title, salary, department_id }) => ( title ));
  });

  let employeeList = [];
  db.query('SELECT first_name, last_name FROM employee',(err,results)=>{
    if (err) throw err;
    employeeList = results.map(({ id, first_name, last_name, role_id, manager_id}) => ( first_name +' '+ last_name ));
  });

  let manageList = [];


  userPrompts().then((response)=>{
    lastCall = response.query.toString().toUpperCase();
    if(lastCall != 'QUIT'){
      switch(lastCall){
        case 'VIEW ALL DEPARTMENTS':
          db.query("SELECT id, department_name AS 'name' FROM department", (err, results) => {
            if (err) throw err;
            console.log('\n');
            console.table(results);
          });
          mainAccess();
          break;
        case 'VIEW ALL ROLES':
          db.query("SELECT e_role.id, title, department.department_name AS 'department', salary FROM e_role JOIN department ON department.id = e_role.department_id;", (err, results) => {
            console.log('\n');
            console.table(results);
          });
          mainAccess();
          break;
        case 'VIEW ALL EMPLOYEES':
          db.query("SELECT employee.id, first_name, last_name, e_role.title, department.department_name AS 'department', salary, manager_id FROM employee LEFT JOIN e_role ON employee.role_id = e_role.id LEFT JOIN department ON e_role.department_id = department.id;", (err, results) => {
            console.log('\n');
            console.table(results);
          });
          mainAccess();
          break;
        case 'ADD A DEPARTMENT':
          inquirer.prompt([{
            type:'input',
            message:'What is the name of the department?',
            name:'dPrompt'
          }]).then((departmentResponse)=>{
            db.query('INSERT INTO department (department_name) VALUES (?);', [departmentResponse.dPrompt.toString()], (err, results) => {
              if (err) throw err;
              console.log('Added '+departmentResponse.dPrompt.toString()+' to the database.');
              mainAccess();
            });
          })
          break;
        case 'ADD A ROLE':
          inquirer.prompt([
            {
              type:'input',
              message:'What is the name of the role?',
              name:'rPrompt'
            },
            {
              type:'input',
              message: 'What is the salary of the role?',
              name: 'sPrompt'
            },
            {
              type:'list',
              message: 'Which department does the role belong to?',
              name: 'dList',
              choices: departList,
            }
          ]).then((roleResponse)=>{
            db.query('INSERT INTO e_role (title, salary, department_id) VALUES (?,?,?);', [roleResponse.rPrompt.toString(),roleResponse.sPrompt.toString(),roleResponse.dList.toString()], (err, results) => {
              if (err) throw err;
              console.log('Added'+roleResponse.rPrompt.toString()+' to the database.');
            });
          })
          break;
        case 'ADD AN EMPLOYEE':
          inquirer.prompt([
            {
              type:'input',
              message:"What is the employee's first name?",
              name:'fPrompt'
            },
            {
              type:'input',
              message: "What is the employee's last name?",
              name: 'lPrompt'
            },
            {
              type:'list',
              message: "What is the employee's role?",
              name: 'rList',
              choices: roleList
            },
            {
              type: 'list',
              message: "Who is the employee's manager?",
              name: 'mList',
              choices: manageList
            }
          ]).then((eResponse)=>{
            db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?);', [eResponse.fPrompt.toString(),eResponse.lPrompt.toString(),eResponse.roleList.toString()], (err, results) => {
              if (err) throw err;
              console.log('Added'+eResponse.fPrompt.toString()+' '+eResponse.lPrompt.toString()+' to the database.');
            });
          })
          break;
        case 'UPDATE AN EMPLOYEE ROLE':
          inquirer.prompt([
            {
              type:'list',
              message: "Which employee's role do you want to update?",
              name: 'eList',
              choices: employeeList
            },
            {
              type: 'list',
              message: "Which role do you like to assign to the selected employee?",
              name: 'newRList',
              choices: roleList
            }
          ]).then((uResponse)=>{
            db.query(``, (err, results) => {
              console.log("Updated employee's role.");
            });
          })
          break;
      }
    }
    console.log('Press ^C to exit.')
  })
}

mainAccess();