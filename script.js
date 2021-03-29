'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Keano Bessa',
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

// DISPLAY ACCOUNT MOVEMENTS IN HTML
const displayMovements = function (movements, sort = false) {
  //this function should receive an array of movements and then work to display that data in the UI. It is best to pass this data into a function rather than have it work through a global variable. Best to not use global variables, rather pass the data a function needs, directly into that function

  // First thing you should do is remove any elements that are already visible in the movements container. (this can be implemented last when coding so it is easier to see output, but it is still the first thing w/in the function)
  containerMovements.innerHTML = ''; //innerHTML is similar to textContent but textContent only returns the text whereas innerHTML returns the html as well as the text. Note that innerHTML is a property and NOT a method therefore it does not end with (). innerHTML gets/sets HTML/XML contained w/in the element. Set to empty string in this case
  // Difference btw innerHTML & insertAdjacentHTML : innerHTML replaces the content, insertAdjacentHTML simply adds to content by insertion
  // REMEMBER in pig game : .textContent = 0 => setting the score equal to zero

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // if sort is true (default is false), then sort a copy of movements array in ascending order cz HTML elements inserted from the bottom up

  movs.forEach(function (mov, i) {
    // You need to check whether the current element is a deposit or a withdrawl. This the will change the styling attached to the html element as well as change the wording in that element. This logic is done outside html variable as it will need to be used more than once
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Template literals are great for creating DOM elements
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div> 
        </div>
        `;
    //mov is current element in the array we are looping over. Able to construct the html class name using template literal to ensure that a specific css style is altered depending on whether the transaction is a deposit or withdrawl

    containerMovements.insertAdjacentHTML('afterbegin', html); //Method attached to containerMovements variable which is a querySelector on the movements DOM elemnts. Accept 2 string arguments:
    // 1 - position in which you want to attach the HTML. 4 options:  A) 'beforebegin': Before the element itself. B)'afterbegin': Just inside the element, before its first child.C) 'beforeend': Just inside the element, after its last child. D) 'afterend': After the element itself.
    // 2 - the string of HTML that you want to parse in
  });
};
// displayMovements(account1.movements); => Inserted into btnLogin function
// console.log(containerMovements.innerHTML); //SHows the html associated w/ variable it is connected to

// COMPUTING AND DISPLAYING ACCOUNT BALANCE
// Creating a function to display an account balance based on movements in/out of account's movement array => making use of REDUCE method
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance} €`;
};

// COMPUTING AND DISPLAYING IN's AND OUT's OF ACCOUNT - (T.deposits and T.withdrawals)
// Make use of chaining data transformations => map, reduce & filter
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // For interest, in this exercise, the bank pays interest each time there is a deposit in the bank account. The interest is unique for each account and can be found in the account objects. Suppose as well that bank only pays interest for deposits if the interest is >=1 EUR
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deps => (deps * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// COMPUTING USERNAMES
// User names are just initials of the person
const createUserNames = function (accounts) {
  // Want this function to receive the data it should work w/ instead of making use of a global variable. In this case, you want the function to receive the accounts array
  accounts.forEach(function (acc) {
    // Using forEach method cz you dont want a new array, we simply want to modify the array we get as an input
    acc.username = acc.owner //Accessing the owner property where the name of each user is stored. Simultaneously creating new property on account element, stores username
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0]; // callback function in map method always needs to return the new value that should be in the new array
      })
      .join(''); // convert to lower case => seperate by spaces into array => get the first letter of each array element => join letters to become 1 word
  });
};
createUserNames(accounts);
// console.log(accounts); //showing that the createUserNames function had the intended result

// UPDATE UI FUNCTION
const updateUi = function (acc) {
  // => Display movements
  displayMovements(acc.movements);
  // => Display balance
  calcDisplayBalance(acc);
  // => Display summary
  calcDisplaySummary(acc); // not specifying a property like other 1 cz in this function we pass in the entire object and the function itself requests the specific property it needs. This is because we needed a dynamic interest rate for each account
};

// IMPLEMENTING LOGIN FUNCTIONALITY
let currentAccount; // set outside function cz will need to be used more than once. This allows us to know who is logged in. Points to the object containing user's info. Remember that this is not a copy of the account variable but it is rather a refernce to the object in the heap. That is why any changes to it, results in changes to the original object

// Event handlers
btnLogin.addEventListener('click', function (event) {
  // Prevents form from submitting. Need cz default behaviour for buttons in form elements in HTML, is for the page to reload. This stops that from happening
  event.preventDefault();
  // Hitting enter in the input field in an HTML form is exactly the same as clicking the submit button
  console.log(`Login`);

  // CHECKING WHICH USER IS LOGGING IN
  // To log the user in, we need to find the account from the accounts array w/ the username that the user inputted => use find() method. Set the currentAccount variable to the person who's login name is the same as the username property we generated earlier for each account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value //need to take the value in that field (inputted by user) rather than the field itself
  );
  console.log(currentAccount);

  // CHECKING IF PIN IS CORRECT FOR THE SPECIFIC ACCOUNT LOGGING IN
  // Have to make use of optional chaining when checking pin. If username inputted doesn't match any in accounts array, find() method returns undefined. When that undefined is inserted to currentAccount and evaluated here, it will return an error. Therefore use optional chaining (?.) => checks to see if the currentAccount actually exists before it evaluates the pin associated w/ it. Could also make use of short-circuiting here (&&).
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // If the username and pin are correct (determined cz of flowchart):
    //  => Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; //Ordinarily the opacity is set to 0 in the CSS. If the login is correct, we want the container to be visible

    // => Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    console.log(`correct pin`);

    // // => Display movements
    // displayMovements(currentAccount.movements);
    // // => Display balance
    // calcDisplayBalance(currentAccount);
    // // => Display summary
    // calcDisplaySummary(currentAccount);

    updateUi(currentAccount); // Consolidating above functions into a single function cz updating the UI will be used more than once. Dry code principle to not call all 3 functions each time
  }
});

// IMPLEMENTING TRANSFERS BETWEEN ACCOUNTS
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault(); //This button is a part of a form and therefore w/o this, the page will refresh when the button is clicked => Common to do when working w/ forms

  const amount = Number(inputTransferAmount.value);
  // We are looking for the account that has the value that the user inputs into the 'transfer to' field (username value for the account to which you want to transfer). Then we are searching for the real account who's username matches the one that has been inputted. We then select that account using the find() method
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = ''; // Clearing the input fields

  // => Check if transfer is a valid number, if receiver account is valid, if sender has enough money and if the valid transder to account is not the same as the sender account
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // => Add -ve movement to currentAccount
    currentAccount.movements.push(-amount);
    // => Add +ve movement to recipient
    receiverAccount.movements.push(amount);
    // => Update UI
    updateUi(currentAccount);
  }
});

// GRANTING LOANS TO USERS
// For this exercise, the bank only grants loans to users if they have at least 1 deposit w/ at least 10% of the requested loan amount.
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value); //retreiving the loan amount inputted by user

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    // If bank requirements for loan are met, perform the following:

    // => Add +ve movement to currentAccount
    currentAccount.movements.push(amount);
    // => Update UI
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

// DELETING AN ACCOUNT
// Deleting an account is basically removing the specified (currentAccount) from the main accounts array. To delete an element from an array you make use of the splice() method; to use splice() method you need the index position of the currentAccount and to get the index of the currentAccount you make use of the findIndex() method
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // => Check credentials are correct & equal to the currentAccount
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      // Looking for the index of the currentAccount in the accounts array
      acc => acc.username === currentAccount.username
    );

    // => Remove currentAccount from accounts array
    accounts.splice(index, 1);

    // => Hide UI (log user out)
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ''; // clearing fields
});

// SORT BUTTON FUNCTIONALITY - video 160
// State variable needed to determine what state we're in. Whether the movements are sorted or not
let sorted = false; //starts w/ false cz in the beginning the array is not sorted

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let testArr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(testArr.slice(2));
console.log(testArr.slice(2, 4));
console.log(testArr.slice(-1));
console.log(testArr.slice(1, -2));

// SPLICE - mutate
console.log(testArr.splice(2));
testArr.splice(2, 1, 'f', 'g');
console.log(testArr);
console.log(testArr.splice(2, 'f', 'g'));
console.log(testArr);

//REVERSE - mutate
testArr = ['a', 'b', 'c', 'd', 'e'];
let testArr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(testArr2.reverse());

// CONCAT
const letters = testArr.concat(testArr2);
console.log(letters);

// JOIN
console.log(testArr.join(', '));


// ///////////// LOOPING ARRAYS - FOR EACH()

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; // -ve values are withdrawls, +ve are deposits

for (const transaction of movements) {
  if (transaction > 0) {
    console.log(`You deposited ${transaction}`);
  } else {
    console.log(`You withdrew ${Math.abs(transaction)}`);
  }
}

console.log(`------FOR EACH-----`);

movements.forEach(function (transaction) {
  // forEach is a higher order function which requires a callback function inorder to tell it what to do. It is the forEach function that calls the callback; not us. forEach function executed for each element it is looping over in the array. forEach passes current element in the array as an argument for callback function
  if (transaction > 0) {
    console.log(`You deposited ${transaction}`);
  } else {
    console.log(`You withdrew ${Math.abs(transaction)}`);
  }
});
// For iteration 0 : anonymous function is called with the value of 200 => function(200)
// FOr iteration 1 function called with value of 450 = function(450)
// and so on...

// ACCESSING COUNTER VARIABLE
// In for-of loop:
// for(const [i, transaction] of movements.entries()) => .entries is a method attached to the array which returns an array of arrays where each position of the parent array contains an array with the current index and the value itself. Each of the child arrays are then destructured into their 2 component parts in order to gain access to the index position

console.log(`-----ACCESSING COUNTER VARIABLE (FOR-OF LOOP)------`);
for (const [i, transaction] of movements.entries()) {
  if (transaction > 0) {
    console.log(`Movement ${i + 1}: You deposited ${transaction}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(transaction)}`);
  }
}

console.log(`-----ACCESSING COUNTER VARIABLE (FOREACH() METHOD)------`);

// In forEach method:
// the method does NOT ONLY call the function and pass in the current element to the argument, but it passes in the current element, the current index and the entire array that you are looping.
// arr.forEach(callback-function(currentValue, index, array){...execution...}

movements.forEach(function (transaction, i, arr) {
  // you can give any names you want to the arguments and you dont HAVE to use all of them. What does matter is the order; 1st prameter is always the current element, 2nd is always the index and 3rd is always the array itself
  if (transaction > 0) {
    console.log(`Movement ${i + 1}: You deposited ${transaction}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(transaction)}`);
  }
});

// NOTE: The difference in position of index and value in forEach and what returns for .entries()
//    a) forEach order: 1st => value, 2nd => index
//    b) .entries(): 1st => index, 2nd => value

// Cannot break out of a forEach loop => CONTINUE and BREAK statements do not work. forEach ALWAYS loops over every element in the array

// ///////////// FOREACH() WITH MAPS AND SETS

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// MAP
currencies.forEach(function (value, key, map) {
  //also has 3 parameters therefore when callback function is calle by forEach, it will be called with 3 arguments. 1st : current value, 2nd : key, 3rd : entire map
  console.log(`${key} : ${value}`);
});

// SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

currenciesUnique.forEach(function (value, key, set) {
  //key displayed is exactly the same as the value. This is because a set does not contain keys, nor do they have an index. However, the 3 arguments are still kept here in order to keep the structure the same as when forEach is used with arrays and maps. You dont make use of the key argument; but it will need to be included if you want to have access to the set in the forEach loop.
  console.log(`${key} : ${value}`);
});

// ////////////////////////////////////////////////////////////
// CODING CHALLENGE 1

//  Create checkDogs function that accepts 2 arrays of dog's ages and does the following:
// 1) Create shallow copy of Julia's array that removes 1st and last 2 elements
// 2) create array w/ both peoples data
// 3) For each of the dogs , log if theyre an adult or not. Adult is >3yrs old: A) Dog number 1 is an adult, and is 5 years old B) Dog number 2 is still a puppy 🐶

const checkDogs = function (dogsJulia, dogsKate) {
  const removeCats = dogsJulia.slice(1, 3); //can also create shallow copy w/ splice and then splice out the elements you dont want

  const bothArrays = removeCats.concat(dogsKate);

  bothArrays.forEach(function (dog, i) {
    dog >= 3
      ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
      : console.log(
          `Dog number ${i + 1} is still a puppy🐶, and is ${dog} years old`
        );
  });
};

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];
checkDogs(dogsJulia, dogsKate);

// Performance => 100% correct, well done
// ////////////////////////////////////////////////////////////

// ///////////// DATA TRANSFORMATIONS - MAP, FILTER, REDUCE

// Methods used to create new arrays by transforming other arrays
// 1) Map = method used to loop over arrays
//      - Similar to forEach but creates a new array based on the one it is attached to
//      - Applies callback function to each element in array
//      - 'maps' the values of the origianl array to a new array
//      - Often more useful than forEach cz of the fact this this builds a new array

// 2) Filter = Filters elements from the original array which satisfy for a certain condition
//      - Only elements that meet that criteria will be returned in a new array (where condition = true)
//      - Eg Only allowing elements that are >2 into new array

// 3) Reduce = Boils down (reduces) all elements in the array to a single value
//      - Eg. Add all elements of an array together
//      -- It will contain an accumulator variable and adds (one by one) each element in the array to that accumulator. Accumulator becomes the T.sum
//      -- Imagine it as a snowball that gets bigger and bigger as it rolls down a hill
//      - Only the reduced value is returned from this method (accumulator in example) -> no new array

// ///////////// MAP METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// storing output of map cz it returns an array
const movementsUsd = movements.map(function (mov) {
  // has same structure as forEach method with arguments and callback function
  return mov * eurToUsd;
  // return 23 //this shows how the method works. For each iteration of the movements array, it simply puts 23 as the value
});
console.log(movements);
console.log(movementsUsd);

// obtaining the same output as above but using a for-of loop
const movementsUsdFor = [];
for (const mov of movements) {
  movementsUsdFor.push(mov * eurToUsd);
}

console.log(movementsUsdFor);

// Using map method is more in line with functional programming. MAking use of a function and method to create an array => more modern way of writing code in JS.
// For-of loop is looping over original array and manually inserting values into an array we had to explicitly create

// Simplifying map method code by replacing calback function w/ arrow function:
// const movementsUsd = movements.map(mov => mov * eurToUsd);
// Up to you if you want to use this notation or using notation w/o arrow function

// map method has access to exact same 3 parameters as the forEach method

const movementDescriptions = movements.map((mov, i, arr) => {
  // shortest way of typing the below code instead of using if/else
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
    mov
  )}`;

  // if (mov > 0) {
  //   return `Movement ${i + 1}: You deposited ${mov}`;
  // } else {
  //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  // } // we want to return these values as they will be placed into the new array
});

console.log(movementDescriptions);

// ///////////// FILTER METHOD

// Callback function is used to specify the condition that must be met

// Want to create an array that contains all the users deposits => ie filter out all the negative values which indicate a withdrawal
const deposits = movements.filter(function (mov) {
  //Like the other methods, filter gains access to the element, the index and the array itself
  return mov > 0;
});

console.log(deposits);

// Getting the same result using a for-of loop
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


// ///////////// REDUCE METHOD

// Summing all the elements in the movements array will give you a total balance for the account

const balance = movements.reduce(function (accumulator, current, i, arr) {
  // Unlike map & forEach, the callback function the 1st parameter is the accumulator(the snowball, where the array elements get added to), the rest of the parameters are the same
  return accumulator + current; // in each iteration, we return the accumulator PLUS the current value
}, 0); // Additionally, the reduce method has this extra parameter which specifies the initial value of the accumulator => for this example we start at 0

console.log(balance);

// Above code as a for loop. Note that you often need to use an external value when you want to use a for-of loop => becomes cumbersome and impractical
let forBalance = 0;
for (const mov of movements) {
  forBalance += mov;
}
console.log(forBalance);

// This method could also be used to get the maximum value of the movements array - REDUCE is used to boil an array to a single value, that value can be anything we want, it doesnt have to be a sum, it can be a multiplication, a string, an object etc

// Max number
// In this example, the accumulator is going to be keeping track of the current maximum value; previously it kept track of the sum
const max = movements.reduce(
  (acc, mov) => (mov > acc ? (acc = mov) : (acc = acc)),
  movements[0] // when looking for max/min, it is always best to start the accumulator at the 1st value of the array rather than 0 cz can introduce bugs if started at 0
);

console.log(max);


// ////////////////////////////////////////////////////////////
// CODING CHALLENGE 2

// Create calcAverageHumanAge function which accepts ages as arguments

// 1) Calc dog age in human years
// dog <= 2years : humanAge = 2 * dogAge
// dog > 2years : humanAge = 16 + dogAge * 4

// map, filter, reduce

// 2) Exclude dogs that are less than 18 human years old

// 3) Calc average human age of all adult dogs

const calcAverageHumanAge = function (ages) {
  const ageInHumanYears = ages.map(function (dogAge) {
    return dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
  });

  console.log(ageInHumanYears);

  const dogsOfAge = ageInHumanYears.filter(ages => ages >= 18);

  console.log(dogsOfAge);

  // const totalHumanAge = dogsOfAge.reduce((acc, ages) => acc + ages, 0);
  // console.log(totalHumanAge);

  // const averageHumanAge = totalHumanAge / dogsOfAge.length;
  // console.log(averageHumanAge);

  const averageHumanAge = dogsOfAge.reduce(
    (acc, ages, i, arr) => acc + ages / arr.length,
    0
  );
  // (2+3)/2 = 2.5  === 2/2 + 3/2 => rationale for above calc

  console.log(averageHumanAge);
};

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

console.log(`----DATA 1----`);
calcAverageHumanAge(data1);
console.log(`----DATA 2----`);
calcAverageHumanAge(data2);

// Performance - 100% correct => the only thing you could have changed is that totalHumanAge and averageHumanAge could have been in a single line
// ////////////////////////////////////////////////////////////


// ///////////// CHAINING METHODS

// Done instead of doing methods seperately and storing the results in variables

// Example: Want to take all the deposits, convert to $ from Euro's and add them all up to know how much was deposited in USD
const euroToUsd = 1.1;
const totalDepositsInUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0); // 3 data transformations all in 1 go
// You can only chain 1 method after another if the first method returns an array therefore you cant chain another method after using reduce method as it returns a single value
console.log(totalDepositsInUSD);
// Chaining methods can be difficult to debug when the output is not what you expected. To help in this, you can make use of the array parameter in each of the methods to inspect the current array at any point in the chain
// Try not to overuse chaining. Chaining tons of methods after one another can cause big performance issues when working w/ very large arrays. In such a case, you should try compress the amount of methods used to as little as possible
// Bad practise in JS to chain methods that mutate the original array => eg slice/reverse method

// ////////////////////////////////////////////////////////////
// CODING CHALLENGE 3

// Rewrite calcAverageHumanAge as arrow function using chianing

const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(ages => ages >= 18)
    .reduce((acc, ages, i, arr) => acc + ages / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Performance - 100% correct
// ////////////////////////////////////////////////////////////

// ///////////// FIND METHOD

// Used to retrieve an element in an array based on a condition
// Returns value of of the first element in the array that fufills the condition (single value). Unlike filter method that returns an array of all elements that meet the condition
// If no value found, it returns undefined
// Accepts arguments and a callback function as previous methods
// Another method that loops over an array

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);
// This is the accounts array that stores ojects containing info on each account - Common data structure in JS
// Using find(), we can find an object in the array based on a property of that object

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
// Since find() is used to return 1 element, we set the condition so that ONLY 1 element will satisfy that condition, rather than just looking for the first occurence. Thats why we used the === operator

// ///////////// FIND INDEX METHOD

// Similar to find() method but rather returns the index of the element and not the element itself. Also gets access to the same parameters as find() => not very useful in practise
// Returns index of FIRST element that satisfies the condition
// Syntax:
//          arr.findIndex( function (element, index, array) { ... })

// If not element found, method returns -1
// indexOF() returns true or false only if the element specified is in the array. findIndex allows the use of much more complex logic through callback function

// EXAMPLE
// const array1 = [5, 12, 8, 130, 44];
// const isLargeNumber = (element) => element > 13;
// console.log(array1.findIndex(isLargeNumber));
// expected output: 3

// find() & findIndex() introduced in es6 therefore these features not supported in super old browsers

// ///////////// SOME & EVERY METHOD

console.log(movements);
console.log(movements.includes(-130)); // .includes() essentially tests for equality. It will only tell you if that element is present in the array or not
// What if you want to test for a condition instead? => SOME method

// SOME METHOD
// Tests whether at least 1 element in array passes test specified in callback function
// Also loops over array and has access to same variables as previous methods
// Returns true if callback function returns truthy value for at least 1 element in array, else returns false
// Calling on empty array returns false

// Example: Want to test if there is any +ve movement in the array - ie any movement above 0
let anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

// EVERY METHOD
// Tests whether all elements in array pass the test defined by te callback function
// every() only returns true if all the elements satisfy the condition, else returns false
// Syntax:
//        arr.every(function (element, i, arr) {...})

// Example => check if all the movements are deposits
console.log(movements.every(mov => mov > 0)); //returns false
// However, account 4 has only +ve movements
console.log(account4.movements.every(mov => mov > 0)); //returns true

// Seperate callback => allows you to change the function once and have the desired effect over every place it is implemented
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// ///////////// FLAT AND FLATMAP METHOD

// FLAT METHOD
// Creates new array w/ all sub-array elements concatenated into it recursively, up to specified depth
// Syntax:
//        let newArr = arr.flat(depth)
// Depth default is 1. Specifies how deep a nested array should be flattened
// Returns new array, original not affected

const arr = [[1, 2, 3], [4, 5, 6], 7, 8]; //nested array
console.log(arr.flat());
console.log(arr);

const arr2 = [0, 1, 2, [[[3, 4]]]];
console.log(arr2.flat(2));
console.log(arr2.flat(3));

// Example => finding the total movements of all 4 of the accounts combined.
// Individual movements stored in accounts array inside each object
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const totalMovements = accountMovements.flat();
console.log(totalMovements);
const overallBalance = totalMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
// Note: these can all be chained
// Using map() first and then flat() is a very common use scenario, therefore flatMap() was created

// FLATMAP METHOD
// Returns new array formed by applying callback to each element of array then flattening result by 1 level. (same as using map then flat of depth 1)
// Syntax:
//        const newArr = arr.flatMap( function (element, i, arr){...})
// Better for performance

// Example
const flatMapBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(flatMapBalance);

// ///////////// SORTING ARRAYS (SORT METHOD)

// Sorts elements of arrays in-place & returns sorted array - MUTATES the original array. NO copy is made
// Default sort order is ascending (aplphabetically in strings)
// Sorted by converting elements into strings
// Syntax:
//        arr.sort( compareFunction )
//
// Compare function: Specifies function that defines sort order. Can be omitted but then elements sorted in default way
//  - if included, all non-undefined elements sorted according to return value of function
//  -- undefined's sorted to end of array
//  - Called w/ 2 arguments => simply call them a & b where a = currentValue, b = next value (if you imagine the sort method looping over the array)
//  -- Can also think of a & b as any 2 consecutive numbers in an array
//  - if a & b were 2 elements being compared, then if compareFunction returns value:
//  -- >0 => sort b before a
//  -- <0 => sort a to an index lower than b (a comes before b)
//  -- =0 => leave a & b unchanged
//
// Sort method doesnt work correctly if you have mixed arrays

// Strings
const owners = ['Keano', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); // sorts alphabetically
console.log(owners);

// Numbers
const numbersArr = [1, 200, 21, 3500, 37];
console.log(numbersArr.sort());
console.log(movements.sort()); //Doesn't work in the way you want it to

// return < 0 : A sorted before B (keep order)
// return > 0 : B sorted before A (switch order)

// sorting in acsending order:
movements.sort((a, b) => {
  if (a > b) {
    // if the first number (a) is bigger than the second number (b), sort the second number (b) first ( return > 0)
    return 1; //number here doesnt matter, so long as it is >0
  } else {
    //where a < b
    return -1;
  }
});
console.log(movements);

// sorting in descending order:
movements.sort((a, b) => {
  if (a > b) {
    // if the first number (a) is bigger than the second number (b), sort the first number (a) first (return < 0)
    return -1; //NOte that only the number returned is changed
  } else {
    return 1;
  }
});
console.log(movements);

// SIMPLER WAY

// Ascending order
movements.sort((a, b) => a - b); // if a > b, then a - b will be a +ve number
console.log(movements);

// Descending order
movements.sort((a, b) => b - a); //if a > b, then b - a will be a -ve number
console.log(movements);

// ////////// /// MORE WAYS TO FILL AND CREATE ARRAYS

// Way of creating arrays up to this point
console.log([1, 6, 9, 6, 7, 2, 3, 5, 5]); // manually filling it out ourself
console.log(new Array(1, 2, 3, 4, 5, 6, 7)); // Using the array constructor

// Creating arrays programatically - ie not doing it manually ourselves

const x = new Array(7); //easiest way to do it is w/ array constructor => creates a new array w/ 7 empty elements in it. This is a feature of the new Array function whereby if you only pass 1 argument into it, it will create a new empty argument w/ the length equal to the specified argument
console.log(x);
// Cant call the map method to fill up the x array
// Only useful for 1 method: fill() method

// FILL METHOD - Mutates original array
// Changes all elements in array to a static value
// Can specify a start and end index - default is 0 => array.length
// Returns modified array
// Syntax:
//        arr.fill(value, startPos, endPos)
// startPos & endPos are index values. startPos <= x < endPos

x.fill(1);
console.log(x);

x.fill(3, 4, 6);
console.log(x);

// ARRAY.FROM METHOD
// Array.from is not attached to a specific array, instead using it on array constructor function (same as new Array(...)) => On this functon, we call the from method
// Creates new, shallow copy array from an array-like / iterable object
// - array-like object = objects w/ .length property & indexed elements
// - iterable object = maps, sets, strings etc
// Syntax:
//        Array.from( arrayLike , mapFunction )
// mapFunction is a function to call on every element of the array. Is Optional.
// - Same as doing Array.from(obj).map(mapFn); except this way creates an iintermediate function after 1st method applied

const y = Array.from({ length: 7 }, () => 1); // Passing in an object with the length property set to 7 as first arg; map function w/ no arguments that just applies the value of 1 to every element it loops over as second argument
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // The callback function here is exactly the same as the one in a map() method; therefore has access to the same parameters. Think of it as calling a map method on an empty array. _ parameter used as a notation to indicate the use of a throwaway paramter. It is just a placeholder cz order of paramters is important
console.log(z);

// create an array w/ 100 random dice rolls
let dice = function () {
  return Math.trunc(Math.random() * 6 + 1);
};
const rollArr = Array.from({ length: 100 }, () => dice());
const diceArr = Array.from({ length: 6 }, (_, i) => i + 1);
console.log(rollArr);

console.log(`1's rolled: ${rollArr.filter(roll => roll === 1).length}`);
console.log(`2's rolled: ${rollArr.filter(roll => roll === 2).length}`);
console.log(`3's rolled: ${rollArr.filter(roll => roll === 3).length}`);
console.log(`4's rolled: ${rollArr.filter(roll => roll === 4).length}`);
console.log(`5's rolled: ${rollArr.filter(roll => roll === 5).length}`);
console.log(`6's rolled: ${rollArr.filter(roll => roll === 6).length}`);

// Example: Pretend you only have the movements stored in the UI, you dont have them stored in the code and you want to calc their sum. You need to get the movements from the UI & store them in an array to get the sum

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'), // selecting all the elemnts that have that class
    el => Number(el.textContent.replace('€', '')) // using the mapFunction arg w/in Array.from method to select the textContent & removing the € sign where the reult will then be placed in an array
  );
  console.log(movementsUI);

  // There is another way to create an array from selecting the DOM elements:
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  // However, this way of doing it requires you to do the mapping method seperately
});
*/

// ////////////////////////////////////////////////////////////
// CODING CHALLENGE 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1) For each obj in array, calc recommended food portion & add as new property to obj
// recommendedFood = weight ** 0.75 * 28.

dogs.forEach(function (obj) {
  obj.recommendedFood = Math.trunc(obj.weight ** 0.75 * 28);
});
console.log(dogs);

// OKAY AMOUNT OF FOOD: Btw 90% and 110% of recommended
const correctAmountOfFood = obj => {
  if (
    obj.curFood >= obj.recommendedFood * 0.9 &&
    obj.curFood <= obj.recommendedFood * 1.1
  ) {
    console.log(`Correct food`);
  }
  if (obj.curFood < obj.recommendedFood * 0.9) {
    console.log(`Too little food`);
  } else if (obj.curFood > obj.recommendedFood * 1.1) {
    console.log(`Too much food`);
  }
};

correctAmountOfFood(dogs[0]);
correctAmountOfFood(dogs[1]);
correctAmountOfFood(dogs[2]);
correctAmountOfFood(dogs[3]);

// 2) Find Sarah's dog & log if its eating too much or too little
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog);
correctAmountOfFood(sarahDog);

// didnt know how to do this

// 3) Create array of owners who's dogs eat too much and those who eat too little
// ownersEatTooMuch   ownersEatTooLittle
// filter if curFood > recomFood *1.1
//           curFood < recomFood *0.9
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood * 1.1)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(
    //Before it is flatMap'd, the filter returns an array w/ 2 objects inside it
    dog => dog.curFood < dog.recommendedFood * 0.9
  )
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch, ownersEatTooLittle);

// 4) Log a string that says: Matilda and Alice and Bob's dogs eat too much!
console.log(`${ownersEatTooMuch.join(`'s and `)} dogs eat too much`);
console.log(`${ownersEatTooLittle.join(`'s and `)} dogs eat too little`);

// 5) Log to console if any dog is eating exactly the right amount of food
// find if dog.curfood === dog.recFood
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6) Log if there is any dog eating an ok amount of food
console.log(
  dogs.some(
    dog =>
      dog.curFood >= dog.recommendedFood * 0.9 &&
      dog.curFood <= dog.recommendedFood * 1.1
  )
);

// 7) Create array containing dogs that eat an ok amount of food
const okAmountOfFood = dogs.filter(
  dog =>
    dog.curFood >= dog.recommendedFood * 0.9 &&
    dog.curFood <= dog.recommendedFood * 1.1
);

console.log(okAmountOfFood);

// 8) Create shallow copy of dogs and sort by recommendedFood in ascending order
let dogCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood); // a and b are actually just the objects in the array, whereas in notes you only worked w/ numbers in arrays. But you want to compare based on recommended food so to access the value assciated w/ that property, you simply specify it attached to the object
// dog.recommendedFood.sort((a, b) => a - b);

console.log(dogCopy);
