import React from "react";
import errorIcon from "../../assets/images/errorIcon.png";
import infoIcon from "../../assets/images/infoIcon.png";
export default function Alert(props) {
  console.log(props);
  return (
    <div
      style={
        props.severity == "error"
          ? {
              position: "relative",
              padding: 18,
              backgroundColor: "rgb(253, 236, 234)",
              width: props.width,
              borderRadius: "8px",
            }
          : props.severity == "info"
          ? {
              position: "relative",
              padding: 18,
              backgroundColor: "rgb(232, 244, 253)",
              width: props.width,
              borderRadius: "8px",
            }
          : null
      }
    >
      <span style={{ position: "absolute", top: 22, left: 56 }}>
        {" "}
        {props.message}
      </span>
      {props.severity == "error" ? (
        <img src={errorIcon} style={{ height: 24, weight: 24 }}></img>
      ) : props.severity == "info" ? (
        <img src={infoIcon} style={{ height: 24, weight: 24 }}></img>
      ) : null}{" "}
    </div>
  );
}
