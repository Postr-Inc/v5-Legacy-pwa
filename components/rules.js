export const rules = (post) => {
  return [
    {
        action: 'edit',
        condition:(user) =>{
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