import { handlevents } from "/public/js/feed/feed.js"
 
export  async  function viewPost(postid){
   
  let res = await pb.collection('posts').getOne(postid, {
    expand: 'author'
  }) 
  dox.querySelector('.loading-circle').style.display = 'none'
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


dox.getId('postcontainer').append(poster)
dox.awaitElement('#postimg-' + res.id).then((el) => {
  if(res.file){
    el.src = `https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${res.id}/${res.file}`
  }else{
    el.style.display = 'none'
  }
})

 
dox.awaitElement('#deletebtn-' + res.id).then((el) => {
  if(res.expand.author.id !== pb.authStore.model.id){
   el.style.display = 'none'    
   console.log('not same')
  } 
})
dox.awaitElement('#verified-' +  res.id).then((el) => {
  if(res.expand.author.validVerified){
    el.style.display = 'block'
  }else{
    el.style.display = 'none'
  }

})
 
 

  
 handlevents('posts', res)
   
  comment(res)
   
 
 
 
}

async function comment(data){
  dox.awaitElement('#comment-' + data.id).then((res) => {
   
     res.on('click', () => {
 
         if(!getState('comment-' + data.id)){
              alert('Please enter some content')
              return
         }

         const cdata = {
            "text":  getState('comment-' + data.id),
            "user":  pb.authStore.model.id,
            "post":  data.id,
            likes: JSON.stringify([]),
            "shares": 0
        };
        pb.collection('comments').create(cdata, {
            expand: 'user',
       
        }).then(async (res) => {
          
              
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
              if(document.getElementById('nocomments')){
                dox.getId('nocomments').remove()
              }
              handlevents('comments', res)
              dox.getId('commentcontainer').prepend(comment)
              
              dox.querySelector('#commentcontainer-' + data.id).value = ''
              let el = await dox.awaitElement('#verified-' +   res.expand.user.id)
              console.log(el)
              setState('comment-' + data.id, '')  
               
           
              if(res.expand.user.id !== data.expand.author.id){
                await  pb.collection('notifications').create({
                  "title": "New Comment",
                  "body": `${pb.authStore.model.username} commented on your post`,
                  "author": pb.authStore.model.id,
                  "recipient": data.expand.author.id,
                  "type": "comment",
                  "url": window.location.origin + "/#/post/" + data.id,
                })
              }
        
        })
       
     })
     return
  })

  pb.collection('comments').getList(1, 10, {
    sort: `created`,
    filter: `post.id = '${data.id}'`,
    expand: 'user, post'
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
       
      dox.awaitElement('#deletebtn-' + comment.id).then((el) => {
         if(!comment.expand.user.id == pb.authStore.model.id || !comment.expand.post.author.id == pb.authStore.model.id){
           el.style.display = 'none'
         }
      })  
      
      dox.getId('commentcontainer').prepend(commentt)
      handlevents('comments', comment)
    
    })
    if(res.items.length > 0){
      dox.getId('nocomments').remove()
    }
  })
   
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
 

 