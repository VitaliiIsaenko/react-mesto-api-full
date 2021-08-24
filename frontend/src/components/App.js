import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, useHistory, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import authApi from "../utils/auth-api";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [successTooltip, setSuccessTooltip] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const history = useHistory();

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setIsLoggedIn(false);
      return;
    }

    authApi
      .getCurrentUser(jwt)
      .then((result) => {
        setEmail(result.data.email);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setEmail("");
        setIsLoggedIn(false);
      });
  }, [isLoggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardRemove(card) {
    api
      .removeCard(card._id)
      .then((_) =>
        setCards((state) => state.filter((cards) => cards._id !== card._id))
      )
      .catch((err) => console.log(err));
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleUpdateUser(name, about) {
    api
      .patchUserInfo(name, about)
      .then((data) => {
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchUserAvatar(avatar)
      .then((data) => {
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlace(name, pictureLink) {
    api
      .postCard(name, pictureLink)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleRegister(email, password) {
    if (!email || !password) {
      return;
    }
    authApi
      .signup(email, password)
      .then(() => {
        setSuccessTooltip(true);
      })
      .catch((e) => {
        setSuccessTooltip(false);
      })
      .finally(() => setIsInfoTooltipOpen(true));
  }

  function handleLogin(email, password) {
    if (!email || !password) {
      return;
    }

    authApi
      .signin(email, password)
      .then((data) => {
        setIsLoggedIn(true);
        localStorage.setItem("jwt", data.token);

        history.push("/");
      })
      .catch((e) => {
        setSuccessTooltip(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleSignOut() {
    setEmail("");
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");

    history.push("/sign-in");
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="underlay">
        <div className="page">
          <Switch>
            <Route path="/sign-in">
              <Header>
                <Link to="/sign-up" className="header__link">
                  Зарегестрироваться
                </Link>
              </Header>
              <Login onLogin={handleLogin} />
            </Route>
            <Route path="/sign-up">
              <Header>
                <Link to="/sign-in" className="header__link">
                  Войти
                </Link>
              </Header>
              <Register onRegister={handleRegister} />
            </Route>
            <ProtectedRoute path="/" loggedIn={isLoggedIn}>
              <Header onSignOut={handleSignOut}>
                <p className="header__email">{email}</p>
                <button
                  type="button"
                  className="header__link"
                  onClick={handleSignOut}
                >
                  Выйти
                </button>
              </Header>
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardRemove={handleCardRemove}
              />
              <Footer />
            </ProtectedRoute>
          </Switch>
        </div>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />

        <PopupWithForm
          name="approve"
          title="Вы уверены?"
          buttonText="Да"
          onClose={closeAllPopups}
        ></PopupWithForm>

        <InfoTooltip
          success={successTooltip}
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
        ></InfoTooltip>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
