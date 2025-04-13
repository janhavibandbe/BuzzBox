import React from 'react';
import './Chat.css';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
// import RightSidebar from '../../components/RightSidebar/RightSidebar';
import ChatBox from '../../components/ChatBox/ChatBox';
// import { useAuthStore } from '../../store/useAuthStore';
import NoChatSelected from '../../components/NoChatSelected';
import { useChatStore } from '../../store/useChatStore';

function Chat() {
  const {selectedUser} = useChatStore();

  return (
    <div className='chat'>
      <div className="chat-container">
        <LeftSidebar/>
        {(!selectedUser || selectedUser === undefined) ? <NoChatSelected /> : <ChatBox />}
        {/* <RightSidebar/> */}
      </div>  
    </div>
  )
}

export default Chat