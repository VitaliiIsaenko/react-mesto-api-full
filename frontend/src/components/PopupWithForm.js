import Form from "./Form";

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          className="popup__close"
          type="button"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__title">{props.title}</h2>

        <Form
          name={props.name}
          buttonText={props.buttonText}
          onSubmit={props.onSubmit}
        >
          {props.children}
        </Form>
      </div>
    </div>
  );
}

export default PopupWithForm;
