import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  return user ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
