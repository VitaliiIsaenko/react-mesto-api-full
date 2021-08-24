import Form from "./Form";
import React from "react";

export default function Register(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();

    props.onRegister(email, password);
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <Form
        name="register"
        title="Регистрация"
        submitClass="form__submit_type_auth"
        buttonText="Зарегестрироваться"
        onSubmit={handleSubmit}
      >
        <input
          className="form__input form__input_type_auth"
          name="email"
          id="login-email-input"
          type="text"
          placeholder="Email"
          minLength="2"
          maxLength="40"
          required
          value={email}
          onChange={handleEmailChange}
        />
        <span className="form__input-error email-input-error"></span>
        <input
          className="form__input form__input_type_auth"
          name="password"
          id="login-password-input"
          type="password"
          placeholder="Пароль"
          minLength="2"
          maxLength="40"
          required
          value={password}
          onChange={handlePasswordChange}
        />
        <span className="form__input-error password-input-error"></span>
      </Form>

      <a className="auth__link" href="/sign-in">
        Уже зарегистрированы? Войти
      </a>
    </div>
  );
}
