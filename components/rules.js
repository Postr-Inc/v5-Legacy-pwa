export const post_rules = (post) => {
  return [
    {
        roles:['owner'],
        actions: ['edit', 'delete'],
        resource: 'post',
        condition:(user) =>{
            return user.id === post.expand.author.id
        }
    }
  ]
} 