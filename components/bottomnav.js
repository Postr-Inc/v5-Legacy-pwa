import { vhtml } from "vaderjs";

 
export const bottomnav = (user) => {
 return vhtml`
 <div class="flex flex-row 
 p-5
 ${ 
    window.screen.width < 768 ? 'h-16' : 'h-20'
    
 }
 bottom-[-1px] w-full fixed bg-white   h-16  z-[9999] gap-5 justify-between">
    ${window.location.hash === "#/" ? vhtml`
    <img src="./src/public/assets/icons/homefilled.svg" class="w-6 h-6" alt="home" />
    `
:
vhtml`
`
    }
    <img src="./src/public/assets/icons/heart.svg" class="w-6 h-6" alt="plus" />
    <img src="./src/public/assets/icons/edit.svg" class="w-6 h-6" alt="plus" />
    <img src="./src/public/assets/icons/search.svg" class="w-6 h-6" alt="search" />
    <img src="./src/public/assets/icons/account.svg" class="w-6 h-6" alt="account" />
 </div>
 `
};