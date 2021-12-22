import { AuthCheck } from '../../components/AuthCheck';

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <p>Only shown if authenticated</p>
      </AuthCheck>
    </main>
  );
};

export default AdminPostsPage;
