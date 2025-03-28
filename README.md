# Personal Budget Tracker  

## Description  
The Personal Budget Tracker is a web application that helps users track their income and expenses. It displays the current balance and provides an overview of spending by category.  

## Features  
- Add income and expenses  
- View the current balance  
- See expense breakdown by category  
- Delete transactions  
- Data persistence using a JSON server  

## Technologies Used  
- HTML  
- CSS  
- JavaScript  
- JSON Server  

## How to Use  
1. Enter an income or expense amount along with a description.  
2. Click the add button to save the transaction.  
3. The balance updates automatically.  
4. Click the delete button to remove a transaction.  

## Setup Instructions  

### 1. Clone the Repository  
```sh
git clone <your-repository-url>
cd personal-budget-tracker
```

### 2. Install JSON Server  
Ensure you have **Node.js** installed, then install JSON Server:  
```sh
npm install -g json-server
```

### 3. Start the JSON Server  
Run the following command to start the server:  
```sh
json-server --watch db.json --port 3000
```
The server will be available at:  
**http://localhost:3000/transactions**  

### 4. Open the Project  
Open `index.html` in a browser to start using the app.  

## Future Improvements  
- Add editing functionality  
- Implement filters for transactions  
- Improve UI design  

