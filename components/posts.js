import { vhtml, component, rf } from "../src/public/vader.js";
import { rules } from "./rules.js";

const p = (id) => component(id, {
  render: (states, setState, useState, useEffect, useAuth, props) => {
    let [likes, setLikes] = useState('likes_' + props.id, props.likes)
     
    let url = `https://postr.pockethost.io/api/files/_pb_users_auth_/${props.expand.author.id}/${props.expand.author.avatar}`
    
    useEffect(() => {
      function likepost() {
        if (likes.includes(props.currentuser.id)) {
          console.log('unlike');
          likes.splice(likes.indexOf(props.currentuser.id), 1);
          setLikes(likes);
          
        } else {
          console.log('like');
          likes.push(props.currentuser.id);
          setLikes(likes);
        }
        likedebounce(() => {
          props.api.collection('posts').update(props.id, {
           likes: likes
          })
       });
      }
      
      rf('likes_' + props.id, likepost);
    }, []);

    let auth = useAuth({rulesets:rules(props),  user: props.currentuser})
 
    
    
    return vhtml`
      <div class="flex flex-col font-mono mt-6">
        <div class="flex flex-row gap-2">
          <img src="${url}" class="w-12 h-12 rounded-full object-cover" alt="post image" />
          <span class="mx-3">${props.expand.author.username}</span>
          ${
             props.expand.author.validVerified ? vhtml`
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-sky-500">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
             </svg>
             
             ` : ``
          }
          <div class="dropdown dropdown-left absolute end-5 ">
          <div class="flex flex-row gap-5">
          <span>
          ${
            parseDate(props.created)
          }
          </span>
          <label tabindex="0" class="flex text-gray-500   cursor-pointer">
           •••
          </label>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a
            onclick="navigator.share({
              title: 'Postr - ${props.expand.author.username}',
              text: '${props.content}',
              url: 'https://postr.pockethost.io/post/${props.id}',
            })"
            >Share</a></li>
            ${
              /**
               * @Methods
               * @description:  these check if user can edit or delete post that pertain to them!
               */
              ""
            }
             ${
              auth.can('edit')  ? vhtml`
              <li>
              <a href="#/edit/${props.id}">Edit</a>
              </li>
              ` : ``
            } 
             ${
              auth.can('delete') ? vhtml`
              <li>
              <a 
              onclick="false"
              >Delete</a>
              </li>
              ` : ``
            } 
          </ul>
        </div>
          
        </div>
        <p class="mt-6">${props.content}</p>
        ${
          props.file ? vhtml`
          <img src="https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}" class="w-full h-96 object-cover rounded-md mt-5" />
          ` : ``
        }
        <div class="flex flex-row gap-5 mt-6">
          
         ${
          /**
           * @Icon
           * @name:  like
           * @description:  like icon
           * @function: likes_${props.id}
           */ ""
         }
          <svg
            onclick="likes_${props.id}()"
            xmlns="http://www.w3.org/2000/svg" fill="
            ${likes.includes(props.currentuser.id) ? '#F13B38' : 'none'}
            " viewBox="0 0 24 24" stroke-width="1.5" stroke="
            ${likes.includes(props.currentuser.id) ? '#F13B38' : 'currentColor'}
            " class="w-6 h-6 cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
           
         ${
          /**
           * @Icon
           * @name: comment
           * @description:  comment icon
           */ ""
         }

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
         </svg>
  

         ${
          /**
           * @Icon
           * @name: repost
           * @description: repost icon
           */ ""
         }

         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
         <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
       </svg>

        
         
        </div>
        <div class="mt-5">
        <span>${likes.length > 1 ? likes.length + ' likes' : likes.length + ' like'}</span>
        </div>
      </div>
     `;
  }
});
const likedebounce = debounce(1000);

function debounce(time) {
  let timeout;
  
  return function(func) {
    const args = arguments;
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, time);
  };
}

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

export default p;
