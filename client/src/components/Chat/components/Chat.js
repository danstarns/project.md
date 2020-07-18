import React, { useState, useCallback, useEffect, useRef } from "react";
import "../chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Alert, Spinner } from "react-bootstrap";
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
  const knownHeight = useRef(0);
  const msgPage = useRef(false);
  const chat = useRef(false);

  useEffect(() => {
    let tempActive = false;

    const sub = msgPage.current.addEventListener("scroll", event => {
      if (event.target.scrollTop === 0) {
        if (props.hasNextPage || props.page === 1) {
          if (!props.loading) {
            if (!tempActive) {
              props.loadMore();
              tempActive = true;
            }
          }
        }
      }
    });

    return () => {
      document.removeEventListener("scroll", sub);
    };
  }, [props.loading, props.hasNextPage, props.page, props.loadMore]);

  useEffect(() => {
    if (!props.loading) {
      const recent = props.messages[props.messages.length - 1];

      if (recent.subscription) {
        // don't move the scroll
        // this line is a hack
        // eslint-disable-next-line no-param-reassign
        props.messages[props.messages.length - 1].subscription = false;
      } else if (knownHeight.current > 0) {
        const newHeight = msgPage.current.scrollHeight;
        msgPage.current.scroll({
          top: newHeight - knownHeight.current
        });
      } else {
        chat.current.scrollIntoView();
      }

      knownHeight.current = msgPage.current.scrollHeight;
    }
  }, [props.loading, props.messages]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();

      props.onSubmit({ message });
      setMessage("");
    },
    [message]
  );

  return (
    <div className="chat-box">
      <div className="msg-page" id="msg-page" ref={msgPage}>
        {props.loading && (
          <div className="mx-auto">
            <Spinner className="m-5" animation="border" size="6x" />
          </div>
        )}
        <MessageList messages={props.messages} user={props.user} />
        <div className="chat-box-bottom">
          <div id="end-of-chat" ref={chat} />
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
