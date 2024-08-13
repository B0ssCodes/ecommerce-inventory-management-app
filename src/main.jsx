import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme, Switch } from "antd";
import App from "./App";
import useDarkMode from "./components/layout/useDarkMode";

const Main = () => {
  const [isDarkMode, toggleTheme] = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "10px" }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
          <App isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </div>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <Main />
  //</React.StrictMode>
);
