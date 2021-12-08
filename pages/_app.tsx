import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  const { user, userName } = useUserData();

  return (
    <UserContext.Provider value={{ user, userName }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
