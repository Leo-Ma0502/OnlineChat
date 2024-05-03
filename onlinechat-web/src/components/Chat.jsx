import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContextProvider";
import { getUserlist } from "../service/api";
import { getChatStyle } from "../styles/chatStyle";
import { useMediaQuery } from "react-responsive";

export default function Chat() {
  const { username, socketClient, messagePool } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState(JSON.parse(messagePool));
  const [userSelected, setUserSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const [isChatAreaVisible, setIsChatAreaVisible] = useState(false);
  const [chatStyle, setChatStyle] = useState(null);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await getUserlist();
        setUsers(Array.from(res.data));
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();

    if (socketClient) {
      socketClient.emit("login", { name: username });
      socketClient.on("message", (data) => {
        setTimeout(() => {
          setMessages([...messages, data]);
        }, 100);
      });
    }
    localStorage.setItem("msgs", JSON.stringify(messages));
  }, [messages, socketClient, username]);

  useEffect(() => {
    setChatStyle(getChatStyle(isChatAreaVisible, isTabletOrMobile));
  }, [isChatAreaVisible, isTabletOrMobile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userSelected) {
      setTimeout(() => {
        try {
          setMessages([
            ...messages,
            { body: msg, from: username, to: userSelected },
          ]);
          socketClient.emit("onMessage", {
            body: msg,
            from: username,
            to: userSelected,
          });
          setMsg("");
        } catch (e) {
          alert(e);
        }
      }, 1000);
    } else {
      alert("No user selected!");
    }
  };

  const handleCloseChatArea = () => {
    setIsChatAreaVisible(false);
    setUserSelected(null);
  };

  const handleUserClick = (username) => {
    setUserSelected(username);
    setIsChatAreaVisible(true);
  };

  return (
    chatStyle && (
      <div style={chatStyle.container} id="chat-component">
        <div id="userlist" style={chatStyle.userList}>
          <strong>Select a user to send message</strong>
          {users.length !== 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {users
                .filter((i) => i.username !== username)
                .map((i, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleUserClick(i.username)}
                      onDoubleClick={() => setUserSelected(null)}
                      style={
                        i.username === userSelected
                          ? {
                              ...chatStyle.userButton,
                              ...chatStyle.selectedButton,
                            }
                          : chatStyle.userButton
                      }
                    >
                      {i.username}
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <>
              <br />
              No users yet ...
            </>
          )}
        </div>
        {isChatAreaVisible && (
          <div style={chatStyle.chatArea}>
            <strong>Messages with {userSelected}</strong>
            <button style={chatStyle.closeButton} onClick={handleCloseChatArea}>
              Close
            </button>
            <div style={chatStyle.messageHistory}>
              {messages?.length !== 0 ? (
                messages
                  .filter(
                    (i) =>
                      (i.from === username && i.to === userSelected) ||
                      (i.from === userSelected && i.to === username)
                  )
                  .map((msg, index) => (
                    <p
                      key={index}
                      style={
                        msg.from === username
                          ? { ...chatStyle.message, ...chatStyle.sentMessage }
                          : {
                              ...chatStyle.message,
                              ...chatStyle.receivedMessage,
                            }
                      }
                    >
                      <strong>{msg?.from}</strong>:<br />
                      {msg?.body}
                    </p>
                  ))
              ) : (
                <p>No messages yet</p>
              )}
            </div>
            <form onSubmit={handleSubmit} style={chatStyle.form}>
              <input
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                style={chatStyle.input}
              />
              <button type="submit" style={chatStyle.button}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    )
  );
}
