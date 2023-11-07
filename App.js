const path = require("path");
const fs = require("fs");
const { program } = require("commander");

function getNextExpenseId(expenses) {
  if (expenses.length === 0) {
    return 1;
  }
  const maxId = Math.max(...expenses.map((expense) => expense.id));
  return maxId + 1;
}

function addExpense(total, category, date) {
  let expenses = [];
  if (fs.existsSync("expenses.json")) {
    const data = fs.readFileSync("expenses.json", "utf-8");
    expenses = JSON.parse(data);
  }

  const expense = { id: getNextExpenseId(expenses), total, category, date };
  expenses.push(expense);

  fs.writeFileSync("expenses.json", JSON.stringify(expenses, null, 2));
  console.log("Expense added successfully with ID:", expense.id);
}

function searchExpenseByCategory(category) {
  if (fs.existsSync("expenses.json")) {
    const data = fs.readFileSync("expenses.json", "utf-8");
    const expenses = JSON.parse(data);

    const filteredExpenses = expenses.filter(
      (expense) => expense.category === category
    );

    console.log("Filtered Expenses:", filteredExpenses);
  } else {
    console.log("No expenses found.");
  }
}

function deleteExpenseById(id) {
  if (fs.existsSync("expenses.json")) {
    const data = fs.readFileSync("expenses.json", "utf-8");
    let expenses = JSON.parse(data);

    const index = expenses.findIndex((expense) => expense.id === id);
    if (index !== -1) {
      expenses.splice(index, 1);
      fs.writeFileSync("expenses.json", JSON.stringify(expenses, null, 2));
      console.log("Expense with ID", id, "deleted successfully.");
    } else {
      console.log("Expense with ID", id, "not found.");
    }
  } else {
    console.log("No expenses found.");
  }
}

program
  .command("add <total> <category> <date>")
  .action((total, category, date) => {
    addExpense(parseFloat(total), category, date);
  });

program.command("search <category>").action((category) => {
  searchExpenseByCategory(category);
});

program.command("delete <id>").action((id) => {
  deleteExpenseById(parseInt(id));
});

program.parse(process.argv);
