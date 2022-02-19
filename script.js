'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const transferTime = ['today', '1 day ago', '2 days ago', '3 days ago'];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const newMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  newMovements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date();
    let movementsDate;

    if (i >= movements.length - 4) {
      movementsDate = transferTime.at(movements.length - (i + 1));
    } else {
      date.setDate(date.getDate() - (movements.length - i));
      movementsDate =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}</div>
      <div class="movements__date">${movementsDate}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcAndPrintBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = `${account.balance} €`;
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${incomes} €`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${outcomes} €`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest} €`;
};

const createUserNames = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(element => element.at(0))
      .join('');
  });
};

createUserNames(accounts);

const updateUI = () => {
  displayMovements(currentAccount.movements);
  calcAndPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

// Event handler
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI();
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const transferAmount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    transferAmount > 0 &&
    receiverAcc &&
    receiverAcc !== currentAccount &&
    transferAmount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAcc.movements.push(transferAmount);
  } else if (!receiverAcc) {
    alert('User with that username does not exist');
  } else if (receiverAcc === currentAccount) {
    alert("Your can't transfer money to yourself");
  } else {
    alert('Your balance is too low');
  }

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  updateUI();
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    inputLoanAmount.value = '';
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (username === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sortedState = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  sortedState = !sortedState;
  displayMovements(currentAccount.movements, sortedState);
});
/////////////////////////////////////////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
