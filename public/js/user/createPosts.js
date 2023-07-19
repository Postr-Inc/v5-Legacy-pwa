export function makePost(){
  dox.getId('post').on('click', async  () => {
     
      let content = getState('postContent')
     
      if(!content){
        alert('Please enter some content')
        return
      }
      const data = {
          "author": pb.authStore.model.id,
          "content":  content,
          "type": "text",
          "likes": JSON.stringify([]),
          "shares": 0
      };
      let recdata = await pb.collection('posts').create(data) 
      window.location.hash = '#/post/' + recdata.id
    })
   
}
 