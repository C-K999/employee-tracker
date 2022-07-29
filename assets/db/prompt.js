const inquirer = require('inquirer');

const userPrompts = () => {
    return inquirer.prompt([
        {
            type:'list',
            message:'What would you like to do?',
            name:'query',
            choices: ['View all departments', 'View all roles', 'View all employees','Add a department', 'Add a role', 'Add an employee', 'Update an employee role','Quit'],
            default: 'Quit',
        },
    ])
}

module.exports = userPrompts;