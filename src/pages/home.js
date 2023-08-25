import React, { useEffect, useState } from "react";
import { api } from "..";
import logo from "../images/logo.png";
import googleIcon from "../images/googleicon.png";
import { Post } from "../components/post";
import { Bottomnav } from "../components/bottomnav";
import { Modal } from "../components/modal";
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
  let [google, setGoogle] = useState(false);
  let [hasLoaded, setHasLoaded] = useState(false);
  document.title = `Postr ${currentVersion}`;
  function login(e) {
    e.preventDefault();
    if (!google) {
      let username = e.target[0].value;
      let password = e.target[1].value;
      if (username === "" || password === "") {
        alert("Please fill all fields");
        return;
      }
      setBtnState("loader");
      api
        .collection("users")
        .authWithPassword(username, password)
        .then((res) => {
          console.log(res);
          setIsLogin(true);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = api.collection("users").authWithOAuth2({
        provider: "google",
        createData: {
          bio: "I am new to Postr!",
          followers: [],
        },
      });
      data.then((res) => {
        if (res.meta.isNew) {
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
    }
  }
  function loadPosts() {
    if (api.authStore.isValid) {
      setIsLoadMore(true);
      api
        .collection("posts")
        .getList(page, 10, {
          expand: "author",
          sort: "-created",
          filter: `author.id !="${api.authStore.model.id}"`,
        })
        .then((res) => {
          setTotalPosts(res.totalPages);
          setPosts((prevPosts) => [...prevPosts, ...res.items]);
        });
      setIsLoadMore(false);
      return;
    }
  }

  useEffect(() => {
    loadPosts();
    setHasLoaded(true);
  }, []);

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

  return  api.authStore.isValid ? (
    posts.length === 0 && !hasLoaded ?   (
      <div className="h-screen p-5 flex cursor-wait flex-col justify-center font-mono items-center">
        <img src={logo} className="w-16 mx-auto" />
        <h1 className="text-xl mt-2 fixed bottom-5">Postr {currentVersion}</h1>
      </div>
    ) : (
      <div className="p-5">
        <div className="flex flex-row justify-between">
          <div className="ring-2 ring-sky-500 rounded-full p-1">
            <img
              src="https://picsum.photos/200/200"
              className="rounded-full w-12 h-12"
              alt="user image"
              onClick={() => {
                window.pinned.showModal();
              }}
            />
          </div>
          <div className="flex end-0 flex-row gap-5"></div>
        </div>
        <div className="divider"></div>
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
        <Modal id="pinned" height="h-screen">
          <button className="flex justify-center mx-auto focus:outline-none">
            <div className="divider  text-slate-400  w-12   mt-0"></div>
          </button>
          <div className="alert flex mb-5 bg-base-200 rounded-sm">
           <h1>Disclaimer: this feature is not ready yet!</h1>
          </div>
          <div className="flex flex-col gap-5 p-2">
            <div className="flex flex-row  gap-2">
              <img
                src="https://picsum.photos/200/200"
                className="rounded-full w-8 h-8"
              />
              <span className="text-gray-500 text-sm ">Rosie </span>
              <span className="text-gray-500 text-sm end-5 absolute">
                {" "}
                Pinned 1h ago
              </span>
            </div>

            <img
              src="https://dummyimage.com/600x1280/000/fff"
              className="rounded-md  w-full h-96 object-cover"
            />

            <div className="flex flex-row gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#F13B38"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#F13B38"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
            </div>
          </div>
        </Modal>
        <Bottomnav />
      </div>
    )
  ) : (
    <div className="flex flex-col  text-sm justify-center  font-mono ">
      <form
        onSubmit={login}
        className="flex mt-26 text-start flex-col   justify-center w-full p-5"
      >
        <div className="flex flex-row mx-auto gap-2">
          <img
            src={logo}
            width={30}
            height={30}
            className="mr-2"
            alt="Postr logo"
          />
          <h1 className="text-xl   ">Postr</h1>
        </div>

        <label className="label">Username</label>
        <input
          type="text"
          className="input input-bordered input-md border focus:outline-none border-gray-200 rounded-md p-2 w-full"
        />
        <label className="mt-2">Password</label>
        <input
          type="password"
          className="input input-bordered input-md focus:outline-none mt-2 border border-gray-200 rounded-md p-2 w-full"
        />
        <button
          type="submit"
          className="btn btn-ghost mt-2 border-slate-200 hover:cursor-pointer hover:bg-transparent hover:border-sky-500"
          {...(btnstate === "loader" ? { disabled: true } : {})}
        >
          {btnstate == "loader" ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            ""
          )}
          Login
        </button>
        <div className="mt-5">
          Dont have an account?{" "}
          <a href="#/register" className="text-sky-500">
            Signup
          </a>
        </div>
        <div className="divider">Or</div>
        <button
          onClick={() => {
            setGoogle(true);
          }}
          type="submit"
          className="btn btn-ghost mt-2  hover:cursor-pointer  border-slate-200"
          {...(btnstate === "loader" ? { disabled: true } : {})}
        >
          <img
            src={googleIcon}
            width={20}
            height={20}
            className="mr-2"
            alt="Google icon"
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
};
export default Home;
