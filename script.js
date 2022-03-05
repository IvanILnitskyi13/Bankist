'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  transferDate: [
    '2019-03-01 00:00',
    '2019-04-01 00:00',
    '2019-05-01 00:00',
    '2022-02-20 00:00',
    '2022-02-21 00:00',
    '2022-02-22 00:00',
    '2022-02-23 19:00',
    '2022-02-23 20:36',
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'PLN',
  locale: 'pl-PL',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  transferDate: [
    '2019-03-01 00:00',
    '2019-04-01 00:00',
    '2019-05-01 00:00',
    '2019-06-01 00:00',
    '2019-02-18 00:00',
    '2019-02-20 00:00',
    '2022-02-22 21:00',
    '2022-02-22 22:00',
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'GBP',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  transferDate: [
    '2019-03-01 00:00',
    '2019-04-01 00:00',
    '2019-05-01 00:00',
    '2019-06-01 00:00',
    '2019-07-01 00:00',
    '2019-08-01 00:00',
    '2019-09-01 00:00',
    '2019-10-01 00:00',
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  transferDate: [
    '2019-03-01 00:00',
    '2019-04-01 00:00',
    '2019-05-01 00:00',
    '2019-06-01 00:00',
    '2019-07-01 00:00',
    '2019-08-01 00:00',
    '2019-09-01 00:00',
    '2019-10-01 00:00',
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'EUR',
  locale: 'de-DE',
};

const accounts = [account1, account2, account3, account4];

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

const transferTime = [
  'some minutes ago',
  'hour ago',
  'today',
  'yesterday',
  '2 days ago',
  '3 days ago',
];

const getTransferTimeStrategy = date => {
  const now = new Date();
  const transferDate = new Date(date);

  switch (true) {
    case transferDate.getFullYear() < now.getFullYear():
    case transferDate.getMonth() < now.getMonth():
    case transferDate.getDate() < now.getDate() - 4:
      return transferDate;
    case transferDate.getDate() === now.getDate() - 3:
      return transferTime[transferTime.length - 1];
    case transferDate.getDate() === now.getDate() - 2:
      return transferTime[transferTime.length - 2];
    case transferDate.getDate() === now.getDate() - 1:
      return transferTime[transferTime.length - 3];
    case transferDate.getDate() === now.getDate() &&
      transferDate.getHours() < now.getHours() - 1:
      return transferTime[transferTime.length - 4];
    case transferDate.getHours() === now.getHours() - 1:
      return transferTime[transferTime.length - 5];
    default:
      return transferTime[transferTime.length - 6];
  }
};

const getFormattedDate = date => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, 0);
  const day = date.getDate().toString().padStart(2, 0);
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const formatCurr = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const newMovements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  newMovements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const displayDateStrategy = getTransferTimeStrategy(acc.transferDate.at(i));
    const transferDate =
      typeof displayDateStrategy === 'object'
        ? getFormattedDate(displayDateStrategy).split(' ').at(0)
        : displayDateStrategy;

    const formattedMovement = formatCurr(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}</div>
      <div class="movements__date">${transferDate}
    </div>
      <div class="movements__value"> ${formattedMovement}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcAndPrintBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = formatCurr(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(movement => movement > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(movement => movement < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = formatCurr(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
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
  displayMovements(currentAccount);
  calcAndPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

// Event handler
let currentAccount;

// * FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI();
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      //month: '2-digit',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 100;
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
    currentAccount.transferDate.push(getFormattedDate(new Date()));
    receiverAcc.movements.push(transferAmount);
    receiverAcc.transferDate.push(getFormattedDate(new Date()));
  } else if (!receiverAcc) {
    alert('User with that username does not exist');
  } else if (receiverAcc === currentAccount) {
    alert("Your can't transfer money to yourself");
  } else {
    alert('Your balance is too low');
  }

  inputTransferAmount.value = inputTransferTo.value = '';
  updateUI();
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.round(inputLoanAmount.value * 100) / 100;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.transferDate.push(getFormattedDate(new Date()));
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
  displayMovements(currentAccount, sortedState);
});
/////////////////////////////////////////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
