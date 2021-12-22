import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';

export const AuthCheck = ({ children, fallback }) => {
  const { userName } = useContext(UserContext);
  return userName
    ? children
    : fallback || <Link href="/enter">You must be signed in. Click here.</Link>;
};
