import { handlevents } from "/public/js/feed/feed.js"

export function viewPost(postid){
  pb.collection('posts').getOne(postid, {
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
        shares: res.shares
     })
        dox.getId('postcontainer').prepend(poster)
        
     handlevents(res)
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
 