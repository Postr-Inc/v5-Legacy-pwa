import {
  useState,
  form,
  vhtml,
  registerFunction,
  createComponent,
  useEffect,
} from "vaderjs";
import loginForm from "../components/forms/loginForm.js";
import api from "../src/app.js";
import posts from "../components/posts.js";
import { bottomnav } from "../components/bottomnav.js";

async function home() {
  let [user, setUser] = useState("user", api.authStore.isValid);
  let [postss, setPosts] = useState("posts", []);
  let f = await loginForm;

  f.on("submit", async (e, f) => {
    e.submitter.style.display = "flex";
    e.submitter.style.justifyContent = "center";
    e.submitter.innerHTML =
      '<span class="loading loading-spinner loading-xs"></span> Login';
    e.submitter.disabled = true;
    try {
      let res = await api
        .collection("users")
        .authWithPassword(f.username, f.password);
      setUser(res);
      e.submitter.innerHTML = "Login";
      f.reset();
    } catch (error) {
      e.submitter.innerHTML = "Login";
      e.submitter.disabled = false;
      console.error(error);
      f.reset();
    }
  });
  function logout() {
    api.authStore.clear();
    setUser(null);
  }
  registerFunction("logout", logout);

  if (!user) {
    return vhtml`
    <div class="hero w-full font-mono mt-16  p-5 rounded mx-auto ">
    ${await loginForm.render()}
    
    </div>
    
    `;
  } else {
    useEffect(async () => {
      async function fetchData() {
        try {
          let res = await api.collection("posts").getList(1, 10, {
            filter: ``,
            expand: "author",
            sort: "likes:length",
          });
          setPosts(res.items);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }

      fetchData();

      return () => {
        console.log("cleanup");
      };
    }, [postss]);

    const postPromises = postss.map((post) =>
      posts(
        {
          pid: post.id,
          description: post.content,
          image: post.file ? post.file : null,
          likes: post.likes,
          currentUser: api.authStore.model,
          user: post.expand.author,
        },
        post
      )
    );
    const renderedPosts = await Promise.all(postPromises);
    const postsHTML = renderedPosts.join("");

    return vhtml`
     
        <div class="justify-center mt-5 flex flex-row  gap-5">
            <img src="/src/public/assets/images/logo.png" class="w-8 
            ${postss.length < 1 ? "animate-spin" : "hidden"}
            " 
             id="logo"

            />
        </div>

        <div id="pinned" class="flex mx-2 fontmono flex-row gap-5 mt-5">
        <div class="avatar flex flex-col">
  <div class=" rounded-full flex flex-col btn btn-circle   ring ringskt-500 ring-offset-base-100 ring-offset-2">
    <div class="tooltip hover:tooltip-open tooltip-right" data-tip="Coming Soon Pinned Posts!">
     <img src="https://picsum.photos/id/1005/200" alt="avatar" class="   w-14 rounded-full">
    </div>
     
  </div>
  <span class="justify-center mt-2 mx-auto">Hazz</span>
  
</div>
        </div>
        <div class="divider"></div>
         
        <div class="mb-24 mt-6  z-[-1] flex justify-between flex-col gap-5 "
        id="posts"
        >
       ${
         postss.length > 1
           ? vhtml`
       ${postsHTML}
       `
           : vhtml`<span class="mx-auto flex justify-center loading loading-spinner mt-5 "></span>
      `
       }
            
        </div>
        ${await bottomnav(api.authStore.model)}
        
        `;
  }
}

export default home;
