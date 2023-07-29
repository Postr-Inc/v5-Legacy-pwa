export function makePost(){
  dox.getId('post').on('click', async (e) => {
   
     
    if(!getState('postContent')){
      alert('Please enter some content')
      setState('postContent', '')
      return
    }
    const data = {
        "author": pb.authStore.model.id,
        "content":  getState('postContent'),
        "type": "text",
        "likes": JSON.stringify([]),
        "shares": 0
    };
    let recdata = await pb.collection('posts').create(data) 
    window.location.hash = '#/post/' + recdata.id
    return 
  })
  return 
}
 