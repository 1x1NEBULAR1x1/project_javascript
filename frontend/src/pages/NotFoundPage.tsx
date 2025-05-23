import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not_found_container">
      <h2>404</h2>
      <h3>Strona nie znaleziona</h3>
      <p>Żądana strona nie istnieje lub została usunięta.</p>
      <Link to="/" className="btn_primary back_home_btn">
        Wróć do strony głównej
      </Link>
    </div>
  );
};

export default NotFoundPage; 