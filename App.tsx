import { RouterProvider } from "react-router-dom";

import useRegisterStore from "@/store/useRegisterStore";
import LoadingPage from "@/pages/LoadingPage";
import { RegistrationRoute } from "@/router/RegistrationRoute";

import { useEffect } from "react";
import { NavigationType } from "react-router-dom";

function App() {
  const {
    _hasHydrated,
    contract,
    productSelection,
    currentPath,
    setCurrentPath,
  } = useRegisterStore();

  const { router } = RegistrationRoute({
    contract,
    currentPath,
    productSelection,
  });

  useEffect(() => {
    router.subscribe((state) => {
      if (state.historyAction === NavigationType.Pop) {
        setCurrentPath(state.location.pathname);
      }
    });
  }, []);

  if (!_hasHydrated) return <LoadingPage />;

  return <RouterProvider router={router} />;
}

export default App;
