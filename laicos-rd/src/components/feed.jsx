import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/feed.css';
import io from 'socket.io-client';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faComments, faTrash, faThumbsUp} from '@fortawesome/free-solid-svg-icons';


const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  withCredentials: true,
});

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (postId) => {
    try {
      const authToken = Cookies.get('authToken');
      await axios.delete(`http://localhost:3001/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
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
      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    } catch (error) {
      console.error('Error al dar like a la publicación:', error);
    }
  };

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
      obtenerPosts();
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

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, { comment: newComment, AdminId: { nombre: post.AdminId.nombre, apellido: post.AdminId.apellido } }],
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewComment('');
      closeModal();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditingContent(post.content);
  };


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
   
    socket.on('connect', () => {
      console.log('Conectado al servidor con socket ID:', socket.id);
    });

    socket.on('nuevaPublicacion', (nuevaPublicacion) => {
      console.log('Nueva publicación recibida:', nuevaPublicacion);
      setPosts((prevPosts) => [nuevaPublicacion, ...prevPosts]); // Agrega la nueva publicación al principio del feed
    });
    obtenerPosts();
    return () => {
      socket.off('nuevaPublicacion');
    };
  }, []);

  return (
    <div className="feed">
      <div className="new-post">
        <input className='inputpost'
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
        />
        <input className='inputpost'
          type="text"
          value={newPostMedia}
          onChange={(e) => setNewPostMedia(e.target.value)}
          placeholder="URL de la imagen o video"
        />
        <button className='btnpost' onClick={crearPost}>Publicar</button>
      </div>


      <div className="posts">
        {posts.map((post) => (
          <div key={post._id ? `${post._id}`: 'sin id'} className="post">


            <div className='cabecera'>
              <h3 className="cabeceraPost">
              {post.AdminId ? `${post.AdminId.nombre} ${post.AdminId.apellido}` : 'Usuario desconocido'}
              </h3>
              <span className='cabeceraFecha'>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            {editingPostId === post._id ? (
              <div className="cabeceraPost">
                <input className='inputpost'
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button className='btnpost' onClick={() => saveEdit(post._id)}>Guardar</button>
              </div>
            ) : (
              <div className="post">
                <p className='postContent'>{post.content}</p>
                {post.media && <img src={post.media} alt="Post media" className="postmedia" />}
                <div className="post-footer">
                  <FontAwesomeIcon icon={faThumbsUp} onClick={() => darLike(post._id)} className='btnposts' />
                  {post.AdminId._id === Cookies.get('IdUser') && (
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(post._id)} className='btnposts' />
                  )}
                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(post)} className='btnposts' />
                  <FontAwesomeIcon icon={faComments} onClick={() => openModal(post)} className='btnposts' />

                </div>
              </div>
            )}
          </div>
        ))}
      </div>


      {/* Modal de comentarios */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-overlay modal-content" >
        {selectedPost && (
          <>
            <h3>Comentarios en la publicación de {selectedPost.AdminId.nombre} {selectedPost.AdminId.apellido}</h3>
            <p>{selectedPost.content}</p>
            {selectedPost.media && <img src={selectedPost.media} alt="Post media" />}

            <div>
              <h4>Comentarios:</h4>
              {selectedPost.comments.map((comment, index) => (
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
                <button onClick={() => handleCommentSubmit(selectedPost._id)}>Comentar</button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>

  );
};

export default Feed;
