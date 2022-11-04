import React, { useRef } from "react";
import { useStore } from "../../Store/Store";
import styles from "./styles.module.scss";
import ObjectViewer from "./UtilComponents/ObjectViewer/ObjectViewer";
import download from "../../Assests/Icons/download.svg";
import Button from "../../UtilityComponents/Button/Button";
const JsonViewer: React.FC = () => {
  const [state] = useStore();
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const handleClick = () => {
    if (state?.json && Object.keys(state.json).length > 0 && linkRef.current) {
      let contentType: string = "plain/text";
      let content: string = JSON.stringify(state.json);
      content = content.replaceAll("\n", "");
      let fileName: string = "yourJson.json";
      let newBlob: Blob | undefined = new Blob([content], {
        type: contentType,
      });
      let url = URL.createObjectURL(newBlob);
      linkRef.current.href = url;
      linkRef.current.download = fileName;
      linkRef.current.click();
    }
  };

  return (
    <div className={styles.container}>
      <a ref={linkRef} />
      <Button
        icon={download}
        classes="downloadBtn"
        onClickHandler={handleClick}
      />
      <div className={styles.formattedCodeContainer}>
        {state?.error ? (
          state.error
        ) : !state?.json || Object.keys(state?.json).length <= 0 ? (
          "// formatted json"
        ) : (
          <ObjectViewer data={state?.json} index={""} />
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
