export type UserResponse = {
  bio: string;
  email: string;
  image: string;
  username: string;
  isAuthor: boolean;
  isGoogleAuth: boolean;
  token: string;

  [key: string]: string | boolean | undefined;
};

export type UserJSON = {
  //
};
