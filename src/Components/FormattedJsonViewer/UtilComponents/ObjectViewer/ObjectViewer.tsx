import React from "react";
import styles from "./styles.module.scss";
import { ReactComponent as Triangle } from "../../../../Assests/Icons/triangle.svg";
import { useStore } from "../../../../Store/Store";
import { handleHideObjectIndex } from "../../../../Store/Reducers/Json";
interface Props {
  data: object;
  index: number;
}
const ObjectViewer: React.FC<Props> = ({ data, index }) => {
  const [state, dispatch] = useStore();

  const handleHideObject = (n: number) => {
    if (state?.hideObjectIndex) {
      let nExists = state?.hideObjectIndex.find((ele) => ele === n);
      let newArr = [];
      if (nExists) {
        newArr = state?.hideObjectIndex.filter((ele) => ele !== n);
      } else {
        newArr = [...state?.hideObjectIndex, n];
      }
      dispatch(handleHideObjectIndex(newArr));
    } else {
      dispatch(handleHideObjectIndex([n]));
    }
  };

  const isObjectHidden = (n: number) => {
    let objectHidden = state?.hideObjectIndex.find((ele) => ele === n);
    if (objectHidden !== undefined) return true;
    else return false;
  };

  function removeComma(str: string) {
    return str.replaceAll(",", "").replaceAll("/n", "");
  }

  let emptyObject: Boolean = Object.keys(data).length <= 0;

  return (
    <div
      className={`${styles.objectContainer} ${
        emptyObject ? styles.flexObjectContainer : ""
      }`}
    >
      <div
        className={`${styles.paranthesis} ${
          emptyObject ? styles.emptyObjectParanthesis : ""
        }`}
      >
        {Array.isArray(data) ? "[" : "{"}
      </div>
      {Object.entries(data).map(([k, v], i) => (
        <div
          key={i}
          className={`${styles.line} ${
            styles[
              typeof v === "object" &&
              !isObjectHidden(index + i + 1) &&
              Object.keys(v).length > 0
                ? "blockLine"
                : "flexLine"
            ]
          }`}
        >
          <div className={styles.key}>
            {typeof v === "object" && Object.keys(v).length > 0 && (
              <Triangle
                fill="#111"
                height={9}
                width={9}
                className={styles.objectHider}
                style={{
                  transform: `rotate(${
                    isObjectHidden(index + i + 1) ? "60deg" : "30deg"
                  })`,
                }}
                onClick={() => handleHideObject(index + i + 1)}
              />
            )}
            {removeComma(k)}:
          </div>
          <div className={styles.value}>
            {typeof v === "object" ? (
              !isObjectHidden(index + i + 1) ? (
                <ObjectViewer data={v} index={index + i + 1} />
              ) : Array.isArray(v) ? (
                "[<-->]"
              ) : (
                "{<-->}"
              )
            ) : (
              v + ","
            )}
          </div>
        </div>
      ))}
      <div
        className={`${styles.paranthesis} ${
          emptyObject ? styles.emptyObjectParanthesis : ""
        }`}
      >
        {Array.isArray(data) ? "]" : "}"}
      </div>
    </div>
  );
};

export default ObjectViewer;
