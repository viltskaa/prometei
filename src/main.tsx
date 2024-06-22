import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {UserDto} from "./api/Types/types.ts";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage.tsx";
import SearchResult from "./components/SearchResult/SearchResult.tsx";
import Profile from "./components/Profile/Profile.tsx";
import PasswordEdit from "./components/PasswordEdit/PasswordEdit.tsx";
import PaymentConfirm from "./components/PaymentConfirm/PaymentConfirm.tsx";
import TicketReturnPage from "./components/TicketReturnPage/TicketReturnPage.tsx";

interface UserContextType {
    user: UserDto | null;
    setUser: (value: UserDto | null) => void;
    jwt: string | null;
    setJwt: (token: string) => void;
    city: string | null;
    setCity: (value: string) => void;
    notification: React.ReactNode | null;
    setNotification: (message: React.ReactNode) => void;
}

interface ThemeContextType {
    theme: 'light' | 'dark';
    setTheme: (value: 'light' | 'dark') => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
    theme: 'light',
    setTheme: (value: 'light' | 'dark') => console.log(value),
});

export const UserContext = React.createContext<UserContextType>({
    user: null,
    setUser: (value: UserDto | null) => console.log(value),
    jwt: null,
    setJwt: (token: string) => console.log(token),
    city: null,
    setCity: (value: string) => console.log(value),
    notification: null,
    setNotification: (message: React.ReactNode) => console.log(message),
})

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <MainPage/>,
            },
            {
                path: "/search",
                element: <SearchResult/>,
            },
            {
                path: "/profile",
                element: <Profile/>,
            },
            {
                path: "/editPassword",
                element: <PasswordEdit/>
            },
            {
                path: "/return",
                element: <TicketReturnPage/>
            }
        ]
    },
    {
        path: "confirmPay",
        element: <PaymentConfirm/>
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)
