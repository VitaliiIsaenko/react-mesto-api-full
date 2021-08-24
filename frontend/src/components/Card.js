import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `pictures__item-remove ${
    !isOwn && "pictures__item-remove_hidden"
  }`;
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `pictures__item-like ${
    isLiked && "pictures__item-like_active"
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleRemoveClick() {
    props.onCardRemove(props.card);
  }

  return (
    <li className="pictures__item">
      <button
        className={cardDeleteButtonClassName}
        type="button"
        onClick={handleRemoveClick}
      ></button>

      <button
        className="pictures__item-photo"
        style={{ backgroundImage: `url(${props.card.link})` }}
        onClick={handleClick}
        type="button"
      ></button>
      <div className="pictures__item-info">
        <h2 className="pictures__item-name">{props.card.name}</h2>
        <div className="pictures__item-like-area">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
          ></button>
          <span className="pictures__item-likes-count">
            {props.card.likes.length}
          </span>
        </div>
      </div>
    </li>
  );
}
