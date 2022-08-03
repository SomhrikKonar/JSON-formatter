import React, { useState } from "react";
import styles from "./styles.module.scss";
import Button from "../../UtilityComponents/Button/Button";
import triangle from "../../Assests/Icons/triangle.svg";
import { useStore } from "../../Store/Store";
import {
  changeInputFormat,
  handleError,
  handleUpdateJson,
} from "../../Store/Reducers/Json";
const InputField: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [state, dispatch] = useStore();

  const handleParse = () => {
    try {
      let inputValue = input.trim();
      dispatch(handleError(""));
      if (state?.inputFormat === "json") {
        if (input.charCodeAt(0) === 34 || input.charCodeAt(0) === 39) {
          inputValue = inputValue.substring(1, inputValue.length - 1);
        }
        let inputJSON: object = JSON.parse(inputValue);
        if (typeof inputJSON === "object") {
          dispatch(handleUpdateJson(inputJSON));
        }
      } else if (state?.inputFormat === "object") {
        if (
          inputValue[0] === "{" &&
          inputValue[inputValue.length - 1] === "}"
        ) {
          inputValue = commaAdder(inputValue.replaceAll("\n", ""));
          console.log(inputValue);

          let obj = ObjectParse(inputValue);
          if (obj) dispatch(handleUpdateJson(JSON.parse(JSON.stringify(obj))));
        }
      } else {
        throw new EvalError("Please Refresh the page");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch(handleError({ err }.err.message));
      }
    }
  };

  const ObjectParse = (str: string) => {
    try {
      let obj = str.substring(1, str.length - 1);
      let newObj: object = {};
      let key: string = "";
      let val: string = "";
      let openBrace: number = 0;
      let openArray: number = 0;
      for (let i = 0; i < obj.length; i++) {
        if (
          obj[i] === "," &&
          key.indexOf(":") > 0 &&
          openBrace === 0 &&
          openArray === 0
        ) {
          newObj = {
            ...newObj,
            [key.substring(0, key.length - 1).trim()]:
              val[0] == `"` && val[val.length - 1] == `"`
                ? val.substring(1, val.length - 1).trim()
                : val,
          };
          key = "";
          val = "";
        } else if (
          obj[i] !== "{" &&
          obj[i] !== "}" &&
          obj[i] !== "[" &&
          obj[i] !== "]"
        ) {
          if (key[key.length - 1] !== ":") key += obj[i];
          else if (obj[i] !== "") val += obj[i];
        } else if (obj[i] === "{") {
          openBrace++;
          val += obj[i];
        } else if (obj[i] === "}") {
          openBrace = openBrace - 1;
          if (openBrace > 0) {
            val += obj[i];
          } else if (openBrace === 0) {
            val += obj[i];
            if (openArray === 0) {
              if (val[val.length - 2] !== ",") {
                val = val.substring(0, val.length - 1) + ",}";
              }
              newObj = {
                ...newObj,
                [key.substring(0, key.length - 1).trim()]: ObjectParse(val),
              };
              key = "";
              val = "";
            }
          } else if (openBrace < 0) {
            throw new SyntaxError("Invalid Object");
          }
        } else if (obj[i] === "[") {
          openArray++;
          val += obj[i];
        } else if (obj[i] === "]") {
          openArray--;
          if (openArray > 0) {
            val += obj[i];
          } else if (openArray === 0) {
            val += obj[i];
            if (openBrace === 0) {
              val = val.substring(1, val.length - 1);
              let listElements: string[] = parseArray(val);
              let newArrayObj: (object | string)[] = [];
              listElements.map((ele) => {
                if (ele.indexOf("{") === 0 && ele[ele.length - 1] === "}") {
                  let parsedObj: {} | undefined = ObjectParse(ele);
                  if (parsedObj) newArrayObj.push(parsedObj);
                } else if (
                  ele.indexOf("[") === 0 &&
                  ele[ele.length - 1] === "]"
                ) {
                  let parsedObj: { value?: [] } | undefined = ObjectParse(
                    "{value:" + ele + "}"
                  );
                  if (parsedObj?.value) newArrayObj.push(parsedObj.value);
                } else {
                  newArrayObj.push(ele.trim().substring(0, ele.trim().length));
                }
              });
              newObj = {
                ...newObj,
                [key.substring(0, key.length - 1).trim()]: newArrayObj,
              };
              key = "";
              val = "";
            }
          } else if (openArray < 0) {
            throw new SyntaxError("Invalid Object");
          }
        }
      }
      if (openArray !== 0 || openBrace !== 0)
        throw new SyntaxError("Invalid Object");
      return newObj;
    } catch (err) {
      if (err instanceof Error) {
        let msg: string = { err }.err.message;
        dispatch(handleError(msg));
      }
    }
  };

  const parseArray = (str: string) => {
    let newList: string[] = [];
    let bracesOpen: number = 0;
    let arrayOpen: number = 0;
    let val: string = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ",") {
        if (arrayOpen == 0 && bracesOpen == 0) {
          if (val.indexOf(`"`) === 0) val = val.substring(1, val.length - 1);
          if (val) newList.push(val);
          val = "";
        } else {
          val += str[i];
        }
      } else {
        if (str[i] === "[") arrayOpen++;
        else if (str[i] === "]") arrayOpen--;
        else if (str[i] === "{") bracesOpen++;
        else if (str[i] === "}") bracesOpen--;
        if (arrayOpen < 0 || bracesOpen < 0)
          throw new SyntaxError("Invalid Object");
        val += str[i];
      }
    }
    if (arrayOpen !== 0 || bracesOpen !== 0)
      throw new SyntaxError("Invalid Object");
    return newList;
  };

  const commaAdder = (str: string) => {
    let newStr: string = "";
    for (let i = 0; i < str.length; i++) {
      if ((str[i] === "}" || str[i] === "]") && str[i - 1] !== ",") {
        newStr += "," + str[i];
      } else if (str[i] !== "") {
        newStr += str[i];
      }
    }
    return newStr;
  };

  return (
    <div className={styles.container}>
      <Button
        classes="parseJsonBtn"
        onClickHandler={handleParse}
        icon={triangle}
      />
      <div className={styles.inputFormatContainer}>
        <span>Input Format:</span>
        <select
          className={styles.selectField}
          value={state?.inputFormat}
          onChange={(e) => dispatch(changeInputFormat(e.target.value))}
        >
          <option value="object">JS-Object</option>
          <option value="json">JSON</option>
        </select>
      </div>
      <textarea
        placeholder="Enter JSON here to format"
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default InputField;
