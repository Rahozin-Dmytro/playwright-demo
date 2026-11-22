// saucedemo.com (UI)
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  locked: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
};

export const checkoutInfo = {
  firstName: 'Dmytro',
  lastName: 'Tester',
  postalCode: '01001',
};

// dummyjson.com (API). Public demo credentials; can be overridden via env.
export const apiUser = {
  username: process.env.API_USERNAME ?? 'emilys',
  password: process.env.API_PASSWORD ?? 'emilyspass',
};
