import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      {label}
    </button>
  );
};

export default BackButton;
