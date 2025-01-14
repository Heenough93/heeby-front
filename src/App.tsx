import React from "react";
import {AuthProvider} from "./context/AuthContext.tsx";
import {LoadingProvider} from "./context/LoadingContext.tsx";
import MyApp from "./MyApp.tsx";
import "./App.css";

const App: React.FC = () => {
  return (
      <LoadingProvider>
        <AuthProvider>
          <MyApp />
        </AuthProvider>
      </LoadingProvider>
  );
};

export default App;
