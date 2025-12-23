import * as React from "react";
import {useEffect, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import ReactGA from "react-ga4";
import {CssBaseline} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {useAppDispatch} from "@store/store";
import {setCurrentUser} from "@store/reducers/auth";
import {authService} from "@app/services/auth";
import {useWebSocket} from "@app/features/ws/hooks";
import {useTheme} from "@app/components/theme";
import DashboardRouter from "@pages/dashboard/Router";
import UserRouter from "@pages/user/Router";
import SettingsRouter from "@pages/settings/Router";
import SystemRouter from "@pages/system/Router";
import ServersRouter from "@pages/servers/Router";
import ZonesRouter from "@pages/zones/Router";
import AuditsRouter from "@pages/audits/Router";

import {Loading} from "@components/Loading";

import "./App.scss";

const {VITE_NODE_ENV} = import.meta.env;

const App = () => {
    const queryClient = new QueryClient();
    const theme = useTheme();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [isAppLoading, setIsAppLoading] = useState(true);
    useWebSocket(queryClient);

    useEffect(() => {
        setIsAppLoading(true);

        const unsubscribe = authService.onAuthStateChanged((user) => {
            if (user) {
                dispatch(setCurrentUser(user));
            } else {
                dispatch(setCurrentUser(null));
            }
            setIsAppLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (location && location.pathname && VITE_NODE_ENV === 'production') {
            ReactGA.send({
                hitType: 'pageview',
                page: location.pathname,
            });
        }
    }, [location]);

    if (isAppLoading) {
        return <Loading/>;
    }

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <CssBaseline/>
                <ThemeProvider theme={theme}>
                    <Routes>
                        <Route path="/*" element={<DashboardRouter basePath=""/>}/>
                        <Route path="/user/*" element={<UserRouter basePath="/user"/>}/>
                        <Route path="/settings/*" element={<SettingsRouter basePath="/settings"/>}/>
                        <Route path="/system/*" element={<SystemRouter basePath="/system"/>}/>
                        <Route path="/servers/*" element={<ServersRouter basePath="/servers"/>}/>
                        <Route path="/zones/*" element={<ZonesRouter basePath="/zones"/>}/>
                        <Route path="/audits/*" element={<AuditsRouter basePath="/audits"/>}/>
                    </Routes>
                    <ToastContainer
                        autoClose={2000}
                        draggable={false}
                        position="top-right"
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnHover
                    />
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
};

export default App;
