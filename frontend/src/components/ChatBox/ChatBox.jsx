import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime, convertISTtoUTC } from '../../lib/utils';
import { Smile, X, Download, File, Paperclip  } from 'lucide-react';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { Link } from 'react-router-dom';

const ChatBox = () => {
  const { messages, getMessages, selectedUser, setSelectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const messageEndref = useRef(null);

  const [text, setText] = useState("");
  const [imagePreview, setImagePrivew] = useState(null);
  const [imageName, setImageName] = useState("");
  const fileInputRef = useRef(null);
  const scheduledFileInputRef = useRef(null);
  const { sendMessages, sendScheduledMessages } = useChatStore();

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [scheduledText, setScheduledText] = useState("");
  const [scheduledImgPreview, setScheduledImgPreview] = useState(null);
  const [scheduledImgName, setScheduledImgName] = useState("");

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
    // if(!file.type.startsWith("image/")){
    //   toast.error("Please select an image file");
    //   return;
    // }
    if(!file) return;
    setImageName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePrivew(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePrivew(null);
    setImageName("");
    if(fileInputRef.current) fileInputRef.current.value="";
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
        imageName: imageName,
      });

      //clear from
      setText("");
      setImagePrivew(null);
      setImageName("");
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
    setScheduledImgName(file.name);
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
      setScheduledImgName("");
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
          imageName: scheduledImgName,
          scheduledTime: scheduledDateTime,
        });
  
        //clear from
        setScheduledText("");
        setScheduledImgPreview(null);
        setScheduledImgName("");
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
          <img src={selectedUser.profilePic || "/avatar.png"} alt="" className='chat-profile'/>
          <p>
            {authUser._id==selectedUser._id ? `${selectedUser.fullName} (You)`: `${selectedUser.fullName}`} 
            {onlineUsers.includes(selectedUser._id) ? 
              <img className='dot' src={assets.green_dot} alt="" /> 
              : 
              ""
            }
          </p>
          <Link to={"/profileUpdate"}>
            <img src={assets.help_icon} className='help' alt="" />
          </Link>
          

          <button onClick={() => setSelectedUser(null)}>
          <X />
          </button>
        </div>



        
        <div className="chat-msg">
          {[...messages].reverse().map((message) => {
            return (  // Add a return here
              <div
                key={message._id}
                className={`${message && message.senderId === authUser._id ? "s-msg" : "r-msg"}`}
                ref={messageEndref}
              >
                <div className="msg">
                  {message.image && (
                    <>
                      {message.image.startsWith("data:image/") ? (
                        // ✅ Image Preview Section
                        <div className="relative inline-block">
                          <img
                            src={message.image}
                            alt="Attachment"
                            className="msgImg"
                          />
                          <a
                            href={message.image}
                            download={message.imageName}
                            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-gray-200 transition"
                            title="Download"
                          >
                            <Download size={16} className="text-gray-700" />
                          </a>
                        </div>
                      ) : (
                        // 📁 Non-image File Section
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                          <File size={20} className="text-gray-700" />
                          <span className="text-md max-w-[200px] text-black break-words">{message.imageName}</span>
                          <a
                            href={message.image}
                            download={message.imageName}
                            title="Download"
                            className="ml-auto bg-white p-1 rounded-full hover:bg-gray-200 transition"
                          >
                            <Download size={16} className="text-gray-700" />
                          </a>
                        </div>
                      )}
                    </>
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
              {/* <img src={imagePreview} alt="Preview" className="imagePreview" /> */}

              {imagePreview.startsWith("data:image/") ? (
                // ✅ Show image preview
                <img src={imagePreview} alt="Preview" className="imagePreview" />
              ) : (
                // 📁 Show file name instead of preview
                <div>
                <File size={18} className="text-gray-600" />
                <span className="text-sm text-black break-words max-w-[200px]">
                  {imageName}
                </span>
                </div>
              )}
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
              accept="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="gallery-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} className="text-gray-700" />
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
              accept="file"
              className="hidden"
              ref={scheduledFileInputRef}
              onChange={(e) => handleScheduledImage(e)}
              />
              {!scheduledImgPreview ? (
                <button className="schedule-img" onClick={() => scheduledFileInputRef.current?.click()}>
                  <Paperclip size={20} className="text-gray-500" />
                </button>
              ) : (
                <div className="schedule-img-preview" onClick={() => scheduledFileInputRef.current?.click()}>
                  {scheduledImgPreview.startsWith("data:image/") ? (
                    // ✅ Show image preview
                    <img src={scheduledImgPreview} alt="Selected"/>
                  ) : (
                    // 📁 Show file name instead of preview
                    <div>
                    <File size={18} className="text-gray-600" />
                    <span className="text-sm text-black break-words max-w-[200px]">
                      {scheduledImgName}
                    </span>
                    </div>
                  )}
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