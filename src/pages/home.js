import React, { useEffect, useState } from "react";
import { api } from "..";
import logo from "../images/logo.png";
import googleIcon from "../images/googleicon.png";
import { Post } from "../components/post";
import { Bottomnav } from "../components/bottomnav";
import { Modal } from "../components/modal";
import loginback from "../images/loginback.png";
let currentVersion = "6.0 Beta";
function debounce(fn, time) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, time);
  };
}

const Home = () => {
  let [isLogin, setIsLogin] = useState(false);
  let [btnstate, setBtnState] = useState("Login");
  let [posts, setPosts] = useState([]);
  let [page, setPage] = useState(1);
  let [isLoadMore, setIsLoadMore] = useState(false);
  let [totalPosts, setTotalPosts] = useState(0);
  let [hasLoaded, setHasLoaded] = useState(sessionStorage.getItem('hasLoaded') || false)

  document.title = `Postr ${currentVersion}`;
  function login(e) {
    e.preventDefault();

    const data = api
      .collection("users")
      .authWithOAuth2({
        provider: "google",
        createData: {
          bio: "I am new to Postr!",
          followers: [],
        },
        urlCallback: (url) => {
          if (window.matchMedia("(display-mode: standalone)")) {
            let w = window.open();
            w.location.href = url;
          } else {
            window.open(
              url,
              " _blank",
              "location=yes,height=570,width=520,scrollbars=yes,status=yes"
            );
          }
        },
      })
      .then((res) => {
        if (!res) {
          setBtnState("aborted");
          return;
        }
      });
    setBtnState("Logging in...");
    data.then((res) => {
      if (res && res.meta.isNew) {
        let form = new FormData();
        let url = res.meta.avatarUrl;
        let username = res.meta.username;
        form.append("username", username);

        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            form.append("avatar", blob);
            api.collection("users").update(data.record.id, form);
          });
      }
      setIsLogin(true);
    });

    setTimeout(() => {
      if (!isLogin) {
        setBtnState("Login");
        console.log("aborted");
      }
    }, 6000);
  }

  function loadPosts() {
    if (api.authStore.isValid) {
      setIsLoadMore(true);
     return api
        .collection("posts")
        .getList(page, 10, {
          expand: "author, likes_2.0",
          sort: "likes",
          filter: `author.followers ~ "${api.authStore.model.id}" || author.id  != "${api.authStore.model.id}"`,
        })
        .then((res) => {
          setTotalPosts(res.totalPages);
          setPosts((prevPosts) => [...prevPosts, ...res.items]);
           
        });
      

      
    }
  }

  // load posts on mou nt

  useEffect(() => {
    if (api.authStore.isValid) {
      api.collection("users").authRefresh();

      loadPosts().then(() => {
        setIsLoadMore(false);
        setHasLoaded(true);
        sessionStorage.setItem('hasLoaded', true)
      });
      
    }
  }, [api.authStore.isValid]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (Number(page) === Number(totalPosts) && !isLoadMore) {
        return;
      }

      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 5 &&
        !isLoadMore
      ) {
        // Increment the page in a callback to ensure proper state update
        setPage(++page);

        loadPosts();
      }
    }, 1000);

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isLoadMore, totalPosts]);

  return api.authStore.isValid ? (
      !hasLoaded ? (
      <div className="h-screen p-5 flex cursor-wait flex-col justify-center font-mono items-center">
        <img src={logo} className="w-16 mx-auto" />
        <h1 className="text-xl mt-2 fixed bottom-5">Postr {currentVersion}</h1>
      </div>
    ) : (
      <div className="p-5 mt-2">
        <div className="flex flex-col gap-5" key="postcontainer">
          {posts.map((p) => {
            return (
              <div key={p.id} className="p-2">
                <Post
                  content={p.content}
                  author={p.expand.author}
                  file={p.file}
                  likes={p.likes}
                  id={p.id}
                  created={p.created}
                />
              </div>
            );
          })}
        </div>

        <Bottomnav />
      </div>
    )
  ) : (
    <div
      className="hero min-h-screen p-5"
      style={{ backgroundImage: `url('${loginback}')` }}
    >
      <div
        className="hero-content     flex flex-col text-white"
        style={{ marginTop: "10vh" }}
      >
        <button
          className="btn btn-md   6 max-w-md border-slate-200"
          style={{
            maxWidth: "80vw",
            width: "65vw",
            position: "absolute",
            top: "65vh",
          }}
          onClick={login}
          {...(btnstate === "Logging in..."
            ? {
                style: {
                  opacity: 0.5,
                  maxWidth: "80vw",
                  width: "65vw",
                  position: "absolute",
                  top: "65vh",
                },
              }
            : {})}
        >
          <img src={googleIcon} className="w-6 h-6 " />
          {btnstate !== "Logging in..." || btnstate === "aborted" ? (
            <span className="ml-2">Login with Google</span>
          ) : (
            <span className="ml-2">Logging in...</span>
          )}
        </button>
      </div>
    </div>
  );
};
export default Home;
