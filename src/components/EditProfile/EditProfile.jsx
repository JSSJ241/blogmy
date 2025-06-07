import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';

const EditProfile = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://blog-platform.kata.academy/api/user', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setForm({
          username: data.user.username || '',
          email: data.user.email || '',
          image: data.user.image || '',
          password: '',
        });
      } catch {
        setErrors({ general: 'Ошибка загрузки данных профиля' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          user: {
            username: form.username,
            email: form.email,
            password: form.password || undefined,
            image: form.image,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const newErrors = {};
        for (const key in data.errors) {
          newErrors[key] = `${key} ${data.errors[key].join(', ')}`;
        }
        return setErrors(newErrors);
      }

      navigate('/articles');
    } catch {
      setErrors({ general: 'Ошибка обновления профиля' });
    }
  };

  if (loading) return <div className="text-center mt-10">Загрузка профиля...</div>;

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Edit Profile</h2>
        <div className={styles.reg}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <p className={styles.error}>{errors.username}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="image"
              placeholder="Avatar image (url)"
              value={form.image}
              onChange={handleChange}
            />
            {errors.image && <p className={styles.error}>{errors.image}</p>}
          </div>

          {errors.general && <p className={styles.error}>{errors.general}</p>}

          <button type="submit" className={styles.button}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
