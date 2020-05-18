import React, { Fragment, useState, useEffect } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './FeedPage.css';
import { connect } from 'react-redux'
import { fetchStatus, fetchPosts, addPost, updatePost, deletePostById } from '../../Redux/Actions/actions';

function Feed(props) {


    const {
        fetchUserStatus,
        status,
        fetchAllPosts,
        posts,
        loading,
        totalPosts,
        addNewPost,
        handleUpdatePost,
        deletePost } = props;

    console.log('2595 feedpage props', props);

    const token = localStorage.getItem('token')

    const [isEditing, setIsEditing] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [postPage, setPostPage] = useState(1);
    const [error, setError] = useState(null);


    useEffect(() => {
        console.log('in Component did mount');


        fetchUserStatus();
        loadPosts();
    }, [])




    function loadPosts(direction) {
        if (direction) {

        }
        let page = postPage;
        if (direction === 'next') {
            page++;
            setPostPage(page)
        }
        if (direction === 'previous') {
            page--;
            setPostPage(page);
        }

        fetchAllPosts(page);

    };

    const statusUpdateHandler = event => {
        event.preventDefault();
        fetch('http://localhost:3000/feed/status', {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error("Can't update status!");
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => {
                catchError(err);
            });
    };

    const newPostHandler = () => {
        setIsEditing(true)
    };

    const startEditPostHandler = postId => {
        const loadedPost = posts.find(p => p._id === postId);
        setIsEditing(true);
        setEditPost(loadedPost);


    };

    const cancelEditHandler = () => {
        setIsEditing(false);
        setEditPost(null);

    };

    const finishEditHandler = postData => {

        const formData = new FormData();
        formData.append('title', postData.title)
        formData.append('content', postData.content)
        formData.append('image', postData.image)

        console.log(formData.get('title'))
        console.log(formData.get('image'))

        if (editPost) {
            formData.append('oldPath', editPost.imagePath)
            handleUpdatePost({ post: formData, postId: editPost._id })
        }
        else {

            fetch('http://localhost:3000/post-image', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            })
                .then(res => res.json())
                .then(fileResponse => {
                    const imageUrl = fileResponse.filePath.split('\\').join('//');
                    postData.imageUrl = imageUrl;
                    addNewPost(postData);
                })
                .catch(err => console.log(err))




        }




        setIsEditing(false);

    };

    const statusInputChangeHandler = (input, value) => {

    };

    const deletePostHandler = postId => {
        deletePost(postId);
    };

    const errorHandler = () => {
        setError(null);
    };

    const catchError = error => {
        setError(error)
    };


    return (
        <Fragment>
            <ErrorHandler error={error} onHandle={errorHandler} />
            <FeedEdit
                editing={isEditing}
                selectedPost={editPost}
                loading={loading}
                onCancelEdit={cancelEditHandler}
                onFinishEdit={finishEditHandler}
            />
            <section className="feed__status">
                <form onSubmit={statusUpdateHandler}>
                    <Input
                        type="text"
                        placeholder="Your status"
                        control="input"
                        onChange={statusInputChangeHandler}
                        value={status}
                    />
                    <Button mode="flat" type="submit">
                        Update
            </Button>
                </form>
            </section>
            <section className="feed__control">
                <Button mode="raised" design="accent" onClick={() => newPostHandler()}>
                    New Post
          </Button>
            </section>
            <section className="feed">
                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Loader />
                    </div>
                )}
                {posts.length <= 0 && !loading ? (
                    <p style={{ textAlign: 'center' }}>No posts found.</p>
                ) : null}
                {!loading && (
                    <Paginator
                        onPrevious={() => loadPosts('previous')}
                        onNext={() => loadPosts('next')}
                        lastPage={Math.ceil(totalPosts / 2)}
                        currentPage={postPage}
                    >
                        {posts.map(post => (
                            <Post
                                key={post._id}
                                id={post._id}
                                author={post.creator.name}
                                date={new Date(post.createdAt).toLocaleDateString('en-US')}
                                title={post.title}
                                image={post.imageUrl}
                                content={post.content}
                                onStartEdit={() => startEditPostHandler(post._id)}
                                onDelete={() => deletePostHandler(post._id)}
                            />
                        ))}
                    </Paginator>
                )}
            </section>
        </Fragment>
    );
}


function mapStateToProps(state) {
    return {
        userId: state.auth.userId,
        status: state.feed.status,
        posts: Object.values(state.feed.posts),
        loading: state.feed.loading,
        loading: state.auth.loading,
        totalPosts: state.feed.totalPosts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserStatus: () => dispatch(fetchStatus()),
        fetchAllPosts: (pageNum) => dispatch(fetchPosts(pageNum)),
        addNewPost: (post) => dispatch(addPost(post)),
        handleUpdatePost: (post) => dispatch(updatePost(post)),
        deletePost: (postId) => dispatch(deletePostById(postId)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Feed);
