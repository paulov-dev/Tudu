import React from "react";
import "./LoginTitleImagem.css";

function LoginTitleImagem() {
  return (
    <div>
      <div className="LoginTitleImagem">
        <img
          src={"src/assets/icons/logo-google.png"}
          className="logoImgGoogle"
        />
        &nbsp;&nbsp;&nbsp;
        <img
          src={"src/assets/icons/logo-apple.png"}
          className="logoImgApple"
        />{" "}
        &nbsp;&nbsp;
        <img
          src={"src/assets/icons/logo-microsoft.png"}
          className="logoImgMicrosoft"
        />
        &nbsp;
      </div>
    </div>
  );
}

export default LoginTitleImagem;
