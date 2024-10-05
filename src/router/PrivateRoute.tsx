import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ReactiveSwal } from "../components";
import { useAppSelector } from "../store";
import { mainPath } from "./mainRouter";

interface PrivateRouteProps {
  children: JSX.Element;
}



export const PrivateRoute = ({ children }: PrivateRouteProps) => {

  const { user, token, loading, error } = useAppSelector(({ auth }) => auth);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastPath', location.pathname);

    if (!loading && !(user && token)) {
      navigate(`${mainPath}auth/login`, { replace: true });
      ReactiveSwal.close();
    }

  }, [loading, location.pathname, navigate, token, user]);


  useEffect(() => {
    if (error && !loading) {
      ReactiveSwal.fire({
        icon: 'error',
        title: <p>'Oops...'</p>,
        text: typeof error === 'string' ? error : error.message,
      });
    }
  }, [error, loading]);


  return user?.uid ? children : <Navigate
    to={`${mainPath}auth/login`}
    replace
  />;
};
