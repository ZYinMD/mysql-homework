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
connection.query('SELECT * FROM products', (error, results, fields) => {
  if (error) throw error;
  console.log(columnify(results));
  takeOrder(results);
});

function takeOrder(stock) { //the parameter is a result from MySQL query
  inquirer.prompt([{
      type: 'input',
      name: 'item_id',
      message: 'Which product would you like to buy? Please input product_id:',
    }, {
      type: 'input',
      name: 'number',
      message: 'How many do you want to buy?'
    }])
    .then(answers => {
      var productToBuy = stock[answers.item_id - 1];
      var remain = productToBuy.stock_quantity - answers.number;
      if (remain >= 0) {
        connection.query(`UPDATE products SET stock_quantity=${remain} WHERE item_id = ${answers.item_id}`, (error, results, fields) => {
          if (error) throw error;
          console.log(`You have successfully bought ${answers.number} ${productToBuy.product_name}(s), the total cost is $${productToBuy.price * answers.number}`);
          connection.end();
        });
      } else {
        console.log('Insufficient quantity! Please order again!');
        takeOrder(stock);
      }
    })

}
