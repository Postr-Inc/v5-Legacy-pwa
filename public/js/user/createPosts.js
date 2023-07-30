export async function makePost() {
  try {
    const res = await dox.awaitElement("#post");
    res.on("click", async () => {
      if (!getState("postContent")) {
        alert("Please enter some content");
        setState("postContent", "");
        return;
      }

      let d = await createPost();

      let followers = d.expand.author.followers;

      setState("postContent", "");
      let notificationPromises = followers.map(async (follower) => {
        await pb.collection("notifications").create({
          "author": pb.authStore.model.id,
          "post": d.id,
          "title": "New Post from " + d.expand.author.username,
          "body": d.content.substring(0, 100) + "...",
          "recipient": follower
        });
      });

      await Promise.all(notificationPromises);
      
    });
  } catch (error) {
    console.error("Error:", error);
  }
}


async function createPost() {
  let d = await pb.collection("posts").create(
    {
      author: pb.authStore.model.id,
      content: getState("postContent"),
      type: "text",
      likes: JSON.stringify([]),
      shares: 0,
    },
    {
      expand: "author",
    }
  );
  return d;
}

function redirect(path) {
  if (pb.authStore.isValid) {
    window.location.href = path;
  }
}
