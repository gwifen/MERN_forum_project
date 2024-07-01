import axios from "axios"
import React, { useEffect, useState } from "react"
import PostsList from "./PostsList"
import styles from "./styles.module.css"

const Posts = ()=>{

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: "",
        content: ""
    })
    const [editPost, setEditPost] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const handleGetPosts = async () =>{

            try{
                const config = {
                    method: 'get',
                    url:'http://localhost:8080/api/posts/all',
                    headers:{'Content-Type':'application/json'}
                }
                const {data: res} = await axios(config)
                setPosts(res.data)
            }
            catch(error){
                if(error.response && error.response.status >= 400 && error.response.status <= 500){
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }

        

        const handleAddPost = async() =>{
            
            const token = localStorage.getItem("token")

            if(token){
                try{
                    const config = {
                        method: 'post',
                        url: 'http://localhost:8080/api/posts',
                        headers: {'Content-Type': 'application/json', 'x-access-token': token},
                        data: newPost
                    }
    
                    await axios(config)
                    handleGetPosts()
                    setNewPost({title:"", content: ""})
                }catch(error){
                    console.error("Error adding post: ", error)
                }
            }
            
        }

        const handleEditPost = async () => {
            const token = localStorage.getItem("token");
            if(token){
                try{
                    const config = {
                        method: 'put',
                        url: `http://localhost:8080/api/posts/${editPost._id}`,
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        }, 
                        data: editPost
                    }
                    await axios(config)
                    handleGetPosts()
                    setEditPost(null)
                }catch(error){
                    console.error("Error editing post: ", error)
                }
            }
            
        }

        const handleDeletePost = async (postId)=>{
            const token = localStorage.getItem("token");
            if(token){
                try{
                    const config = {
                        method: 'delete',
                        url: `http://localhost:8080/api/posts/${postId}`,
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token':token
                        }
                    }
                    await axios(config)
                    handleGetPosts()
                }catch (error){
                    console.error("Error deleting post: ", error)
                }
            }
            
        }

        const handleGetMyPosts = async () =>{
            try{
                const token = localStorage.getItem("token")
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/posts/my-posts',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }
                const { data: res } = await axios(config)
                setPosts(res)
            }catch(error){
                console.error("Error getting my posts: ", error)
            }
        }

        useEffect(()=>{
            const token = localStorage.getItem("token")
            if(token){
                setIsAuthenticated(true)
            }
            handleGetPosts()
        }, [])

        const handleAccountClick = () =>{
            window.location="/"
        }

        const handleShowAddForm = () =>{
            if(editPost){
                setEditPost(null)
            }else{
                setShowForm(!(showForm))
            }
            
            
        }

        const handleChange = (e) => {
            const { name, value } = e.target;
            if (editPost) {
                setEditPost((prevPost) => ({
                    ...prevPost,
                    [name]: value
                }));
            } else {
                setNewPost((prevPost) => ({
                    ...prevPost,
                    [name]: value
                }));
            }
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            if (editPost) {
                handleEditPost();
            } else {
                handleAddPost();
            }
        };
    
        return(
            <div className={styles.main_container}>
                <h1 className={styles.SiteName}>MySite</h1>
                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={handleGetPosts}>Posts</button>
                    <button className={styles.white_btn} onClick={handleAccountClick}>Account</button>
                </nav>

                {isAuthenticated && (
                    <div className={styles.second_navbar}>
                        <button className={styles.green_btn} onClick={handleGetMyPosts}>My Posts</button>
                        <button className={styles.green_btn} onClick={handleShowAddForm}>+</button>
                    </div>
                )}

                {showForm ? (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="title" 
                            value={editPost ? editPost.title : newPost.title} 
                            onChange={handleChange} 
                            placeholder="Title" 
                            required 
                        />
                        <textarea 
                            name="content" 
                            value={editPost ? editPost.content : newPost.content} 
                            onChange={handleChange} 
                            placeholder="Content" 
                            required 
                        />
                        <button type="submit" className={styles.green_btn}>{editPost ? "Save Changes" : "Add Post"}</button>
                    
                    </form> 
                ) : (
                    <p></p>
                )}

                {posts.length > 0 ? (
                    <PostsList 
                        posts={posts} 
                        onEdit={(post) => {
                            setEditPost(post)
                            setShowForm(true)
                        }} 
                        onDelete={handleDeletePost} 
                    />
                ) : (
                    <p>Brak postow</p>
                )}

            </div>
        )

}

export default Posts
