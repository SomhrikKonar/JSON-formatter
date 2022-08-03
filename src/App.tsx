import React from "react";
import JsonViewer from "./Components/FormattedJsonViewer/JsonViewer";
import InputField from "./Components/JsonInputField/InputField";
import styles from "./GlobalStyles/app.module.scss";
import Header from "./UtilityComponents/Header/Header";
const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Header title="{JSON Beautifier}" />
      </div>
      <div className={styles.body}>
        <InputField />
        <JsonViewer />
      </div>
    </div>
  );
};

export default App;
