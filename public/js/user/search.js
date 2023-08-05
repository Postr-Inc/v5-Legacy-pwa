import { debounce } from "/public/js/feed/feed.js"

let page = 1;
function searchQ(query){
   document.getElementById('topaccounts').innerHTML = ''
   pb.collection('users').getList(page, 10, {
    filter: `username ~ "${query}"`,
   }).then((res) => {
     if(res.items.length == 0){
       dox.getId('topaccounts').html('<div id="empty" class="mx-auto flex text-2xl justify-center mt-16 font-bold">No users found</div>')
       return
     }else{
       if(document.getElementById('empty')){
          dox.getId('empty').remove()
       }
       if(document.querySelector('.loading-infinity')){
        dox.querySelector('.loading-infinity').remove()
       }
      
       
       res.items.forEach((user) => {
        let up = dox.add('user', {
            name: user.username,
            Uid: user.id,
            Ubio: user.bio,
            followers: user.followers.length,
            verified: user.validVerified ? true : false,
            image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}`,
            id: 'user-' + user.id,

        })
        dox.awaitElement('#verified-' + user.id).then((res) => {
          if(!user.validVerified){
            res.style.display = 'none'
          }
        })
        dox.awaitElement('#followbtn-' + user.id).then((res) => {
          if(user.id == pb.authStore.model.id){
              res.html(`You! `)
              res.onclick = ()=>{
                  window.location.href = `/#/profile/${user.id}`
              }
          }
          else if(user.followers.includes(pb.authStore.model.id)){
              res.html(`Following`)
              
          }
       
          async function handle() {
              try {
                if (user.followers.includes(pb.authStore.model.id) && !handling) {
                  handling = true;
                  res.html(`Following`);
                  await pb.collection('users').update(user.id, {
                    followers: user.followers.filter((follower) => follower !== pb.authStore.model.id),
                  });
                  user = await pb.collection('users').getOne(user.id);
                  dox.getId('followers-' + user.id).html(user.followers.length + ' Followers');
                  res.html(`Follow`);
                } else if (!user.followers.includes(pb.authStore.model.id) && !handling) {
                  handling = true;
                  res.html(`Follow`);
                  user.followers.push(pb.authStore.model.id);
                  await pb.collection('users').update(user.id, {
                    followers: user.followers,
                  });
                  user = await pb.collection('users').getOne(user.id);
                  dox.getId('followers-' + user.id).html(user.followers.length + ' Followers');
                  res.html(`Following`);
                }
              } catch (error) {
                // Handle any errors that might occur during the update
                console.error('Error updating user:', error);
              }
              handling = false;
              clicked = false;
            }

            res.onclick = ()=>{
              if(!clicked){
                  console.log('clicked')
                  debounce(handle(), 1000)
                  clicked = true;
              }
            }
        })
         
        if(!document.getElementById('user-' + user.id)){
          dox.getId('topaccounts').append(up)
           
        }
       })
     }
   })
}
window.searchQ = searchQ
window.debounce = debounce
let handling = false;
let clicked = false;
let users = [];
export async function GetTopAccounts(){
    let top = await pb.collection('users').getList(page, 10, {
        sort: '-followers.length',
    })
    top.items = top.items.sort((a, b) => {
        return b.followers.length - a.followers.length
    })
    top.items.forEach(async (user) => {
       
       let up = dox.add('user', {
              name: user.username,
              Uid: user.id,
              Ubio: user.bio,
              followers: user.followers.length,
              verified: user.validVerified ? true : false,
              image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}`,
              id: 'user-' + user.id,
       }) 
       users.push(user)
        
       dox.awaitElement('#verified-' + user.id).then((res) => {
        if(!user.validVerified){
          res.style.display = 'none'
        }
      })
      dox.awaitElement('#followbtn-' + user.id).then((res) => {
        if(user.id == pb.authStore.model.id){
            res.html(`You! `)
            res.onclick = ()=>{
                window.location.href = `/#/profile/${user.id}`
            }
        }
        else if(user.followers.includes(pb.authStore.model.id)){
            res.html(`Following`)
            
        }
     
        async function handle() {
            try {
              if (user.followers.includes(pb.authStore.model.id) && !handling) {
                handling = true;
                res.html(`Following`);
                await pb.collection('users').update(user.id, {
                  followers: user.followers.filter((follower) => follower !== pb.authStore.model.id),
                });
                user = await pb.collection('users').getOne(user.id);
                dox.getId('followers-' + user.id).html(user.followers.length + ' Followers');
                res.html(`Follow`);
              } else if (!user.followers.includes(pb.authStore.model.id) && !handling) {
                handling = true;
                res.html(`Follow`);
                user.followers.push(pb.authStore.model.id);
                await pb.collection('users').update(user.id, {
                  followers: user.followers,
                });
                user = await pb.collection('users').getOne(user.id);
                dox.getId('followers-' + user.id).html(user.followers.length + ' Followers');
                res.html(`Following`);
              }
            } catch (error) {
              // Handle any errors that might occur during the update
              console.error('Error updating user:', error);
            }
            handling = false;
            clicked = false;
          }
          
     
        
      res.onclick = ()=>{
        if(!clicked){
            console.log('clicked')
            debounce(handle(), 1000)
            clicked = true;
        }
      }
        
    })
        
       if(!document.getElementById('user-' + user.id)){
        dox.getId('topaccounts').append(up)
         
       } 
        
    })
 
}
 