import { useNavigate as useRouterNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useRouterNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  const goToDisputes = () => {
    navigate("/disputes");
  };

  return { goTo, goBack, goHome, goToDisputes };
};
