export function makePost(){
  dox.getId('post').on('click', () => {
     
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
      pb.collection('posts').create(data).then((res) => {
        window.location.reload()
      })
    })
   
}
 