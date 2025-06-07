import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading } from './slices/userSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList/ArticleList.jsx';
import ArticleDetail from './components/ArticleDetail/ArticleDetail.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
import EditProfile from './components/EditProfile/EditProfile.jsx';
import NewArticle from './components/NewArticle/NewArticle.jsx';
import EditArticle from './components/EditArticle/EditArticle.jsx';
import Layout from './components/Layout.jsx';

const App = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(setLoading(false));
        return;
      }
      try {
        const res = await fetch('https://blog-platform.kata.academy/api/user', {
          headers: { Authorization: `Token ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('USER FROM API:', data.user);
          dispatch(setUser(data.user));
        } else {
          localStorage.removeItem('token');
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout user={user} onLogout={handleLogout} isLoading={isLoading} />}
        >
          <Route index element={<ArticleList />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
