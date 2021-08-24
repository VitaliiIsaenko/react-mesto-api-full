import PopupWithForm from "./PopupWithForm";
import React from "react";

export default function AddPlacePopup(props) {
  const [name, setName] = React.useState("");
  const [pictureLink, setPictureLink] = React.useState("");

  function handleAddPlaceSubmit(e) {
    e.preventDefault();

    props.onAddPlace(name, pictureLink);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handlePictureLinkChange(e) {
    setPictureLink(e.target.value);
  }

  React.useEffect(() => {
    setName('');
    setPictureLink('');
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      buttonText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleAddPlaceSubmit}
    >
      <input
        className="form__input form__input_type_card-name"
        name="name"
        id="card-name-input"
        type="text"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span className="form__input-error card-name-input-error"></span>
      <input
        className="form__input form__input_type_picture-link"
        name="link"
        id="link-input"
        type="url"
        placeholder="Ссылка на картинку"
        required
        value={pictureLink}
        onChange={handlePictureLinkChange}
      />
      <span className="form__input-error link-input-error"></span>
    </PopupWithForm>
  );
}
