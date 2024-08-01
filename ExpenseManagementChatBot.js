const TelegramBot = require('node-telegram-bot-api');
const token = '6499471922:AAEyTnE8dQlA_imtOtrVmKYBzeMqroTnec8';
const bot = new TelegramBot(token, { polling: true });
const expenses = [];
const expensesByCategory = {};
bot.onText(/\/start/, (msg) => {
 const chatId = msg.chat.id;
 bot.sendMessage(chatId, 'Hello! I am your Expense Management bot. You can track and categorize 
your expenses with me. Type /help for a list of available commands.');
});
bot.onText(/\/help/, (msg) => {
 const chatId = msg.chat.id;
 bot.sendMessage(chatId, 'Available commands:\n' +
 '/addexpense - Add a new expense\n' +
 '/viewexpenses - View your expenses\n' +
 '/totalexpenses - Calculate total expenses\n' +
 '/expensesbycategory - View expenses by category\n' +
 '/help - Show this help message');
});
bot.onText(/\/addexpense/, (msg) => {
 const chatId = msg.chat.id;
 bot.sendMessage(chatId, 'Enter your expense in the format: "amount category" (e.g., "20.00 
groceries")');
});
bot.on('text', (msg) => {
 const chatId = msg.chat.id;
 const messageText = msg.text;
 if (messageText.startsWith('/addexpense')) 
{
 const expenseDetails = messageText.replace('/addexpense', '').trim().split(' ');
 if (expenseDetails.length === 2 && !isNaN(expenseDetails[0]))
{
 const amount = parseFloat(expenseDetails[0]);
 const category = expenseDetails[1];
 // Update expenses array
 expenses.push({ amount, category });
 // Update expenses by category
 if (!expensesByCategory[category])
{
 expensesByCategory[category] = [];
}
 expensesByCategory[category].push({ amount, category });
 bot.sendMessage(chatId, `Expense added successfully: ${amount} ${category}`);
 } 
else {
 bot.sendMessage(chatId, 'Invalid expense format. Please use the format: "amount category"');
 }
 } 
else if (messageText === '/viewexpenses') {
 if (expenses.length > 0) {
 let expenseList = 'Your expenses:\n';
 expenses.forEach((expense, index) => {
 expenseList += `${index + 1}. ${expense.amount} ${expense.category}\n`;
 });
 bot.sendMessage(chatId, expenseList);
} 
else {
 bot.sendMessage(chatId, 'No expenses recorded yet.');
 }
 } 
else if (messageText === '/totalexpenses') {
 if (expenses.length > 0) {
 const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
 bot.sendMessage(chatId, `Total expenses: ${totalExpense}`);
} 
else {
 bot.sendMessage(chatId, 'No expenses recorded yet.');
 }
 } 
else if (messageText === '/expensesbycategory') {
 if (Object.keys(expensesByCategory).length > 0) {
 let categorySummary = 'Expenses by category:\n';
 for (const category in expensesByCategory) {
 const categoryTotal = expensesByCategory[category].reduce((total, expense) => total + 
expense.amount, 0);
 categorySummary += `${category}: ${categoryTotal}\n`;
 }
 bot.sendMessage(chatId, categorySummary);
 } 
else {
 bot.sendMessage(chatId, 'No expenses recorded yet.');
 }
 }
else {
 bot.sendMessage(chatId, 'Invalid command. Type /help for a list of available commands.');
 }
});
