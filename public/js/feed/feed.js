export async function loadFeed() {
  dox.getId('postfeed').style.display = 'none'
  pb.collection('posts').getList(1, 10, {
    expand: 'author',
    filter: `author.id != "${pb.authStore.model.id}"`,
    sort: `-created`
  }).then((res) => {
    res.items.forEach(async (post) => {
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
      })
      dox.awaitElement('#postfeed').then((feed) => {
        feed.prepend(poster)
        feed.style.display = 'block'
        dox.querySelector('.loading-infinity').style.display = 'none'
        handlevents('posts', post)
      })
 

    })
  })
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
  console.log(post)
  const btn = await dox.awaitElement(`#heart-${post.id}`) || dox.getId(`#heart-${post.id}`)
   
  const sharebtn = await dox.awaitElement(`#share-${post.id}`);
   
  const tipElement = dox.querySelector('[data-tip="Heart"]');

  function updateLikeStatus() {
    console.log(pb.authStore.model.id, likes)
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

  function updateShareStatus() {
    dox.querySelector('[data-tip="Copied!"]').setAttribute('data-tip', 'share');
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

  btn.on('click', debouncedLikeHandler)

  const debouncedShareHandler = debounce(() => {
     

    const url = window.location.origin + '#/post/' + post.id;
    navigator.clipboard.writeText(url);

    pb.collection(collection).update(post.id, {
      shares: shares + 1,
    });

    dox.getId(`shares-${post.id}`).innerHTML = shares + 1 + (shares == 1 ? ' share' : ' shares');
    dox.querySelector('[data-tip="share"]').setAttribute('data-tip', 'Copied!');
    setTimeout(() => {
      
      updateShareStatus();
    }, 1000);
  }, 1000); // 1000ms (1 second) debounce time
 if(sharebtn){
  sharebtn.on('click', debouncedShareHandler)
 }
   
}
 
