export const rules = (post) => {
  return [
    {
        action: 'edit',
        condition:(user) =>{
          console.log(user.id, post.author)
            return user.id === post.author 
        }
    },
    {
        action: 'delete',
        condition:(user) =>{
            return user.id === post.author 
        }
    }
  ]
} 
