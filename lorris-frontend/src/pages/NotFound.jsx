import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div style={{ padding: 40 }}>
            <h1>404</h1>

            <Link to="/">Go Home</Link>
        </div>
    );
}