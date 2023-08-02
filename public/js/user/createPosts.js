let isCreatingPost = false; // Add a flag to track if a post creation process is already running

export async function makePost() {
  try {
    const res = await dox.awaitElement("#post");
    const clickHandler = async () => {
      if (isCreatingPost) {
        return; // If post creation process is already running, ignore subsequent clicks
      }

      if (!getState("postContent") || getState("postContent").length < 1) {
        alert("Please enter some content");
        setState("postContent", "");
        return;
      }
      if (getState("postContent").length > 1000) {
        alert("Woah slow down sweetie, who is gonna read all that?");
        setState("postContent", "");
        return;
      }
      

      try {
        isCreatingPost = true; // Set the flag to true to indicate post creation process is starting
        let d = await createPost();
        let followers = d.expand.author.followers;
        let notificationPromises = followers.map(async (follower) => {
          await pb.collection("notifications").create({
            "author": pb.authStore.model.id,
            "post": d.id,
            "title": "New Post from " + d.expand.author.username,
            "body": d.content.substring(0, 100) + "...",
            "recipient": follower,
            "type": "post",
            "url": window.location.origin + "/#/post/" + d.id,
          });
        });

        await Promise.all(notificationPromises);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        isCreatingPost = false; // Reset the flag after the post creation process is complete
        res.off("click", clickHandler); // Remove the click event listener to prevent further clicks
        setState("postContent", "");
      }
    };

    res.on("click", clickHandler);
    res.click((e)=>{
      console.log(e)
    })
  } catch (error) {
    console.error("Error:", error);
  }
}



async function createPost() {
  console.log("creating post");
  let form = new FormData();
  getState("postImage") ? form.append("file", getState("postImage")) : null;
  form.append('author', pb.authStore.model.id)
  form.append('content', getState("postContent"))
  form.append('likes', JSON.stringify([]))
  form.append('type',  getState("postImage") ? 'image' : 'text')
  form.append('shares', 0)
  getState("postImage", "")
  getState("postContent", "")
  let d = await pb.collection("posts").create(
    form,
    {
      expand: "author",
    }
  );
  isCreatingPost = false;
  return d;
}

function redirect(path) {
  if (pb.authStore.isValid) {
    window.location.href = path;
  }
}
