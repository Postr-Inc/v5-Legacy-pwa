import { useAuth, vhtml } from "vaderjs";

async function posts(props) {
  let rulesets = [
    {
      action: "delete",
      condition: (user) => {
        return user.id === props.user.id;
      },
    },
  ];
  let api = useAuth({ rulesets, user: props.currentUser });

  let userAvatar =
    "https://postr.pockethost.io/api/files/_pb_users_auth_/" +
    props.user.id +
    "/" +
    props.user.avatar;
  return vhtml`
    <div class="flex mx-5 font-mono mt-6 flex-col">
 
     <div class="flex flex-row  gap-5 ">
     <img
      src="${userAvatar}"
      class="w-8 h-8 rounded-full"
      alt="avatar"
     />
     
      <span class=" text-md">${props.user.username}</span>
      ${
        props.user.validVerified
          ? vhtml`
        <div class="tooltip inline" data-tip="This User is verified" id="verified-lazu4m4wjfsedgj" style="display: block;">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline text-sky-500">
             <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
           </svg>
         </div>
         `
          : vhtml``
      }
      <div class="absolute flex mx-auto flex-grow end-5"> 
     
<div class="dropdown dropdown-left">
  <label tabindex="0" class="bg-none hover:bg-none focus:bg-none cursor-pointer m-1 ">•••</label>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li>
    ${
      api.can("delete")
        ? vhtml`
    <a href="#" class="disabled:opacity-50 text-error" onclick="deletePost(${props.pid})">Delete</a>
    `
        : vhtml``
    }
    </li>
    <li><a>Item 2</a></li>
  </ul>
</div>
     
      </div>
     </div>
      
     <!--Bottom-->
      <div class="flex flex-col mt-2 justify-between">
        <span class="text-md font-mono " >${props.description}</span>
        ${
          props.image !== null
            ? vhtml`
            <img src="https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.pid}/${props.image}"
            class="w-full h-96 rounded-2xl"
            alt="post" />
            `
            : vhtml``
        }
      </div>
      <div class="mt-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="
      ${props.likes.includes(props.currentUser.id) ? "red" : "none"}
      " viewBox="0 0 24 24" stroke-width="1.5" alt="heart" stroke="${
        props.likes.includes(props.currentUser.id) ? "red" : "black"
      }" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
        </svg>
      </div>
      <div class="text-gray-500 mt-2"> 
      ${
        props.likes.length > 1
          ? props.likes.length + " likes"
          : props.likes.length + " like"
      }
    </div>
`;
}
export default posts;
