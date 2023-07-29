import { handlevents } from "/public/js/feed/feed.js"
 
export async  function viewPost(postid){
   
  await pb.collection('posts').getOne(postid, {
    expand: 'author'
  }).then((res) => {
     let poster = dox.add('poster', {
        description: res.content,
        Uname: res.expand.author.username,
        image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${res.expand.author.id}/${res.expand.author.avatar}`,
        id: res.id,
        pid: res.id,
        postimg: res.file ? `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${res.id}/${res.file}` : null,
        Uid: res.expand.author.id,
        posted: parseDate(res.created),
        likes: JSON.parse(JSON.stringify(res.likes)).length,
        shares: res.shares,
        isVerified: res.expand.author.validVerified ? true : false,
        dividercontent:'comments'
     }) 
     console.log(res)

    dox.getId('postcontainer').prepend(poster)
    handlevents('posts', res)
      
     comment(res)
     dox.querySelector('.loading-circle').style.display = 'none'
     
  })
}

 async function comment(data){
  dox.awaitElement('#comment-' + data.id).then((res) => {
     res.on('click', () => {
         window.location.hash = `#/post/${data.id}`
         let comment = getState('comment-' + data.id)
         
         if(!comment){
              alert('Please enter some content')
              return
         }

         const cdata = {
            "text":  comment,
            "user":  pb.authStore.model.id,
            "post":  data.id,
            likes: JSON.stringify([]),
            "shares": 0
        };
        pb.collection('comments').create(cdata, {
            expand: 'user',
       
        }).then((res) => {
          
              let comment = dox.add('comment', {
                  description: res.text,
                  Uname: res.expand.user.username,
                  image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${res.expand.user.id}/${res.expand.user.avatar}`,
                  cid: res.id,
                  Uid: res.expand.user.id,
                  posted: parseDate(res.created),
                  likes: JSON.parse(JSON.stringify(res.likes)).length,
                  isVerified: res.expand.user.validVerified ? true : false,
              })
               
              handlevents('comments', res)
              dox.getId('commentcontainer').prepend(comment)
              
              dox.querySelector('#commentcontainer-' + data.id).value = ''
        })
        return 
     })
     return
  })

  pb.collection('comments').getList(1, 10, {
    sort: `created`,
    filter: `post.id = '${data.id}'`,
    expand: 'user'
  }).then((res) => {
    res.items.forEach((comment) => {
      let commentt = dox.add('comment', {
        description: comment.text,
        Uname: comment.expand.user.username,
        image: `https://postr.pockethost.io/api/files/_pb_users_auth_/${comment.expand.user.id}/${comment.expand.user.avatar}`,
        cid: comment.id,
        Uid: comment.expand.user.id,
        posted: parseDate(comment.created),
        likes: JSON.parse(JSON.stringify(comment.likes)).length,
        isVerified: comment.expand.user.validVerified ? true : false,
      })
       
       
      
      dox.getId('commentcontainer').prepend(commentt)
      handlevents('comments', comment)
    })
  })
  if(dox.getId('nocomments')){
    dox.getId('nocomments').remove()
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
 

 
