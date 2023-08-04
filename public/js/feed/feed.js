let previousPosts = [];
let newPostsAppended = false; // Flag to track if new posts were appended
let page = 1;
const perPage = 10;
let posts;
let allposts = []
function alldposts(){
  console.log(allposts)
  allposts.forEach((post) => {
     
    handlevents('posts', post);
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
    dox.awaitElement('#deletebtn-' + post.id).then((res) => {
      
       if(post.expand.author.id !== pb.authStore.model.id){
        res.style.display = 'none'    
        console.log('not same')
       } 
    })
  });
  
}
window.postsWithFiles =  {}
export async function loadFeed() {
 
  try {
    posts = await pb.collection('posts').getList(page, perPage, {
      expand: 'author',
      filter: `author.id != "${pb.authStore.model.id}"`,
      sort: `-created`,
    });
    
    if (posts.items.length == 0) {
      dox.getId('postfeed').html('<div class="mx-auto flex text-2xl justify-center mt-16 font-bold">No posts yet</div>')
      return;
    }

    // Create a DocumentFragment to batch DOM manipulations
    const fragment = document.createDocumentFragment();

    

    posts.items.forEach(async (post) => {
       
      if (document.getElementById('post-' + post.id) == null) {
        
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
         
          handlevents('posts', post);
        
        previousPosts.push(post.id);
        fragment.append(poster);
        
        allposts.push(post)
      } 
       
      
    });
    console.log(allposts)

    const postfeed = dox.getId('postfeed');
    if (postfeed.style.display == 'none') {
      postfeed.style.display = 'block';
    }
     if(dox.querySelector('.loading-infinity').style.display !== 'none'){
        dox.querySelector('.loading-infinity').style.display = 'none'
     }
     
    postfeed.append(fragment);
    alldposts()
    
    
    window.onhashchange = () => {
        allposts = []
        previousPosts = []
    
        page = 1
        fragment.innerHTM  = ''
        postfeed.innerHTML = ''
    }
    window.onscroll = async () => {
      
      if (
        window.location.hash == `#/` &&
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        console.log('loading')
          loading = true;
          page += 1;
          await loadFeed() 
          
          alldposts();
          loading = false;
           
       
      }
    };
    
  } catch (error) {
    console.error('Error loading feed:', error);
  }
   
}

export async function handlevents(collection, postData) {
  
  
  let likes =  JSON.parse(JSON.stringify(postData.likes))
 


  let btn = await dox.awaitElement('#heart-' + postData.id)  
  
  if(likes.includes(pb.authStore.model.id)){
     btn.classList.add('text-red-500')
   }else{
     btn.classList.remove('text-red-500')
   }
   const tipElement = btn
    
   function updateLikeStatus() {
      
     if (pb.authStore.isValid && likes.includes(pb.authStore.model.id)) {
        
       dox.getId(`heart-${postData.id}`).querySelector('svg').setAttribute('fill', 'red');
       dox.getId(`heart-${postData.id}`).querySelector('svg').setAttribute('stroke', 'red');
       tipElement.setAttribute('data-tip', 'Unheart');
       dox.getId(`likes-${postData.id}`).innerHTML = likes.length + (likes.length == 1 ? ' like' : ' likes');
     } else {
       dox.getId(`heart-${postData.id}`).querySelector('svg').setAttribute('fill', 'none');
        dox.getId(`heart-${postData.id}`).querySelector('svg').setAttribute('stroke', 'black');
       dox.getId(`likes-${postData.id}`).innerHTML = likes.length + (likes.length == 1 ? ' like' : ' likes');
     }
   }
 
    
   
   
   updateLikeStatus();
 
   const debouncedLikeHandler = debounce(() => {
      console.log('liked')
     if (pb.authStore.isValid && likes.includes(pb.authStore.model.id)) {
       
       likes.splice(likes.indexOf(pb.authStore.model.id), 1);
      
     } else {
       likes.push(pb.authStore.model.id);
      
     }
 
     pb.collection(collection).update(postData.id, {
       likes: JSON.stringify(likes),
     });
 
     updateLikeStatus();
   }, 1000); // 1000ms (1 second) debounce time
 
    btn.onclick = debouncedLikeHandler;

    dox.awaitElement('#delete-' + postData.id).then((res) => {
      res.onclick = async () => {
        if (confirm('Are you sure you want to delete this post?')) {
          await pb.collection(collection).delete(postData.id);
          window.location.reload();
        }
      }
    })
    
 }
 
 
// Attach the scroll event listener
 
 

// Attach the scroll event listener with debounce
 


function parseDate(data) {
  // just now - 1m - 1h - 1d - 1w - 1m - 1y
  let date = new Date(data)
  let now = new Date()
  let diff = now - date
  let seconds = Math.floor(diff / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  let days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes}m`
  } else if (hours < 24) {
    return `${hours}h`
  } else if (days < 7) {
    return `${days}d`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}w`
  } else if (days < 365) {
    return `${Math.floor(days / 30)}m`
  } else {
    return `${Math.floor(days / 365)}y`
  }


}


// Debounce function to rate-limit clicks
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

 

let loading = false; // Flag to prevent multiple simultaneous loads
