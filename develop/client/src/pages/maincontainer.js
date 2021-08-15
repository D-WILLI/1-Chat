import React, { useState, useEffect, } from 'react';
import { link } from 'react-router-dom';
import { io } from "socket.io-client";

import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_ALLCHATS, QUERY_LOADCHAT, QUERY_FRIENDS } from '../utils/queries';
import { ADD_FRIEND, DELETE_FRIEND, NEW_CHAT, DELETE_CHAT, SEND_MESSAGE, RECEIVE_MESSAGE, DELETED_MESSAGE} from '../utils/mutation';

import Profile from '../components/userprofile';
import Navbar from '../components/Navbar';
import Friends from '../components/friends';
import Message from '../components/message';
import Button from 'react-bootstrap/Button';
import FriendCard from '../components/friendCard';
import SearchRes from '../components/seachres';

const MainPage = () => {
    const { loading, data } = useQuery(QUERY_ME);
    const userData = data?.me || {};

    const [results, setResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [friendList, setFreindList ] = useState();
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();

    //const [searchfriends] = useQuery(QUERY_FRIENDS);

    const [addFriend] = useMutation(ADD_FRIEND);
    const []
    const scrollRef = useRef();

    const handleSearchSubmit = async (event) =>{
        event.preventDefault();
        
        /*const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }*/

        if(!searchInput){
            return false;
        }
        
        try {
            const { loading: searchLoading, data: searchData} = useQuery(QUERY_FRIENDS, { variables: { username: searchInput}});
            //const { data } = await searchfriends( { variables: {username: searchInput}});
            console.log("search results");

            console.log(data);
            setResults(data.getFriends);

        } catch (err) {
          console.error(err);
        }
    };
    const handleAddFriend = async (userId) =>{
        if(!userId) {
            return false;
        }
        try {
            const { data } = await addFriend({ variables: {_id: userId} });
            console.log('addfriend');
            console.log(data);
            setFreindList(data.friends);

        } catch (err) {
            return false
        }
    }

    const handleStartChat = async (userId) => {
        if(!userId) {
            return false;
        }

        const chatList = userData.conversations;

        chatList.forEach(chat => {
            if (chat.friendId === userId){
                //continue chat

                return;
            }        
        });

        //never chat with this friend before

        const { data } = await 
    }

    if (loading) {
        return <h2> LOADING ...</h2>

    } else {
        console.log(userData);
        setFreindList(userData.friends)
    };


    return (
        <>
            <Navbar userInfo={userData} />
            <div className="chatUI">
                <div className="friends">
                    <div className="friendList">
                        {friendList.map((each)=>(
                            <div key={each._id} onClick={()=>handleStartChat(each._id)}>
                            </div>
                        ))}

                        <FriendCard
                            friend={friend}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatNavbar">
                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatInput">
                                    <textarea
                                        className="messageInput"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noChat">
                                Open a conversation to start a chat.
                            </span>
                        )}
                    </div>
                </div>
                <div className="searchBar">
                    <div className="searchMenu">
                        <form onSubmit={handleSearchSubmit}>
                            <input className="searchInput" name='searchInput' value={searchInput} onChange={(e) =>{setSearchInput(e.target.value)}} type='text' placeholder='search fro friends'/>
                            <button type='submit'>submit</button>
                        </form>
                        {results.map((newFriend) => (
                            <div key={newFriend._id} onClick={() => handleAddFriend(newFriend._id)}>
                                <p>{newFriend._id}</p>
                                <SearchRes id={newFriend._id} name={newFriend.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

}

export default MainPage;