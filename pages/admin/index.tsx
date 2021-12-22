import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthCheck } from '../../components/AuthCheck';
import { PostFeed } from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { auth, firestore, serverTimeStamp } from '../../lib/firebase';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

const PostList = () => {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts');
  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);
  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin={true} />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { userName } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug);

    // Default values
    const data = {
      title,
      slug,
      uid,
      userName,
      published: false,
      content: '# hello world!',
      createdAt: serverTimeStamp(),
      updatedAt: serverTimeStamp(),
    };

    await ref.set(data);

    toast.success('Post created!');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write title here"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create new post
      </button>
    </form>
  );
};

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
};

export default AdminPostsPage;
