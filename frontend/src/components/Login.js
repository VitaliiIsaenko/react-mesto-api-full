import Form from "./Form";
import React from "react";
import { useHistory } from "react-router";

export default function Login(props) {
  const history = useHistory();
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

    props.onLogin(email, password);
    history.push("/");
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <Form
        name="login"
        title="Вход"
        submitClass="form__submit_type_auth"
        buttonText="Войти"
        onSubmit={handleSubmit}
      >
        <input
          className="form__input form__input_type_auth"
          name="login"
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
    </div>
  );
}
