import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Role } from "../models/Role";

export interface AdminPageProps {
    children: React.ReactNode;
}

export default function AdminPage(props: AdminPageProps) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (currentUser) {
        if (currentUser.role_name === Role.USER) {
            navigate("/404");
            return <></>;
        }

        return <>{props.children}</>;
    }

    return <></>;
}
