import { toast } from "react-toastify";
import { Slide } from "react-toastify";

const ReactToastify = (msg, variant) => {
  console.log("toast = ", msg, variant);
  const options = {
    toastId: "pms",
    position: "bottom-right",
    transition: Slide,
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "dark",
  };

  switch (variant) {
    case "error":
      toast.error(msg, options);
      break;

    case "info":
      toast.info(msg, options);
      break;

    case "success":
      toast.success(msg, options);
      break;

    default:
      break;
  }
};

export default ReactToastify;
