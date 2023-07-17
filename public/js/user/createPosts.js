export function makePost(){
effect(('post_click'), (e) => {
    let content = getState('postContent')
     
    const data = {
        "author": pb.authStore.model.id,
        "content":  content,
        "type": "text",
        "likes": JSON.stringify([]),
    };
    pb.collection('posts').create(data).then((res) => {
      window.location.reload()
    })
})
  
}