import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditArticle.module.css';

const EditArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    title: '',
    description: '',
    body: '',
    tagList: [],
  });

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);
        const data = await res.json();
        const { title, description, body, tagList } = data.article;
        setForm({ title, description, body, tagList });
        setTags(tagList || []);
      } catch (err) {
        setError('Ошибка загрузки статьи');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
    setForm((prev) => ({ ...prev, tagList: newTags }));
  };

  const addTag = () => {
    const newTags = [...tags, ''];
    setTags(newTags);
    setForm((prev) => ({ ...prev, tagList: newTags }));
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setForm((prev) => ({ ...prev, tagList: newTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          article: {
            title: form.title,
            description: form.description,
            body: form.body,
            tagList: tags,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.body?.join(', ') || 'Ошибка сохранения');
      }

      navigate(`/articles/${slug}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка статьи...</div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Edit Article</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
        />

        <textarea
          className={styles.text}
          name="body"
          placeholder="Text"
          rows={8}
          value={form.body}
          onChange={handleChange}
        />

        <label className={styles.label}>Tags</label>
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <div className={styles.tagRow} key={index}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className={styles.tagInput}
              />
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => removeTag(index)}
              >
                Delete
              </button>
              {index === tags.length - 1 && (
                <button type="button" className={styles.addButton} onClick={addTag}>
                  Add tag
                </button>
              )}
            </div>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
