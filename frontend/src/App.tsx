import { useEffect } from "react";

import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import Chat from "./pages/Chat";
import OTPPage from "./pages/OTPPage";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Codes from "./pages/Codes";
import NotFoundPage from "./pages/NotFound";
import Hospitals from "./pages/Hospitals";
import Users from "./pages/Users";
import toast from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import AdminPage from "./pages/AdminPage";
import { MenuDrawerProvider } from "./context/MenuDrawerContext";

function App() {
    const queryClient = new QueryClient();

    useEffect(() => {
        window.onerror = (message, source, lineno, colno, error) => {
            console.error(
                "Error global capturado:",
                message,
                source,
                lineno,
                colno,
                error
            );
            toast.error(message.toString());
        };

        window.onunhandledrejection = (event) => {
            toast.error(event.reason);
            console.error("Rechazo de promesa no manejado:", event.reason);
        };

        return () => {
            window.onerror = null; // Limpia el manejador al desmontar
            window.onunhandledrejection = null;
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/public" element={<PublicLayout />}>
                            <Route path="auth/login" element={<LoginPage />} />
                            <Route path="auth/otp" element={<OTPPage />} />
                            <Route path="contact" element={<Contact />} />
                        </Route>

                        <Route
                            path="/"
                            element={
                                <MenuDrawerProvider>
                                    <PrivateLayout />
                                </MenuDrawerProvider>
                            }
                        >
                            <Route path="" element={<Dashboard />} />
                            <Route
                                path="hospitals"
                                element={
                                    <AdminPage>
                                        <Hospitals />
                                    </AdminPage>
                                }
                            />
                            <Route
                                path="codes"
                                element={
                                    <AdminPage>
                                        <Codes />
                                    </AdminPage>
                                }
                            />
                            <Route path="chat" element={<Chat />} />
                            <Route
                                path="users"
                                element={
                                    <AdminPage>
                                        <Users />
                                    </AdminPage>
                                }
                            />
                        </Route>

                        <Route path="*" element={<PublicLayout />}>
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
