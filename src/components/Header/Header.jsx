import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar.jsx';
import styles from './Header.module.css';

const Header = ({ user, onLogout }) => {
  console.log('USER IMAGE:', user?.image);
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Realworld Blog
      </Link>

      {user ? (
        <div className={styles.userInfo}>
          <Link to="/new-article" className={styles.article}>
            Create article
          </Link>

          <Link to="/profile" className={styles.profile}>
            <span>{user.username}</span>
            <Avatar src={user.image} className={styles.avatar} />
          </Link>

          <button onClick={onLogout} className={styles.logout}>
            Log Out
          </button>
        </div>
      ) : (
        <nav className={styles.nav}>
          <Link to="/sign-in" className={styles.link}>
            Sign In
          </Link>
          <Link to="/sign-up" className={styles.signup}>
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
