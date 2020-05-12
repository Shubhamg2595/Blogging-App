import React, { useEffect, useState } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

function SinglePost(props) {

  const [image, setImage] = useState('')

  const { getPostById, currentPost } = props;

  useEffect(() => {
    const postId = props.match.params.postId;
    getPostById(postId);
  }, [])

  // find a optimized way
  useEffect(() => {
    if (currentPost) {
      setImage(`http://localhost:3000/${currentPost.imageUrl}`)
    }
  }, [currentPost])

  console.log('SinglePost props', props);

  return (
    <>
      {
        currentPost ? <section className="single-post">
          <h1>{currentPost.title}</h1>
          <h2>
            Created by {currentPost.author} on {new Date(currentPost.createdAt).toLocaleDateString('en-US')}
          </h2>
          <div className="single-post__image">
            <Image contain imageUrl={image} />
          </div>
          <p>{currentPost.content}</p>
        </section> : null
      }

    </>
  );
}

export default SinglePost;
