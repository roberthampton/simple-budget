var budgetButton = document.getElementById('budget-button');
var changeButton = document.getElementById('change-button');
var budgetText = document.getElementById('budget-text');
var budgetDisplay = document.getElementById("budget-display");
var remainingBudgetDisplay = document.getElementById("remaining-budget-display");

var expenseButton = document.getElementById('expense-button');
var expenseNameText = document.getElementById('expense-name-text');
var expenseAmountText = document.getElementById('expense-amount-text');

var budget = 0;
var expenseList = [];
var dataArray = [];
var labelArray = [];
var myPieChart;

changeButton.style.display = 'none';

class Expense {
  constructor(name, amount) {
    this.name = name;
    this.amount = amount;
    var inList = false;
  }
}

document.getElementById("budget-text").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("budget-button").click();
    }
});

document.getElementById("expense-amount-text").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("expense-button").click();
    }
});

budgetButton.addEventListener("click", function(){
  var temp = budgetText.value;

  if(validateNumber(temp))
  {
    changeButton.style.display = "inline";
    budgetText.disabled = true;
    budget = temp;
    updateBudget();
    generateChart();
  }
  else {
      budgetText.value = "";
      alert("Please enter a valid budget");
  }
});

changeButton.addEventListener("click", function(){
  changeButton.style.display = "none";
  budgetText.disabled = false;
  budgetText.select();

});

expenseButton.addEventListener("click", function(){
  if(budget == 0)
  {
    alert("Please first enter your monthly budget");
    return;
  }

  if(validateString(expenseNameText.value) && validateNumber(expenseAmountText.value))
  {
    addListElement(expenseNameText.value, expenseAmountText.value)
    expenseNameText.value = "";
    expenseAmountText.value = "";
  }
  else {
      alert("Please enter a valid expense. An expense must be a positive number.");
  }

});

function addListElement(name, amount)
{
  let newExpense = new Expense(name,amount);
  expenseList.push(newExpense);
  updateList();
  updateBudget();
}

function updateList()
{
  var ul = document.getElementById("expense-list");
  var length = expenseList.length;
  for (var i = 0; i < length; i++) {
    if(!(expenseList[i].inList))
    {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(expenseList[i].name + ": £" + expenseList[i].amount));
      ul.appendChild(li);
      expenseList[i].inList = true;

      labelArray.push(expenseList[i].name);
      dataArray.push(expenseList[i].amount);
    }
  }
  generateChart();
}

function updateRemainingChart()
{
  var remaining = calculateRemaining();

  if(remaining < 0)
  {
    remaining = 0;
  }

  if(dataArray.length == 0)
  {
    dataArray.push(remaining);
    labelArray.push("Remaining Budget");
  }

  else {
    dataArray[0] = remaining;
  }

}

//TODO: allow user to change the currency
//TODO: Use the way to put strings together without concatenation
function updateBudget()
{
  var remaining = calculateRemaining();
  budgetDisplay.innerHTML = "Overall Budget: £" + budget;
  remainingBudgetDisplay.innerHTML = "Remaining Budget: £" + remaining;
}

function calculateRemaining()
{
  var remaining = budget;
  var length = expenseList.length;
  for (var i = 0; i < length; i++) {
    remaining = remaining - expenseList[i].amount;
  }
  return remaining;
}


function generateChart() {
  updateRemainingChart();

  var ctx = document.getElementById('budget-chart');

  data = {
    label: 'Monthly Budget',
    datasets: [{
        data: dataArray,

        backgroundColor: ["lavender", "LightGreen", "Orchid", "LightPink", "LightBlue", "NavajoWhite",
        "MediumSeaGreen", "AntiqueWhite", "LightSlateGray", "Aquamarine"
        ]
    }],

    labels: labelArray,
};

options = {
  title: {
            display: true,
            text: 'Budget Breakdown'
        },
        responsive: true,
        hidden: true,
};

if(myPieChart == null)
{
  myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options,
});
}

else {
  myPieChart.update();
}
}


function validateNumber(input)
{
  if(isNaN(input) || ((Math.sign(input) < 1))){
    return false;
  }
  else {
    return true;
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function validateString(input)
{
  if (typeof input === 'string' || input instanceof String){
    return true;
  }
  else{
    return false;
  }
}
