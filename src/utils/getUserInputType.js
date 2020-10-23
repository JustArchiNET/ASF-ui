// Todo: Read EUserInputType from api

const types = {
  None: 0,
  Login: 1,
  Password: 2,
  SteamGuard: 3,
  SteamParentalCode: 4,
  TwoFactorAuthentication: 5,
};

export default function getUserInputType(id) {
  return Object.keys(types)[id];
}
