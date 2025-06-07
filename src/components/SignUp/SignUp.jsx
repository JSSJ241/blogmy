import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';
import styles from './SignUp.module.css';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (form.password.length < 6 || /[а-яА-ЯЁё]/.test(form.password)) {
      newErrors.password = 'Your password needs to be at least 6 characters and in English';
    }

    if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords must match';
    }

    if (!form.email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch('https://blog-platform.kata.academy/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            username: form.username,
            email: form.email,
            password: form.password,
            image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('USER FROM API:', data.user);
        localStorage.setItem('token', data.user.token);
        dispatch(setUser(data.user));
        navigate('/articles');
      } else {
        const err = await res.json();
        const apiErrors = {};
        for (const key in err.errors) {
          const message = err.errors[key];
          apiErrors[key] = `${key} ${Array.isArray(message) ? message.join(', ') : message}`;
        }
        setErrors(apiErrors);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create new account</h2>
        <div className={styles.reg}>
          {/* поля формы */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? styles.inputError : ''}
            />
            {errors.username && <p className={styles.error}>{errors.username}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirm">Repeat Password</label>
            <input
              type="password"
              name="confirm"
              placeholder="Repeat Password"
              value={form.confirm}
              onChange={handleChange}
              className={errors.confirm ? styles.inputError : ''}
            />
            {errors.confirm && <p className={styles.error}>{errors.confirm}</p>}
          </div>
        </div>

        <label className={styles.agreement}>
          <input type="checkbox" required className={styles.checkbox} />I agree to the processing of
          my personal information
        </label>

        <button type="submit" className={styles.button}>
          Create
        </button>

        <div className={styles.signinBtn}>
          Already have an account?
          <Link to="/sign-in" className={styles.link}>
            {' '}
            Sign In.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
