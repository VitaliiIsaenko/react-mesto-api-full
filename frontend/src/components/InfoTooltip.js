import React from "react";
import success from "../images/info-success.svg";
import failure from "../images/info-failure.svg";

export default function InfoTooltip(props) {
  return (
    <>
      <div
        className={`popup popup_type_info-tooltip ${
          props.isOpen ? "popup_opened" : ""
        }`}
      >
        <div className="info-tooltip">
          <button
            className="popup__close"
            type="button"
            onClick={props.onClose}
          ></button>
          <img
            className="info-tooltip__image"
            src={props.success ? success : failure}
            alt={props.success ? "Успех" : "Ошибка"}
          />

          <p className="info-tooltip__message">
            {props.success
              ? "Вы успешно зарегестрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
        </div>
      </div>
    </>
  );
}
