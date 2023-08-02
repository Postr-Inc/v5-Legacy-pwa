import { handlevents, debounce } from "/public/js/feed/feed.js"
let previousPosts = [];
let newPostsAppended = false; // Flag to track if new posts were appended
let page = 1;
 
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
        dox.awaitElement('#username').then((el) => {
          dox.getId('profilepic').src =  `https://postr.pockethost.io/api/files/_pb_users_auth_/${res.id}/${res.avatar}`
          el.html(res.username.charAt(0).toUpperCase() + res.username.slice(1))
          dox.getId('tag').html(`@${res.username.toLowerCase()}`)
          dox.getId('bio').html(res.bio.charAt(0).toUpperCase() + res.bio.slice(1))
          dox.getId('followers').html(`Followers: ${res.followers.length ? res.followers.length : 0}`)
        })
        follow(res)
        setState('currentuser', res)
     })

     
     effect(('pfp'), (e) => {
        let url = URL.createObjectURL(e)
        dox.getId('profilepicin').src = url
     })
     


         loadFeed(id)
   
         let loading = false; // Flag to prevent multiple simultaneous loads

window.onscroll = async () => {
  if (
    window.location.hash === `#/profile/${id}` &&
    !loading &&
    window.scrollY + window.innerHeight >= document.body.offsetHeight * 0.9 // Load more when the user is 90% down the page
  ) {
    if (!newPostsAppended) {
      loading = true;
      page += 1;
      await loadFeed(id) 
      loading = false;
      alldposts();
    }
  }
};


}
 

 
 

 
const perPage = 10;
 
 
let posts;
let allposts = []
function alldposts(){
  console.log(allposts)
  allposts.forEach((post) => {
     
    handlevents('posts', post);
  });
}
export async function loadFeed(id) {
 
  try {
    posts = await pb.collection('posts').getList(page, perPage, {
      expand: 'author',
      filter: `author.id = "${id}"`,
      sort: `-created`,
    });
    
    if (posts.items.length == 0) {
      dox.getId('postcontainer').html('<div class="mx-auto flex text-2xl justify-center mt-16 font-bold">No posts yet</div>')
      return;
    }

    // Create a DocumentFragment to batch DOM manipulations
    const fragment = document.createDocumentFragment();

    function postCard(post) {
      let poster = dox.add('poster', {
        description: post.content,
        Uname: post.expand.author.username,
        image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${post.expand.author.id}/${post.expand.author.avatar}`,
        pid: post.id,
        postimg: post.file ? `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${post.id}/${post.file}` : null,
        Uid: post.expand.author.id,
        posted: parseDate(post.created),
        likes: JSON.parse(JSON.stringify(post.likes)).length,
        shares: post.shares,
        isVerified: post.expand.author.validVerified ? true : false,
        id: 'post-' + post.id,
      });
      dox.awaitElement('#postimg-' + post.id).then((res) => {
        if(post.file){
          res.src = `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${post.id}/${post.file}`
          res.style.display = 'block'
        }else{
          res.style.display = 'none'
        }
      })
      dox.awaitElement('#verified-' +  post.id).then((res) => {
        if(post.expand.author.validVerified){
          res.style.display = 'block'
        }else{
          res.style.display = 'none'
        }

      })
      return poster;
    }

    posts.items.forEach((post) => {
       
      if (document.getElementById('post-' + post.id) == null) {
          handlevents('posts', post);
        
        previousPosts.push(post.id);
        fragment.append(postCard(post));
        allposts.push(post)
      }

      
    });

    const postfeed = dox.getId('postcontainer');
    if (postfeed.style.display == 'none') {
      postfeed.style.display = 'block';

    }
     
    postfeed.append(fragment);
    alldposts()
    
    window.onhashchange = () => {
        allposts = []
        previousPosts = []
        posts = []
        page = 1
    }
    dox.querySelector('.loading').style.display = 'none'
  } catch (error) {
    console.error('Error loading feed:', error);
  }
   
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
let isFollowingbtn = false;
async function follow(data) {
      
    const followBtn = await dox.awaitElement('#followbtn');
     
  
    var isFollowing = data.followers.includes(pb.authStore.model.id);
  
    followBtn.html(isFollowing ? 'Unfollow' : 'Follow');
    followBtn.style.backgroundColor = isFollowing ? '#ff0000' : '#121212';
  
   followBtn.on('click', async  (e) => {
        
         console.log(isFollowingbtn)
        if(pb.authStore.isValid && !isFollowingbtn){
          isFollowingbtn = true
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
                isFollowingbtn = false
              } catch (error) {
                console.error('Error occurred:', error);
              }

        }else{
            window.location.href = '#/login'
        }
    });
        
  
  } 

 