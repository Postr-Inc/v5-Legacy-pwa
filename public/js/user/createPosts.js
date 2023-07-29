export async function makePost(){
  dox.getId('post').on('click', async () => {
   
     
    if(!getState('postContent')){
      alert('Please enter some content')
      setState('postContent', '')
      return
    }
   
  let d = await pb.collection('posts').create({
      "author": pb.authStore.model.id,
      "content":  getState('postContent'),
      "type": "text",
      "likes": JSON.stringify([]),
      "shares": 0
    }) 
    window.location.href = '#/post/' + d.id
 
    
  })
  return 
}
 
