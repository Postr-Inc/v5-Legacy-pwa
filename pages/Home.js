import { bottomnav } from "../components/bottomnav.js";
import loginForm from "../components/forms/loginForm.js";
import bottomupmodal from "../components/modal/bottomupmodal.js";
import p from "../components/posts.js";
import api from "../src/app.js";
import { component, vhtml, rf } from "../src/public/vader.js";

let currentVersion = '6.0 Beta';

const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) func.apply(context, args);
  };
};

const home = component('home', {
  render: (states, setState, useState, useEffect, useAuth) => {
    const [isLoggedin, setLogin] = useState('count', api.authStore.isValid);
    let [posts, setPosts] = useState('posts', []);
    let [page, setPage] = useState('page', 0); // Start from page 0
    let loading = false;

    function reset() {
      setPage(1);
      setPosts([]);
    }

    function changepage() {
      setPage(page + 1);
    }

    const handlePosts = async (pageToFetch) => {
      try {
        const res = await api.collection('posts').getList(pageToFetch, 10, {
          expand: 'author',
          sort: '-created',
          filter: `author.id != "${api.authStore.model.id}"`
        });

        if (res.items.length < 1 || pageToFetch > res.totalPages) {
          console.log('No more posts');
          reset();
          loading = false;
          return;
        }

        const newPosts = [...posts, ...res.items];
        setPosts(newPosts);

        loading = false;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    useEffect(() => {
      if (isLoggedin) {
        handlePosts(page);
      }
    }, [isLoggedin, page]);

    window.onscroll = debounce(() => {
      if (
        window.location.hash === '#/home' &&
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        window.innerHeight + window.scrollY <= document.body.offsetHeight + 100
      ) {
        changepage();
        handlePosts(page + 1); // Increment the page to fetch new posts
        loading = true;
        scrollTo(0, 0);
      }
    }, 1000);

    loginForm.on('submit', async (f, e) => {
      try {
        f.submitter.disabled = true;
        f.submitter.innerHTML = '<span class="loading"></span> Login';
        await api.collection('users').authWithPassword(e.username, e.password);
        window.location.reload();
      } catch (error) {
        setLogin(false);
      }
    });

    return vhtml`
      ${
        !isLoggedin ? vhtml`
          <div class="p-5">
            ${loginForm.render()}
          </div>
        ` :
        vhtml`
          ${
            !posts || posts.length < 1 ? vhtml`
              <div class="h-screen p-5 flex cursor-wait flex-col justify-center font-mono items-center">
                <img src="./src/public/assets/images/logo.png" class="w-16 mx-auto" />
                <h1 class="text-xl mt-2 fixed bottom-5">Postr ${currentVersion}</h1>
              </div>
            ` :
            vhtml`
              <div class="p-5">
                <div class="flex flex-row justify-between">
                  <div class="ring-2 ring-sky-500 rounded-full p-1">
                    <img src="https://picsum.photos/200/200" class="rounded-full w-12 h-12" />
                  </div>
                </div>
                <div class="divider"></div>
                <div class="flex flex-col gap-5">
                  ${
                    posts ? posts.map((post) => {
                      return p(post.id).render({ ...post, currentuser: api.authStore.model, api: api });
                    }).join(" ") : vhtml`
                     <span class="loading"></span>
                     `
                  }
                  ${bottomnav(api.authStore.model)}
                  ${bottomupmodal()}
                </div>
              </div>
            `
          }
        `
      }
    `;
  }
});


export default home;
