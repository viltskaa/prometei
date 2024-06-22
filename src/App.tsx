import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'

import React, {useEffect, useState} from "react";
import BaseLayout from "./components/BaseLayout/BaseLayout.tsx";
import {ConfigProvider} from "antd";
import {ThemeContext, UserContext} from "./main.tsx";
import {theme as THEME} from "antd";
import {UserDto} from "./api/Types/types.ts";
import locale from 'antd/locale/ru_RU';

const loadContext = () => {
    const value = localStorage.getItem('theme')
    return value as "light" | "dark" ?? 'light'
}

const loadJwt = () => {
    const jwt = localStorage.getItem('jwt')
    const expired = localStorage.getItem('expired')
    if (expired && +expired > Date.now()) {
        return jwt
    }
    return null;
}
const loadCity = () => localStorage.getItem('city')

function App(): React.ReactElement {
    const [theme, setTheme] = useState<'light' | 'dark'>(loadContext);
    const value = {theme, setTheme}

    const [user, setUser] = useState<UserDto | null>(null);
    const [jwt, setJwt] = useState<string | null>(loadJwt());
    const [city, setCity] = useState<string | null>(loadCity());
    const [notification, setNotification] = useState<React.ReactNode>(null);

    const userContext = {user, setUser, jwt, setJwt, city, setCity, notification, setNotification};

    useEffect(() => {
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }, [notification]);

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        if (jwt !== null) {
            localStorage.setItem('jwt', jwt);
            localStorage.setItem('expired', (Date.now() + 100000 * 60 * 24).toString())
        }
    }, [jwt]);

    useEffect(() => {
        city && localStorage.setItem('city', city);
    })

    return (
        <ThemeContext.Provider value={value}>
            <UserContext.Provider value={userContext}>
                <ConfigProvider theme={{
                    algorithm: theme === 'light' ? THEME.defaultAlgorithm : THEME.darkAlgorithm
                }} locale={locale}>
                    <BaseLayout/>
                </ConfigProvider>
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App
