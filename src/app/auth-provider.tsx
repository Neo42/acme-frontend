"use client";

import { Authenticator } from "@aws-amplify/ui-react";

import { Amplify } from "aws-amplify";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
      },
    },
  },
  { ssr: true },
);

const FormFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Enter your username",
      label: "Username",
      inputProps: {
        required: true,
      },
    },
    email: {
      order: 2,
      placeholder: "Enter your email",
      label: "Email",
      inputProps: {
        required: true,
        type: "email",
      },
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: {
        required: true,
        type: "password",
      },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: {
        required: true,
        type: "password",
      },
    },
  },
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator formFields={FormFields}>
      {({ user }) =>
        user ? (
          <div>{children}</div>
        ) : (
          <div>
            <h1>Please sign in</h1>
          </div>
        )
      }
    </Authenticator>
  );
};

export { AuthProvider };
