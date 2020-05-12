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
    // state = {
    //   isEditing: false,
    //   posts: [],
    //   totalPosts: 0,
    //   editPost: null,
    //   status: '',
    //   postPage: 1,
    //   postsLoading: true,
    //   editLoading: false
    // };

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
    // const [posts, setPosts] = useState([]);
    // const [totalPosts, setTotalPosts] = useState(0);
    const [editPost, setEditPost] = useState(null);
    // const [status, setStatus] = useState(status);
    const [postPage, setPostPage] = useState(1);
    // const [loading, setloading] = useState(true);
    // const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        console.log('in Component did mount');


        fetchUserStatus();
        loadPosts();
    }, [])



    // componentDidMount() {
    //   console.log('in Component did mount')
    //   fetch('http://localhost:3000/feed/status', {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   })
    //     .then(res => {
    //       if (res.status !== 200) {
    //         throw new Error('Failed to fetch user status.');
    //       }
    //       return res.json();
    //     })
    //     .then(resData => {
    //       setStatus(resData.status)
    //       // this.setState({ status: resData.status });
    //     })
    //     .catch(err => {
    //       catchError(err);
    //     });

    //   loadPosts();
    // }

    function loadPosts(direction) {
        if (direction) {
            // setloading(true);
            // setPosts([]);
            // this.setState({ loading: true, posts: [] });
        }
        let page = postPage;
        if (direction === 'next') {
            page++;
            setPostPage(page)
            // this.setState({ postPage: page });
        }
        if (direction === 'previous') {
            page--;
            setPostPage(page);
            // this.setState({ postPage: page });
        }

        fetchAllPosts(page);

        // fetch('http://localhost:3000/feed/posts?page=' + page, {
        //     headers: {
        //         Authorization: 'Bearer ' + token,
        //     }
        // })
        //     .then(res => {
        //         if (res.status !== 200) {
        //             throw new Error('Failed to fetch posts.');
        //         }
        //         return res.json();
        //     })
        //     .then(resData => {

        //         let fetchedPosts = resData.posts.map(post => {
        //             return {
        //                 ...post,
        //                 imagePath: post.imageUrl,
        //             }
        //         });
        //         setPosts(fetchedPosts);
        //         setTotalPosts(resData.totalItems);
        //         setloading(false);

        //         // this.setState({
        //         //   posts: resData.posts.map(post => {
        //         //     return {
        //         //       ...post,
        //         //       imagePath: post.imageUrl,
        //         //     }
        //         //   }),
        //         //   totalPosts: resData.totalItems,
        //         //   loading: false
        //         // });
        //     })
        //     .catch(err => {
        //         catchError(err)
        //     });
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
        // this.setState({ isEditing: true });
    };

    const startEditPostHandler = postId => {
        const loadedPost = posts.find(p => p._id === postId);
        setIsEditing(true);
        setEditPost(loadedPost);

        // this.setState(prevState => {
        //   const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

        //   return {
        //     isEditing: true,
        //     editPost: loadedPost
        //   };
        // });
    };

    const cancelEditHandler = () => {
        setIsEditing(false);
        setEditPost(null);

        // this.setState({ isEditing: false, editPost: null });
    };

    const finishEditHandler = postData => {
        // setEditLoading(true);

        // this.setState({
        //   editLoading: true
        // });

        // Set up data (with image!)
        const formData = new FormData();
        formData.append('title', postData.title)
        formData.append('content', postData.content)
        formData.append('image', postData.image)

        console.log(formData.get('title'))
        console.log(formData.get('image'))


        if (editPost) {
            handleUpdatePost({ post: formData, postId: editPost._id })
        }
        else {
            addNewPost(formData);

        }




        setIsEditing(false);
        // let url = 'http://localhost:3000/feed/post';
        // let method = 'POST';

        // if (editPost) {
        //     url = `http://localhost:3000/feed/posts/${editPost._id}`;
        //     method = 'PUT';
        // }

        // fetch(url, {
        //     method: method,
        //     body: formData,
        //     headers: {
        //         Authorization: 'Bearer ' + token,
        //     }
        //     // headers: {
        //     //   'Content-Type': 'application/json'
        //     // },
        //     // body: JSON.stringify({
        //     //   title: postData.title,
        //     //   content: postData.content,
        //     //   // creator: postData.creator,
        //     //   // title: postData.title,
        //     // })
        // })
        //     .then(res => {
        //         if (res.status !== 200 && res.status !== 201) {
        //             throw new Error('Creating or editing a post failed!');
        //         }
        //         return res.json();
        //     })
        //     .then(resData => {
        //         const post = {
        //             _id: resData.post._id,
        //             title: resData.post.title,
        //             content: resData.post.content,
        //             creator: resData.post.creator,
        //             createdAt: resData.post.createdAt
        //         };

        //         let updatedPosts = posts;
        //         if (editPost) {
        //             const postIndex = posts.findIndex(
        //                 p => p._id === editPost._id
        //             );
        //             updatedPosts[postIndex] = post;
        //         }
        //         else if (posts.length < 2) {
        //             updatedPosts = posts.concat(post);
        //         }
        //         // setPosts(updatedPosts);
        //         setIsEditing(false);
        //         setEditPost(null);
        //         // setEditLoading(false);

        // this.setState(prevState => {
        //   let updatedPosts = [...prevState.posts];
        //   if (prevState.editPost) {
        //     const postIndex = prevState.posts.findIndex(
        //       p => p._id === prevState.editPost._id
        //     );
        //     updatedPosts[postIndex] = post;
        //   } else if (prevState.posts.length < 2) {
        //     updatedPosts = prevState.posts.concat(post);
        //   }
        //   return {
        //     posts: updatedPosts,
        //     isEditing: false,
        //     editPost: null,
        //     editLoading: false
        //   };
        // });
        //     })
        //     .catch(err => {
        //         console.log(err);

        //         setIsEditing(false);
        //         setEditPost(null);
        //         // setEditLoading(false);
        //         setError(err);


        //         // this.setState({
        //         //     isEditing: false,
        //         //     editPost: null,
        //         //     editLoading: false,
        //         //     error: err
        //         // });
        //     });
    };

    const statusInputChangeHandler = (input, value) => {
        // setStatus(value);
        // this.setState({ status: value });
    };

    const deletePostHandler = postId => {
        deletePost(postId);
    };

    const errorHandler = () => {
        setError(null);
        // this.setState({ error: null });
    };

    const catchError = error => {
        setError(error)
        // this.setState({ error: error });
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
