import { api } from "..";
import React, {useState} from 'react'
import verified from '../icons/verified.png'
import { Modal } from "./modal";
export  function Post(props){
    const [likes, setLikes] = useState(props.likes)
     function likepost(){
      if(likes.includes(api.authStore.model.id)){
        let index = likes.indexOf(api.authStore.model.id)
        likes.splice(index, 1)
        setLikes([...likes])
        api.collection('posts').update(props.id, {
          likes: likes
        })
      }else{
        setLikes([...likes, api.authStore.model.id])
        api.collection('posts').update(props.id, {
          likes: [...likes, api.authStore.model.id]
        })
      }
    }
    function debounce(fn, time){
        let timeout;
        return function(){
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
            fn()
            }, time)
        }
    }
   
    return(
        <div className="flex flex-col text-sm font-mono  mb-[35px]  "
      
        >
          <div className="flex flex-row ">
        { props.author.avatar ? 
            <img src={`https://postr.pockethost.io/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`} 
            className="w-8 h-8 rounded-full object-cover" alt="post image" />
            : <div className="avatar placeholder">
  <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
    <span>{props.author.username.slice(0,2)}</span>
  </div>
</div> 
}
            <span className="mx-3 text-sm"
            onClick={()=>{
                window.location.hash = `#/profile/${props.author.id}`
            }}
            >{props.author.username}
            </span>
             {
               props.author.validVerified ?  
                <img src={verified}
                className="w-5 h-5 mt-1"
                />
               : <></>
            }
            <div className="dropdown dropdown-left absolute end-5 ">
            <div className="flex text-sm flex-row gap-5">
            <span
            className="text-gray-500 text-sm"
            >
            {parseDate(props.created)}
            </span>
            <label tabIndex="0" className="flex text-gray-500   cursor-pointer">
             •••
            </label>
            </div>
            <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <span  onClick={()=>{
                    navigator.share({
                        title: `View ${props.author.username}'s post on Postr!`,
                        text: props.content,
                        url: window.location.href
                        })
                 }} 
                    className="cursor-pointer"
                >Share</span>
            </li>
                <li>
                    <a  >Report</a>
                </li>
               
            </ul>
          </div>
            
          </div>
          <p className="mt-6 text-sm"
          ref={(el)=>{
            if(el){
              el.innerHTML = props.content
            }
          }}
          ></p>
           {
            props.file ?   
            
            <img src={`https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`} className="w-full h-96 object-cover rounded-md mt-5" 
            alt="post image"
            onClick={()=>{
               document.getElementById('modal' + props.id).showModal()
              
            }}
            />
            :  <></>
          }
          {
            props.file ? 
            <Modal id={'modal' + props.id}>
            <button className="flex justify-center mx-auto focus:outline-none">
            <div className="divider  text-slate-400  w-12   mt-0"></div>
            </button>
             <img src={`https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`} className="w-full p-2 h-full object-cover rounded  "
                alt="post image"
            />
            </Modal>
            : ''
          }
          <div className="flex flex-row gap-5 mt-6">
            
           {
            /**
             * @Icon
             * @name:  like
             * @description:  like icon
             * @function: likes_{props.id}
             */ ""
           }
            <svg
              onClick={debounce(likepost, 1000)}
              xmlns="http://www.w3.org/2000/svg" fill= 
              {likes.includes(api.authStore.model.id) ? '#F13B38' : 'none'}
                viewBox="0 0 24 24" strokeWidth="1.5" stroke= 
              {likes.includes(api.authStore.model.id) ? '#F13B38' : 'currentColor'}
              className="w-6 h-6 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
             
           {
            /**
             * @Icon
             * @name: comment
             * @description:  comment icon
             */ ""
           }
  
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
           </svg>
    
  
            {
            /**
             * @Icon
             * @name: repost
             * @description: repost icon
             */ ""
           }
  
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
           <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
         </svg>
  
          
           
          </div>
          <div className="mt-5">
          <span> {likes.length > 1 ? likes.length + ' likes' : likes.length + ' like'}</span>
          </div>
        </div>
    )
};


function parseDate(data){
    let date = new Date(data)
    let now = new Date()
    let diff = now - date
    let seconds = diff / 1000
    let minutes = seconds / 60
    let hours = minutes / 60
    let days = hours / 24
    let weeks = days / 7
    let months = weeks / 4
    let years = months / 12
    if(seconds < 60){
      return 'just now'
    }
    if(minutes < 60){
      return Math.round(minutes) + 'mins'
    }
    if(hours < 24){
      return Math.round(hours) + 'h'
    }
    if(days < 7){
      return Math.round(days) + 'd'
    }
    if(weeks < 4){
      return Math.round(weeks) + 'w'
    }
    if(months < 12){
      return Math.round(months) + 'm'
    }
    if(years > 1){
      return Math.round(years) + 'y'
    }
  
  
  }
