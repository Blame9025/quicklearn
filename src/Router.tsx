import {useState, useEffect} from 'react';
import {LoadingOverlay} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider, Navigate, BrowserRouter,Route ,Routes, Outlet} from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Auth } from './pages/Auth.page';
import { NotFound } from './pages/NotFound.page';
import axiosHandler from './axios';


function PrivateRoutes() {
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  const key = sessionStorage.getItem("token");

  useEffect(() => {
    axiosHandler.post('/api/auth/verify', {
      token: key
    }).then((response) => {
      setAuth(Boolean(response.data.code === "success")); 
      setLoading(false);
      if(response.data.code != "success"){
        notifications.show({
          title: t("router_"+response.data.code+"_title"),
          message: t("router_"+response.data.code+"_content"),
          color: "red",
        });
        sessionStorage.removeItem("token");
      }


    })
  }, []);

  if (isLoading) return <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />; // Return null while loading

  return isAuth ? <Outlet /> : <Navigate to="/auth" />;
}
export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Auth />} path="/auth"></Route>
        <Route element={<NotFound />} path="*"></Route>
        <Route element={<PrivateRoutes />}>
          <Route element={<HomePage />} path="/"></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
