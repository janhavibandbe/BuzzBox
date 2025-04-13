import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime, convertISTtoUTC } from '../../lib/utils';
import { Smile, X } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const ChatBox = () => {
  const { messages, getMessages, selectedUser, setSelectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  const { authUser, } = useAuthStore();
  const messageEndref = useRef(null);

  const [text, setText] = useState("");
  const [imagePreview, setImagePrivew] = useState(null);
  const fileInputRef = useRef(null);
  const scheduledFileInputRef = useRef(null);
  const { sendMessages, sendScheduledMessages } = useChatStore();

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [scheduledText, setScheduledText] = useState("");
  const [scheduledImgPreview, setScheduledImgPreview] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if(messageEndref.current && messages) {
      messageEndref.current.scrollIntoView({ behavior: "smooth"});
    }
  }, [messages]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePrivew(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePrivew(null);
    if(fileInputRef.current) fileInputRef.current.value="";
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      //clear from
      setText("");
      setImagePrivew(null);
      setShowEmojiPicker(false);
      if(fileInputRef.current) fileInputRef.current.value="";
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  };

  const handleScheduleTime = async(value) => {
    const ScheduleTime = convertISTtoUTC(value);
    setScheduledDateTime(ScheduleTime);
  };

  const handleScheduledImage = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScheduledImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleMessage = async(e) => {
    e.preventDefault();
    if(!scheduledText.trim() && !scheduledImgPreview && !scheduledDateTime) {
      toast.error("Please enter time and message");
      return;
    }
    else if(!scheduledDateTime){
      toast.error("Timer has not scheduled");
      setScheduledText("");
      setScheduledImgPreview(null);
    }
    else if(!scheduledText && !scheduledImgPreview){
      toast.error("No message found");
      setScheduledDateTime("");
    }
    else{
      try {
        await sendScheduledMessages({
          text: scheduledText.trim(),
          image: scheduledImgPreview,
          scheduledTime: scheduledDateTime,
        });
  
        //clear from
        setScheduledText("");
        setScheduledImgPreview(null);
        setScheduledDateTime("");
        if(scheduledFileInputRef.current) scheduledFileInputRef.current.value="";
        setShowDateTimePicker(false);
  
      } catch (error) {
        console.error("Failed to send message: ", error);
      }
    }
   
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };


  return (
     <div className='chat-box'>
        <div className="chat-user">
          <img src={selectedUser.profilePic || "/avatar.png"} alt="" />
          <p>{authUser._id==selectedUser._id ? `${selectedUser.fullName} (You)`: `${selectedUser.fullName}`} 
            <img className='dot' src={assets.green_dot} alt="" />
          </p>
          <img src={assets.help_icon} className='help' alt="" />

          <button onClick={() => setSelectedUser(null)}>
          <X />
          </button>
        </div>



        
        <div className="chat-msg">
          {messages.map((message) => {
            return (  // Add a return here
              <div
                key={message._id}
                className={`${message && message.senderId === authUser._id ? "s-msg" : "r-msg"}`}
                ref={messageEndref}
              >
                <div className="msg">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="msgImg"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>

                <div>
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt=""
                    className='chatBox-profile'
                  />
                  <p className="message-time">{formatMessageTime(message.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>

        



      <div className="chat-input">
        {imagePreview && (
          <div className="image-preview-container">
            <div className="image-wrapper">
              <img src={imagePreview} alt="Preview" className="imagePreview" />
              <button onClick={removeImage} className="remove-image-button" type="button">
                <X className="remove-icon" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="chat-form">
          <div className="chat-input-container">
            {/* Emoji Picker Button */}
            <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile className="emoji-icon" />
            </button>

            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <button className="close-picker-container" onClick={() => setShowEmojiPicker(false)}>
                  <X/>
                </button> 
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <input
              type="text"
              className="chat-text-input"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="gallery-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={assets.gallery_icon} alt="Gallery" />
            </button>

            <button type="button" onClick={() => setShowDateTimePicker(true)}>
              <img src={assets.schedule_message} alt="" />
            </button>
          </div>


          {showDateTimePicker && (
            <div className="datetime-modal">
              <button className="close-datetime-modal" onClick={() => setShowDateTimePicker(false)}>
                <X/>
              </button> 

              <label>Set time</label>
              <input 
                type="datetime-local" 
                className="schedule-time" 
                onChange={(e) => handleScheduleTime(e.target.value)}/>

              <label>Message</label>
              <textarea 
              className="schedule-msg" 
              value={scheduledText}
              onChange={(e) => setScheduledText(e.target.value)} 
              placeholder='Write message here...'></textarea>

              <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={scheduledFileInputRef}
              onChange={(e) => handleScheduledImage(e)}
              />
              {!scheduledImgPreview ? (
                <button className="schedule-img" onClick={() => scheduledFileInputRef.current?.click()}>
                  <img src={assets.gallery_icon} alt="Select" />
                </button>
              ) : (
                <div className="schedule-img-preview" onClick={() => scheduledFileInputRef.current?.click()}>
                  <img src={scheduledImgPreview} alt="Selected"/>
                </div>
              )}

              <button className="confirm-btn" onClick={handleScheduleMessage}>Send</button>
            </div>
          )}

          <button type="submit" className="send-button" disabled={!text.trim() && !imagePreview}>
            <img src={assets.send_button} alt="Send" className="send-icon" />
          </button>
        </form>
      </div>

    </div>
   )
}

export default ChatBox;