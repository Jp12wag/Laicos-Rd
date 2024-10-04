import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);

  // Función para obtener las publicaciones del feed
  const obtenerPosts = async () => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.get('http://localhost:3001/api/post/feed', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.delete(`http://localhost:3001/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId)); // Actualiza el estado para eliminar la publicación de la interfaz
    } catch (error) {
      console.error('Error al borrar la publicación:', error);
    }
  };

  const darLike = async (postId) => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.post(`http://localhost:3001/api/post/like/${postId}`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
       // Cambiar el estado de like del post
       if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    } catch (error) {
      console.error('Error al dar like a la publicación:', error);
    }
  };

  // Función para crear una nueva publicación
  const crearPost = async () => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.post('http://localhost:3001/api/post', {
        content: newPostContent,
        media: newPostMedia,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setNewPostContent('');
      setNewPostMedia('');
      obtenerPosts(); // Actualizar el feed después de crear una publicación
    } catch (error) {
      console.error('Error al crear la publicación:', error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.post(`http://localhost:3001/api/post/comentar/${postId}`, { comment: newComment }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Actualiza el estado para incluir el nuevo comentario
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
           
          return {
            ...post,
            comments: [...post.comments, { comment: newComment, AdminId: { nombre: post.AdminId.nombre, apellido: post.AdminId.apellido } }], // Asegúrate de reemplazar esto con los datos del usuario correcto
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewComment(''); // Limpia el campo de comentario
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  // Función para habilitar la edición de un post
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditingContent(post.content);
  };

  // Función para guardar los cambios de un post editado
  const saveEdit = async (postId) => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.put(`http://localhost:3001/api/post/${postId}`, { content: editingContent }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPosts(posts.map(post => (post._id === postId ? { ...post, content: editingContent } : post)));
      setEditingPostId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error al editar la publicación:', error);
    }
  };

  useEffect(() => {
    obtenerPosts();
  }, []);

  return (
    <div className="feed">
      <h2>Feed de Publicaciones</h2>

      <div className="new-post">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
        />
        <input
          type="text"
          value={newPostMedia}
          onChange={(e) => setNewPostMedia(e.target.value)}
          placeholder="URL de la imagen o video"
        />
        <button onClick={crearPost}>Publicar</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h3>
              {post.AdminId.nombre} {post.AdminId.apellido}
            </h3>
            {editingPostId === post._id ? (
              <>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button onClick={() => saveEdit(post._id)}>Guardar</button>
              </>
            ) : (
              <>
                <p>{post.content}</p>
                {post.media && <img src={post.media} alt="Post media" />}
                <div className="post-footer">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <button
                    style={{
                      backgroundColor: likedPosts.includes(post._id) ? 'blue' : 'gray',
                      color: 'white',
                    }}
                    onClick={() => darLike(post._id)}
                  >
                    Like
                  </button>
                  {post.AdminId._id === Cookies.get('IdUser') && (
                    <button onClick={() => handleDelete(post._id)}>Borrar</button>
                  )}
                  <button onClick={() => handleEdit(post)}>Editar</button>
                </div>
              </>
            )}
            <div>
              <h4>Comentarios:</h4>
              {post.comments.map((comment, index) => (
                
                <p key={index}>
                  {comment.comment} - {comment.AdminId.nombre} {comment.AdminId.apellido}
                </p>
              ))}
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario"
                />
                <button onClick={() => handleCommentSubmit(post._id)}>Comentar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
