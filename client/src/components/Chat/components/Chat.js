import React, { useState, useCallback, useEffect } from "react";
import "../chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { LoadingBanner } from "../../Common/index.js";

function MessageList(props) {
  return props.messages.map(message => {
    const isUser = props.user === message.creator._id;
    let renderName;

    if (isUser) {
      renderName = null;
    } else {
      renderName = (
        <div className="sender-name">{message.creator.username}</div>
      );
    }

    return (
      <div
        key={message._id}
        className="chat-bubble-row"
        style={{ flexDirection: isUser ? "row-reverse" : "row" }}
      >
        {message.creator.profilePic ? (
          <img
            className="avatar"
            src={`data:${message.creator.profilePic.mimetype};base64, ${message.creator.profilePic.data}`}
            alt="Profile Pic"
          />
        ) : (
          <div className="avatar">
            <FontAwesomeIcon icon="user" size="2x" />
          </div>
        )}
        <div className={`chat-bubble ${isUser ? "is-user" : "is-other"}`}>
          {renderName}
          <div style={{ color: isUser ? "#FFF" : "#2D313F" }}>
            <p className="m-0">{message.content}</p>
            <hr />
            <p className="chat-date m-0">
              {moment(message.createdAt).calendar()}
            </p>
          </div>
        </div>
      </div>
    );
  });
}

function Chat(props) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const chat = document.getElementById("end-of-chat");
    chat.scrollIntoView();
  }, [props]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();

      props.onSubmit({ message });
      setMessage("");
    },
    [message]
  );

  if (props.loading) {
    return (
      <div className="loading-messages">
        <LoadingBanner />
      </div>
    );
  }
  return (
    <div className="chat-box">
      <div className="msg-page">
        <MessageList messages={props.messages} user={props.user} />
        <div className="chat-box-bottom">
          <div id="end-of-chat" />
        </div>
      </div>
      <div className="msg-footer">
        <form className="message-form" onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="w-100 p-3"
              placeholder="Type something"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
