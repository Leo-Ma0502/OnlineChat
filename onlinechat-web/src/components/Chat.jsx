import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContextProvider";
import { getUserlist } from "../service/api";

export default function Chat() {
  const { username, socketClient, messagePool } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState(JSON.parse(messagePool));
  const [userSelected, setUserSelected] = useState(null);
  const [msg, setMsg] = useState("");

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

  const chatStyle = {
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "flex-start",
      margin: "20px",
      fontFamily: "'Arial', sans-serif",
      color: "#333",
      height: "100vh",
    },
    userList: {
      flex: 1,
      border: "1px solid #ccc",
      padding: "10px",
      overflowY: "scroll",
      height: "80%",
      width: "100vw",
      marginRight: "20px",
      backgroundColor: "rgba(240, 240, 240, 0.8)",
      textAlign: "left",
    },
    chatArea: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "82.5%",
      width: "100vw",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    messageHistory: {
      border: "1px solid #ccc",
      padding: "10px",
      overflowY: "scroll",
      flexGrow: "1",
    },
    form: {
      display: "flex",
      marginTop: "10px",
    },
    input: {
      flexGrow: "1",
      padding: "10px",
      margin: "0 10px 0 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#1a1a1a",
      color: "white",
      cursor: "pointer",
    },
    message: {
      padding: "5px",
      margin: "5px 0",
      borderRadius: "5px",
      backgroundColor: "#f2f2f2",
      wordWrap: "break-word",
      whiteSpace: "pre-line",
    },
    sentMessage: {
      textAlign: "right",
      backgroundColor: "#d1f2eb",
    },
    receivedMessage: {
      textAlign: "left",
      backgroundColor: "#f2d1d1",
    },
    userButton: {
      display: "block",
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      backgroundColor: "rgba(50, 50, 200, 0.6)",
      color: "white",
      textAlign: "left",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    selectedButton: {
      backgroundColor: "#4a90e2",
      color: "white",
      margin: "5px 0",
    },
  };

  return (
    <div style={chatStyle.container}>
      <div id="userlist" style={chatStyle.userList}>
        <strong>Select a user to send message</strong>
        {users.length !== 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users
              .filter((i) => i.username !== username)
              .map((i, index) => (
                <li key={index}>
                  <button
                    onClick={() => setUserSelected(i.username)}
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
          "No users yet"
        )}
      </div>
      <div style={chatStyle.chatArea}>
        {userSelected && (
          <>
            <div style={chatStyle.messageHistory}>
              <strong>Messages with {userSelected}</strong>
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
          </>
        )}
      </div>
    </div>
  );
}
