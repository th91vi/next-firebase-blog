import Link from 'next/link';

export const Navbar = () => {
  const user = null;
  const userName = null;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <button type="button" className="btn-logo">
              FEED
            </button>
          </Link>
        </li>
        {userName && (
          <>
            <li className="push-left">
              <Link href="/admin" passHref>
                <button type="button" className="btn-blue">
                  Write Posts
                </button>
              </Link>
            </li>
            <li>
              <Link href={`/${userName}`} passHref>
                <img src={user?.photoUrl} alt={userName} />
              </Link>
            </li>
          </>
        )}

        {!userName && (
          <li>
            <Link href="/enter" passHref>
              <button type="button" className="btn-blue">
                Log in
              </button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
