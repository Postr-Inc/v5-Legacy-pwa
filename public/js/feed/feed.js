import { handlevents, debounce } from "/public/js/feed/feed.js"
let previousPosts = []
let currentPage = 1;
let loadingPosts = false; // Flag to prevent multiple simultaneous requests
let page = 1
 
export function loadProfile(id){
    if(pb.authStore.isValid && pb.authStore.model.id == id){
        dox.getId('editbtn').style.display = 'block'
        dox.getId('sharebtn').style.display = 'block'
        dox.getId('followbtn').style.display = 'none'
        dox.getId('saveprofile').on('click', () => {
            console.log('saving')
            let username = getState('username')
            let form = new FormData()
            username ? form.append('username', username) : null
            getState('pfp') ? form.append('avatar', getState('pfp')) : null
            getState('bio') ? form.append('bio', getState('bio')) : null
            pb.collection('users').update(id, form).then((res) => {
                pb.collection('users').authRefresh()
                window.location.reload()
            })
        })
    }else{
        dox.getId('editbtn').style.display = 'none'
        dox.getId('sharebtn').style.display = 'none'
        dox.getId('followbtn').style.display = 'block'
    }
    pb.collection('users').getOne(id).then((res) => {
        dox.getId('profilepic').src =  `https://postr.pockethost.io/api/files/_pb_users_auth_/${res.id}/${res.avatar}`
        dox.getId('username').html(res.username.charAt(0).toUpperCase() + res.username.slice(1))
        dox.getId('tag').html(`@${res.username.toLowerCase()}`)
        dox.getId('bio').html(res.bio.charAt(0).toUpperCase() + res.bio.slice(1))
        dox.getId('followers').html(`Followers: ${res.followers.length ? res.followers.length : 0}`)
        follow(res)
        setState('currentuser', res)
     })

     
     effect(('pfp'), (e) => {
        let url = URL.createObjectURL(e)
        dox.getId('profilepicin').src = url
     })
     


        handleUserPosts(id, 20);
   // Event listener for scroll event
window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = document.body.scrollHeight;
    const scrollPosition = window.scrollY;
  
    // Check if the user has scrolled to the bottom of the page
    if (scrollHeight - windowHeight - scrollPosition < 100 && !loadingPosts) {
      // Add a small threshold (100px) to load more posts slightly before reaching the bottom
  
      // Set the loadingPosts flag to true to prevent multiple simultaneous requests
        loadingPosts = true;
     
          
      // Call the function to load more posts
        handleUserPosts(id, 20);
    }
  });
     

}
 

 
 

export async function handleUserPosts(userId, perPage = 20) {
  pb.collection('posts')
    .getList(currentPage, perPage, {
      filter: `author.id = '${userId}'`,
      expand: 'author',
      sort: 'created'
    })
    .then(async (res) => {
        console.log(res)
      if (res.items.length > 0) {
        const newPosts = res.items.filter((post) => !previousPosts.includes(post.id));
        newPosts.forEach((post) => {
            let poster = dox.add('poster', {
                description: post.content,
                Uname: post.expand.author.username,
                image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${post.expand.author.id}/${post.expand.author.avatar}`,
                id: post.id,
                pid: post.id,
                postimg: post.file ? `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${post.id}/${post.file}` : null,
                Uid: post.expand.author.id,
                posted: parseDate(post.created),
                likes: JSON.parse(JSON.stringify(post.likes)).length,
                shares: post.shares,
                isVerified: post.expand.author.validVerified ? true : false,
                id: post.id,
             })

          dox.getId('postcontainer').prepend(poster);
          handlevents('posts', post);
        });

        // Add new post IDs to the previousPosts array
        previousPosts.push(...newPosts.map((post) => post.id));

        // Increment the current page to load the next page next time
        currentPage++;

        // Allow loading more posts after this batch is processed
        loadingPosts = false;
      } else {
        // No more posts to load
        if (currentPage === 1) {
          dox.getId('postcontainer').html('<h1 class="justify-center mx-auto text-2xl flex mt-8">No posts yet</h1>');
        }
      }

      // Hide loading spinner after all posts are loaded
      if(!dox.querySelector('.loading-circle').style.display == 'none'){
        dox.querySelector('.loading-circle').style.display = 'none';
      }
    });
}

 

  

function parseDate(data){
    // just now - 1m - 1h - 1d - 1w - 1m - 1y
    let date = new Date(data)
    let now = new Date()
    let diff = now - date
    let seconds = Math.floor(diff / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    if(seconds < 60){
        return 'Just now'
    }else if(minutes < 60){
        return `${minutes}m`
    }else if(hours < 24){
        return `${hours}h`
    }else if(days < 7){
        return `${days}d`
    }else if(days < 30){
        return `${Math.floor(days / 7)}w`
    }else if(days < 365){
        return `${Math.floor(days / 30)}m`
    }else{
        return `${Math.floor(days / 365)}y`
    }


}

async function follow(data) {
      
    const followBtn = await dox.awaitElement('#followbtn');
     
  
    var isFollowing = data.followers.includes(pb.authStore.model.id);
  
    followBtn.html(isFollowing ? 'Unfollow' : 'Follow');
    followBtn.style.backgroundColor = isFollowing ? '#ff0000' : '#121212';
  
   followBtn.on('click', async  (e) => {
     
        if(pb.authStore.isValid){
            try {
                const updatedFollowers = isFollowing
                  ? data.followers.filter((id) => id !== pb.authStore.model.id)
                  : [...data.followers, pb.authStore.model.id];
                   
        
                // Update the local data immediately
                data.followers = updatedFollowers;
        
                const updatedData = await pb.collection('users').update(data.id, {
                  followers: JSON.stringify(updatedFollowers),
                });
                pb.collection('users').authRefresh()
                if(data.followers.includes(pb.authStore.model.id)){
                    pb.collection('notifications').create({
                        "author": pb.authStore.model.id,
                        "recipient": data.id,
                        "title": `Followed by ${pb.authStore.model.username}`,
                        "body": `${pb.authStore.model.username} has followed you`,
                        "type": "follow",
                        "url": window.location.origin + "/#/profile/" + pb.authStore.model.id,
                    })
                }
        
                const newFollowersCount = updatedData.followers.length;
                dox.getId('followers').html('Followers: ' + newFollowersCount);
        
                // Update the follow button text and toggle isFollowing state
                isFollowing = !isFollowing;
                dox.getId('followbtn').html(isFollowing ? 'Unfollow' : 'Follow');
                dox.getId('followbtn').style.backgroundColor = isFollowing ? '#ff0000' :  '#121212';
                setState('follow', null);
              } catch (error) {
                console.error('Error occurred:', error);
              }
        }else{
            window.location.href = '#/login'
        }
    });
        
  
  } 

 
