import React, { useEffect, useState } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';


const LeftSidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser } = useChatStore();
    const { logout, authUser } = useAuthStore();
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [search, setSearch] = useState("");

    const toggleSubMenu = () => {
        setIsSubMenuVisible(prevState => !prevState);
    };

    useEffect(() => {
        getUsers();
    }, [getUsers] );

    // if(isUsersLoading) return <SidebarSkeleton/>
    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='ls'>
         <div className="ls-top">  
          <div className="ls-nav"> 
            <img src={assets.logo} className='logo' alt="" />  
            <div className="menu">
                <div className="menu-icon" onClick={toggleSubMenu}>
                    <img src={assets.menu_icon} alt="Menu Icon" />
                </div>
                {isSubMenuVisible && (
                    <div className="sub-menu">
                        <div onClick={logout}>
                            <p>Logout</p>
                        </div>
                    </div>
                )}
            </div>
          </div>
          <div className="ls-search">
              <img src={assets.search_icon} alt="" />
              <input 
                type="text" 
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search here..' />
          </div>
         </div>


         <div className="ls-list">
            {filteredUsers.map((user)=>(
             <div  key={user._id} onClick={() => setSelectedUser(user)}
                className={`friends ${selectedUser && selectedUser._id === user._id ? "selectedFriend": ""}`}>
                <img src={user.profilePic || "/avatar.png"} alt="" />
                <div>
                    <p>{authUser._id==user._id ? `${user.fullName} (You)`: `${user.fullName}`} </p>
                    {/* <span>Hello,How are you?</span> */}
                </div>
            </div>
          )) }

        
            {filteredUsers.length === 0 && (
                <div className="userNotFound">User Not fround</div>
            )}
          </div>

        </div>
    )
}

export default LeftSidebar
