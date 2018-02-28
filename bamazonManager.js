const inquirer = require('inquirer');
const mysql = require('mysql');
const columnify = require('columnify');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bamazon'
});
connection.connect();
inquirer.prompt([{
    type: 'list',
    name: 'choices',
    message: 'What do you want to do?',
    choices: [
      'View Products for Sale',
      'View Low Inventory',
      'Add to Inventory',
      'Add New Product'
    ]
  }, ])
  .then(answers => {
    switch (answers.choices) {
      case 'View Products for Sale':
        viewProducts();
        break;
      case 'View Low Inventory':
        viewLowInventory();
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'Add New Product':
        addNewProduct();
        break;
      default:
        connection.end();
    }
  });

function viewProducts() {
  connection.query('SELECT * FROM products', (error, results, fields) => {
    if (error) throw error;
    console.log(columnify(results));
    connection.end();
  });
}

function viewLowInventory() {
  connection.query('SELECT * FROM products', (error, results, fields) => {
    if (error) throw error;
    for (let i in results) {
      if (results[i].stock_quantity > 5) delete results[i]
    }
    console.log(columnify(results));
    connection.end();
  });
}

function addToInventory() {
  inquirer.prompt([{
      type: 'input',
      name: 'item_id',
      message: 'Which item would you like to add more? Please input item id:'
    }, {
      type: 'input',
      name: 'quantity',
      message: 'How many units would you like to add?'
    }])
    .then(answers => {
      connection.query(`UPDATE products SET stock_quantity=stock_quantity+${answers.quantity} WHERE item_id = ${answers.item_id}`, (error, results, fields) => {
        if (error) throw error;
        console.log('Successfully restocked!')
        connection.end();
      });
    })
}
function addNewProduct() {
 inquirer.prompt([{
     type: 'input',
     name: 'product_name',
     message: 'What new product would you like to add?'
   }, {
     type: 'input',
     name: 'department_name',
     message: 'What department does it belong to?'
   }, {
     type: 'input',
     name: 'price',
     message: 'How much will it sell for?'
   }, {
     type: 'input',
     name: 'stock_quantity',
     message: 'How many units do you want to stock initially?'
   }])
   .then(answers => {
     connection.query(`INSERT INTO products SET product_name='${answers.product_name}', department_name='${answers.department_name}', price=${answers.price}, stock_quantity=${answers.stock_quantity}`, (error, results, fields) => {
       if (error) throw error;
       console.log(`You have successfully added ${answers.product_name}(s) to your products.`)
       connection.end();
     });
   })
}
