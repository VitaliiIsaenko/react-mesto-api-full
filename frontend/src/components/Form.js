export default function Form(props) {
  return (
    <form className="form" name={props.name} onSubmit={props.onSubmit}>
      {props.children}

      <button
        className={`form__submit ${props.submitClass ? props.submitClass : ""}`}
        type="submit"
      >
        {props.buttonText}
      </button>
    </form>
  );
}
