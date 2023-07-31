let previousPosts = [];
let newPostsAppended = false; // Flag to track if new posts were appended

export async function loadFeed(page = 1, perPage = 10) {
   
   

  pb.collection('posts')
    .getList(page, perPage, {
      expand: 'author',
      filter: `author.id != "${pb.authStore.model.id}"`,
      sort: `-created`
    })
    .then((res) => {
      // Filter out any duplicate posts based on previousPosts
      const newPosts = res.items.filter((post) => !previousPosts.some((prevPost) => prevPost.id === post.id));

      // Create an array to store the post elements
      const postElements = [];

      newPosts.forEach(async (post) => {
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

        // Add the post element to the array
        postElements.push(poster);

        // Add the post to the previousPosts array
        previousPosts.push(post);
      });

      // Append all post elements to the DOM at once
      dox.awaitElement('#postfeed').then((feed) => {
        if (feed.style.display == 'none') {
          feed.style.display = 'block';
        }

        // Use DocumentFragment to optimize DOM manipulation
        const fragment = document.createDocumentFragment();
        postElements.forEach((postElement) => {
          fragment.prepend(postElement);
          
        });

        if (newPosts.length > 0) {
          // New posts were appended
          newPostsAppended = true;
          feed.prepend(fragment);
        } else {
          // No new posts, re-append previous posts
          if (!newPostsAppended && previousPosts.length > 0){
            previousPosts.forEach((prevPost) => {
              if(document.getElementById(prevPost.id)){
                return
              }
              let poster = dox.add('poster', {
                description: prevPost.content,
                Uname: prevPost.expand.author.username,
                image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${prevPost.expand.author.id}/${prevPost.expand.author.avatar}`,
                pid: prevPost.id,
                postimg: prevPost.file ? `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${prevPost.id}/${prevPost.file}` : null,
                Uid: prevPost.expand.author.id,
                posted: parseDate(prevPost.created),
                likes: JSON.parse(JSON.stringify(prevPost.likes)).length,
                shares: prevPost.shares,
                isVerified: prevPost.expand.author.validVerified ? true : false,
                id: prevPost.id,
              });
              fragment.prepend(poster);
              handlevents('posts', prevPost); // Assuming the handlevents function needs a prevPost
            });
            feed.prepend(fragment);
          }
        }

        // Reset the flag
        newPostsAppended = false;

        // Schedule the next load after 10-20 seconds
        window.onscroll = debounce(async () => {
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
             
            await loadFeed(page + 1, perPage);
             
          }
        }, 1000);
      });

       if(!dox.querySelector('.loading-infinity').style.display == 'none';){
          
      dox.querySelector('.loading-infinity').style.display = 'none';
       }
    });
}



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

export async function handlevents(collection, post) {
 
  const likes = JSON.parse(JSON.stringify(post.likes));
 
  const shares = post.shares;
 
  const btn = await dox.awaitElement(`#heart-${post.id}`) || dox.getId(`#heart-${post.id}`)
 
  const sharebtn = await dox.awaitElement(`#share-${post.id}`);
   
  const tipElement = btn
   
  function updateLikeStatus() {
     
    if (pb.authStore.isValid && likes.includes(pb.authStore.model.id)) {
       
      dox.getId(`heart-${post.id}`).classList.toggle('text-red-500', true);
      tipElement.setAttribute('data-tip', 'Unheart');
      dox.getId(`likes-${post.id}`).innerHTML = likes.length + (likes.length == 1 ? ' like' : ' likes');
    } else {
      dox.getId(`heart-${post.id}`).classList.toggle('text-red-500', false);
      tipElement.setAttribute('data-tip', 'Heart');
      dox.getId(`likes-${post.id}`).innerHTML = likes.length + (likes.length == 1 ? ' like' : ' likes');
    }
  }

   
  dox.getId(`delete-${post.id}`).on('click', async () => {
    await pb.collection('posts').delete(post.id)
    window.location.reload()
  })
  function updateShareStatus() {
    sharebtn.setAttribute('data-tip', 'Share');
  }
  dox.getId(`reportbtn-${post.id}`).on('click', async () => {
    let report = getState(`report`)
    if (!report) {
      alert('Please enter a reason')
      return
    }
     
    const data = {
      "reason":  report,
      "postid": post.id,
      "PostAuthor":  post.expand.author.id,
      "ReportedBy": pb.authStore.model.id
    };
  
   await pb.collection('reports').create(data)
   alert('Reported!')
  })

  updateLikeStatus();

  const debouncedLikeHandler = debounce(() => {
     
    if (pb.authStore.isValid && likes.includes(pb.authStore.model.id)) {
      
      likes.splice(likes.indexOf(pb.authStore.model.id), 1);
     
    } else {
      likes.push(pb.authStore.model.id);
     
    }

    pb.collection(collection).update(post.id, {
      likes: JSON.stringify(likes),
    });

    updateLikeStatus();
  }, 1000); // 1000ms (1 second) debounce time

  btn.click(debouncedLikeHandler)

  const debouncedShareHandler = debounce(() => {
     

    const url = window.location.origin + '#/post/' + post.id;
    navigator.clipboard.writeText(url);

    pb.collection(collection).update(post.id, {
      shares: shares + 1,
    });

    dox.getId(`shares-${post.id}`).innerHTML = shares + 1 + (shares == 1 ? ' share' : ' shares');
    dox.getId(`share-${post.id}`).setAttribute('data-tip', 'Copied!');
    setTimeout(() => {
      
      updateShareStatus();
    }, 1000);
  }, 1000); // 1000ms (1 second) debounce time
 if(sharebtn){
  sharebtn.click(debouncedShareHandler)
 }
   
}


