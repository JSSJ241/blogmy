import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewArticle.module.css';

const NewArticle = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    body: '',
    tag: '',
    tagList: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (form.tag.trim() && !form.tagList.includes(form.tag.trim())) {
      setForm({
        ...form,
        tagList: [...form.tagList, form.tag.trim()],
        tag: '',
      });
    }
  };

  const removeTag = (tagToDelete) => {
    setForm({
      ...form,
      tagList: form.tagList.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('https://blog-platform.kata.academy/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        article: {
          title: form.title,
          description: form.description,
          body: form.body,
          tagList: form.tagList,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      navigate(`/articles/${data.article.slug}`);
    } else {
      console.error('Failed to create article');
    }
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create new article</h2>
        <div className={styles.reg}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="description"
              placeholder="Short description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <textarea
              name="body"
              placeholder="Text"
              value={form.body}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tags</label>
            <div className={styles.tags}>
              {form.tagList.map((tag) => (
                <div key={tag} className={styles.tagItem}>
                  <input type="text" value={tag} readOnly className={styles.tagInput} />
                  <button type="button" className={styles.delete} onClick={() => removeTag(tag)}>
                    Delete
                  </button>
                </div>
              ))}

              {/* Блок добавления нового тега — только один, вне .map */}
              <div className={styles.tagItem}>
                <input
                  type="text"
                  name="tag"
                  placeholder="Tag"
                  value={form.tag}
                  onChange={handleChange}
                  className={styles.tagInput}
                />
                <button type="button" onClick={addTag} className={styles.addTagBtn}>
                  Add tag
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className={styles.button}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewArticle;
