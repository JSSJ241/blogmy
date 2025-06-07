import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './ArticleDetail.module.css';
import Avatar from '../Avatar/Avatar.jsx';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        console.error('Ошибка загрузки статьи', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        navigate('/articles');
      } else {
        alert('Failed to delete the article');
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!article) return <div className={styles.error}>Статья не найдена</div>;

  const isAuthor = user?.username === article.author.username;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.tags}>
            {article.tagList.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>Автор: {article.author.username}</span>
            <span className={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</span>

            {isAuthor && (
              <div className={styles.actions}>
                <Link to={`/articles/${article.slug}/edit`} className={styles.editBtn}>
                  Edit
                </Link>
                <button onClick={handleDeleteClick} className={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <Avatar
            src={article.author.username === user?.username ? user?.image : article.author.image}
            className={styles.avatar}
          />
        </div>
      </div>

      <p className={styles.description}>{article.description}</p>

      <ReactMarkdown
        components={{
          p: ({ ...props }) => <p className={styles.markdown} {...props} />,
        }}
      >
        {article.body}
      </ReactMarkdown>

      {showConfirm && (
        <div className={styles.confirmPopup}>
          <p>Are you sure you want to delete this article?</p>
          <div className={styles.confirmButtons}>
            <button onClick={cancelDelete}>No</button>
            <button onClick={confirmDelete}>Yes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
