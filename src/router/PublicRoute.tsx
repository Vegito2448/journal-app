import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ReactiveSwal } from "../components";
import { useAppSelector } from "../store";
import { mainPath } from "./mainRouter";

interface PublicRouteProps {
  children: JSX.Element;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {

  const navigate = useNavigate();

  const { loading, token, user, error } = useAppSelector(({ auth }) => auth);

  const lastPath = localStorage.getItem('lastPath') || `${mainPath}`;

  useEffect(() => {

    if (!loading && token && user) navigate(`${mainPath}`);

  }, [lastPath, loading, navigate, token, user]);

  useEffect(() => {
    if (error && !loading) {
      ReactiveSwal.fire({
        icon: 'error',
        title: <p>'Oops...'</p>,
        text: typeof error === 'string' ? error : error.message,
      });
    }
  }, [error, loading]);

  return children;
};
