import { useState, useEffect } from "react";
import api from "../utils/api";

export const useEnabledComponents = (userId) => {
  const [enabledComponents, setEnabledComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnabledComponents = async () => {
      try {
        const response = await api.get(
          `/api/dashboard-management/${userId}/enabled-components`
        );
        setEnabledComponents(response.data.enabledComponents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching enabled components:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchEnabledComponents();
    }
  }, [userId]);

  const canShowComponent = (componentKey) => {
    // If enabledComponents is empty, dont show any component
    if (!Array.isArray(enabledComponents) || enabledComponents.length === 0) {
      return false;
    }
    return enabledComponents.includes(componentKey);
  };

  return { enabledComponents, loading, error, canShowComponent };
};
