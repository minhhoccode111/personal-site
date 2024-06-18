// NOTE: split to multiple files when things bloat

// api url
const url = process.env.NEXT_PUBLIC_API_URL;
export const ApiUrl = url ? url : "http://localhost:3000/api";

// auth store name
const auth = process.env.NEXT_PUBLIC_AUTH_STORE_NAME;
export const AuthStoreName = auth ? auth : "mhc111-auth-store-name";

// guest users email
const email = process.env.NEXT_PUBLIC_USERS_EMAIL_PREFIX;
export const GuestUsersEmailPrefix = email ? email : "asd@gmail.com";

// guest users password
const pass = process.env.NEXT_PUBLIC_USERS_PASSWORD;
export const GuestUsersPassword = pass ? pass : "Bruh0!0!";

// number of guest users
const num = process.env.NEXT_PUBLIC_NUMBER_GUEST_USERS;
export const NumberGuestUsers = num ? Number(num) : 0;
