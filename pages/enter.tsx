import React, { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth, googleAuthProvider } from '../lib/firebase';

const SignInButton = () => {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button type="button" className="btn-google" onClick={signInWithGoogle}>
      <img src="/google-logo.png" alt="Google logo" /> Sign in with Google
    </button>
  );
};

const SignOutButton = () => (
  <button type="button" onClick={() => auth.signOut()}>
    Sign out
  </button>
);
const UsernameForm = () => {
  return null;
};

const EnterPage = () => {
  const { user, userName } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !userName ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

export default EnterPage;
