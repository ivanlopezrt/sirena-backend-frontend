import BackButton from "../components/Common/BackButton";

export default function Contact() {
    return (
        <div className="">
            <BackButton to="/public/auth/login" className="fs-1" />
            <h1>Contacto</h1>
            <p>Puedes contactar con nosotros en:</p>
        </div>
    );
}
