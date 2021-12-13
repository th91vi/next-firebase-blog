import { useDocumentData } from 'react-firebase-hooks/firestore';
import { PostContent } from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

const PostPage = (props) => {
  const postRef = firestore.doc(props.path);
  const [realTimePost] = useDocumentData(postRef);

  const post = realTimePost || props.post;
  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
      </aside>
    </main>
  );
};

export default PostPage;

export const getStaticProps = async ({ params }) => {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return { props: { post, path }, revalidate: 5000 };
};

export const getStaticPaths = async () => {
  const snapshot = await firestore.collectionGroup('posts').get();
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return { params: { slug, username } };
  });
  return { paths, fallback: 'blocking' };
};
