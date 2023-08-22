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

function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to await the visibility of an element
function awaitElement(target) {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === document.body) {
          observer.disconnect();
          const targetElement = document.querySelector(target);
          if (targetElement) {
            resolve(targetElement); // Target element is now visible within body
          } else {
            resolve(null); // Target element not found
          }
        }
      });
    });

    observer.observe(document.body);
  });
}



const home = component('home', {
  render: (states, setState, useState, useEffect, useAuth) => {
    const [isLoggedin, setLogin] = useState('count', api.authStore.isValid);
    let [allPosts, setAllPosts] = useState('allPosts', []); // Store all posts in one array
    let [page, setPage] = useState('page', 1); // Start from page 0
    let loading = false;
    let fetchingPosts = false;

    function reset() {
      setPage(1);
      setAllPosts([]);
    }

    function changepage() {
       page = page + 1;
        setPage(page);
    }

    const handlePosts = async (pageToFetch) => {
      try {
        if (fetchingPosts) return;
        const res = await api.collection('posts').getList(pageToFetch, 10, {
          expand: 'author',
          sort: '-created',
          filter: `author.id != "${api.authStore.model.id}"`
        });
        fetchingPosts = true;
    
        if (res.items.length < 1 || pageToFetch > res.totalPages) {
          console.log('No more posts');
          reset();
          loading = false;
          return;
        }
    
        const newPosts = [...allPosts, ...res.items]; // Combine existing and new posts
        // remove duplicates
        const uniquePosts = newPosts.filter((post, index, self) => self.findIndex((p) => p.id === post.id) === index);
        setAllPosts(uniquePosts);
       
      
        
    
      
    
        loading = false;
        fetchingPosts = false;
         
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
        document.querySelector('.loading').classList.remove('hidden');
        changepage();
        loading = true;
     
        handlePosts(page);
     
        document.querySelector('.loading').classList.add('hidden');
        loading = false;
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
    allPosts = allPosts.filter((post) => post !== undefined);
   
    let content =   vhtml`
    ${
      !isLoggedin ? vhtml`
        <div class="p-5">
          ${loginForm.render()}
        </div>
      ` :
      vhtml`
        ${
          !allPosts || allPosts.length < 1 ? vhtml`
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
              <div class="flex flex-col gap-5" id="postcontainer">
                <span class="loading flex justify-center mx-auto mt-26 hidden"></span>
                ${allPosts.map((post) => {
                  if (!document.getElementById(post.id)) {
                    return p(post.id).render({ ...post, currentuser: api.authStore.model, api: api });
                  }
                }).join(" ")}
                ${bottomnav(api.authStore.model)}
                ${bottomupmodal()}
              </div>
            </div>
          `
        }
      `
    }
  `;

    return  content
  }
});



export default home;
