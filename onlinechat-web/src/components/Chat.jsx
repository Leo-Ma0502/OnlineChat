import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContextProvider";
import { getUserlist } from "../service/api";

export default function Chat() {
  const { username, socketClient, messagePool } = useContext(AppContext);
  // all users existing in the system
  const [users, setUsers] = useState([]);
  // all messages
  const [messages, setMessages] = useState(JSON.parse(messagePool));

  useEffect(() => {
    // Fetch user list and update state
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

  // select user to send message
  const [userSelected, setUserSelected] = useState(null);

  // message
  const [msg, setMsg] = useState("");
  // send message
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
      alert("no user selected!");
    }
  };

  return (
    <>
      {/* user list */}
      <div id="userlist">
        {users.length != 0 ? (
          <ul>
            {users
              .filter((i) => {
                return i.username != username;
              })
              .map((i, index) => (
                <button
                  key={index}
                  onClick={() => setUserSelected(i.username)}
                  onDoubleClick={() => setUserSelected(null)}
                  style={
                    i.username == userSelected
                      ? { backgroundColor: "black", color: "white" }
                      : {}
                  }
                >
                  {i.username}
                </button>
              ))}
          </ul>
        ) : (
          "no users yet"
        )}
      </div>

      {userSelected ? (
        <>
          {/* message history*/}
          <div>
            <>Messages</>
            {messages?.length != 0 ? (
              Array.from(messages)
                .filter((i) => {
                  return (
                    (i.from == username && i.to == userSelected) ||
                    (i.from == userSelected && i.to == username)
                  );
                })
                .map((msg, index) => {
                  return <p key={index}>{`${msg?.from}: ${msg?.body}`}</p>;
                })
            ) : (
              <p>No messages yet</p>
            )}
          </div>
          {/* send message */}
          <form onSubmit={handleSubmit}>
            <input
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            ></input>
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
