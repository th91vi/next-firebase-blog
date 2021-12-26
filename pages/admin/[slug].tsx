import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { AuthCheck } from '../../components/AuthCheck';
import { auth, firestore, serverTimeStamp } from '../../lib/firebase';
import styles from '../../styles/Admin.module.css';

const AdminPostEdit = () => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
};

const PostManager = () => {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(slug);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button type="button" onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.userName}/${post.slug}`} passHref>
              <button type="button" className="btn-blue">
                Live view
              </button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

const PostForm = ({ defaultValues, postRef, preview }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimeStamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      {!preview && (
        <div className={styles.controls}>
          <textarea
            name="content"
            {...register('content', {
              required: 'Content is required',
              maxLength: {
                value: 20000,
                message: 'Content is too long',
              },
              minLength: { value: 10, message: 'Content is too short' },
            })}
          ></textarea>
          <fieldset>
            <input
              type="checkbox"
              name="published"
              className={styles.checkbox}
              {...register('published')}
            />
            <label>Published</label>
          </fieldset>
          {errors.content && (
            <p className="text-danger">{errors.content.message}</p>
          )}
          <button
            type="submit"
            className="btn-green"
            disabled={!isDirty || !isValid}
          >
            Save changes
          </button>
        </div>
      )}
    </form>
  );
};

export default AdminPostEdit;
