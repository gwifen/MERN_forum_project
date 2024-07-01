import React from "react";
import styles from "./styles.module.css"
import { getUserFromToken } from "./authHelper";

const PostsList = ({ posts, onEdit, onDelete }) => {

  const currentUser = getUserFromToken()

  return (
    <div className={styles.posts_list}>
      {posts.map(post=>(
        <div key={post._id} className={styles.post}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {currentUser && currentUser._id === post.author &&(
            <>
              <button onClick={() => onEdit(post)} className={styles.edit_btn}>Edit</button>
              <button onClick={() => onDelete(post._id)} className={styles.delete_btn}>Delete</button>
            </>
          )}
          
        </div>
      ))}
    </div>
  );
};

export default PostsList;
