// src/components/HootDetails/HootDetails.jsx
import { useParams, Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as hootService from '../../services/hootService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';


const HootDetails = (props) => {
  const { hootId } = useParams();
  const { user } = useContext(UserContext);
  // console.log('hootId', hootId);
  const [hoot, setHoot] = useState(null);
  console.log('props:', props);


  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);

  // Verify the hoot state is set correctly:
  console.log('hoot state:', hoot);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot(prevHoot => ({
      ...prevHoot,
      comments: [...prevHoot.comments, newComment],
    }));
  };

//   const handleDeleteComment = async (commentId) => {
//   try {
//     const response = await deleteCommentService(commentId);
//     if (response.success) {
//       setHoot(prevHoot => ({
//         ...prevHoot,
//         comments: prevHoot.comments.filter(comment => comment._id !== commentId)
//       }));
//     }
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//   }
// };


  if (!hoot) return <main>Loading...</main>;
  return (
    <main>
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
          {hoot.author._id === user._id && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
              <button onClick={() => props.handleDeleteHoot(hootId)}>
                Delete
              </button>
            </>
          )}
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
              {hoot.author._id === user._id && (
                <><Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                  <button onClick={() => props.handleDeleteComment(hoot._id, comment._id)}>Delete</button>
                </>
              )}
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;
