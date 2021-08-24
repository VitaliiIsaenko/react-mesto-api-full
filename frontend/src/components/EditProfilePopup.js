import PopupWithForm from "./PopupWithForm";
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser === null ? "" : currentUser.name);
    setDescription(currentUser === null ? "" : currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser(name, description);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="form__input form__input_type_profile-name"
        name="name"
        id="profile-name-input"
        type="text"
        placeholder="Введите имя"
        minLength="2"
        maxLength="40"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span className="form__input-error profile-name-input-error"></span>
      <input
        className="form__input form__input_type_about"
        name="about"
        id="about-input"
        type="text"
        placeholder="Введите информацию о себе"
        required
        value={description}
        onChange={handleDescriptionChange}
      />
      <span className="form__input-error about-input-error"></span>
    </PopupWithForm>
  );
}
