import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * /admin/cms/home — redirects to /admin/cms
 * The main CMS page already handles the home tab by default.
 */
export default function AdminCMSHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/cms", { replace: true });
  }, [navigate]);

  return null;
}
