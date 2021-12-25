import { useDocumentData } from 'react-firebase-hooks/firestore';
import { PostContent } from '../../components/PostContent';
import { Metatags } from '../../components/Metatags';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';

const PostPage = (props) => {
  const postRef = firestore.doc(props.path);
  const [realTimePost] = useDocumentData(postRef);

  const post = realTimePost || props.post;
  return (
    <main>
      <Metatags title={post?.title} />
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
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('slug', '==', slug)
      .limit(1);
    const posts = (await postsQuery.get()).docs.map(postToJSON);
    post = posts[0];

    const postRef = userDoc.ref.collection('posts').doc(slug);
    path = postRef.path;
  } else {
    console.warn('No Document Found...');
  }

  return { props: { post, path }, revalidate: 5000 };
};

export const getStaticPaths = async () => {
  const snapshot = await firestore.collectionGroup('posts').get();
  const paths = snapshot.docs.map((doc) => {
    const { slug, userName: username } = doc.data();
    return { params: { slug, username } };
  });
  return { paths, fallback: 'blocking' };
};
