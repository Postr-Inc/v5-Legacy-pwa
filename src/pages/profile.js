import { api } from "..";
import { Bottomnav } from "../components/bottomnav";
import back from "../icons/backarrow.svg";
import React, { useEffect, useState } from "react";
import verified from "../icons/verified.png";
import { Post } from "../components/post";
import { Modal } from "../components/modal";
function debounce(fn, time) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, time);
  };
}
export const Profile = (user) => {
  let [profile, setProfile] = useState({});
  let [posts, setPosts] = useState([]);
  let [page, setPage] = useState(1);
  let [isLoadMore, setIsLoadMore] = useState(false);
  let [totalPosts, setTotalPosts] = useState(0);
  let [isFollow, setIsFollow] = useState(false);
  let [followers, setFollowers] = useState([]);
  let [hasRequested, setHasRequested] = useState(false);
  let [pageSelected, setPageSelected] = useState("posts");
  if (!api.authStore.isValid) {
    window.location.hash = "#/home";
  }
  function profileData() {
    api
      .collection("users")
      .getOne(user.user)
      .then((res) => {
        setProfile(res);
        setIsFollow(
          res.followers ? res.followers.includes(api.authStore.model.id) : false
        );
        setFollowers(res.followers ? res.followers : []);
      });
  }
  function Follow() {
    if (isFollow) {
      let index = followers.indexOf(api.authStore.model.id);
      followers.splice(index, 1);
      setFollowers([...followers]);
      api.collection("users").update(user.user, {
        followers: followers,
      });
      setIsFollow(false);
    } else {
      setFollowers([...followers, api.authStore.model.id]);
      api.collection("users").update(user.user, {
        followers: [...followers, api.authStore.model.id],
      });
      setIsFollow(true);
    }
  }
  function fetchPosts() {
    api
      .collection("posts")
      .getList(page, 10, {
        filter: `author.id ="${user.user}"`,
        expand: "author",
        sort: "-created",
      })
      .then((res) => {
        setPosts((prevPosts) => [...prevPosts, ...res.items]);
        setTotalPosts(res.totalPages);

        setIsLoadMore(false);
      });
  }

  // load posts on mou nt

  useEffect(() => {
    setProfile({});
    profileData();
  }, [user.user]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts();
  }, [user.user]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (profile.Isprivate && !isFollow) {
        return;
      }
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

        fetchPosts();
      }
    }, 1000);

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isLoadMore, totalPosts]);
  document.title = `@${profile.username} - Postr`;
  return (
    <>
      <div className=" p-5 flex flex-row justify-between">
        <div
          className="flex flex-row
          cursor-pointer
          "

          onClick={() => {
            window.history.back();
          }}
        >
          <img src={back} width={25} height={25}></img>
        </div>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            if (
              window.location.hash.split("#/profile/")[1] ===
              api.authStore.model.id
            ) {
              window.location.hash = "#/settings";
            } else {
              window.options.showModal();
            }
          }}
        >
          •••
        </div>
      </div>
      <div className="flex flex-col  p-5 gap-2">
        <div className="flex flex-row  justify-between gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">{profile.username}</h1>
              <span className="text-gray-500 text-sm ">
                @{profile.username}
              </span>
            </div>
            <span
              className="text-gray-500 
        w-[80vw] max-w-[80vw] 
        "
            >
              {profile.bio}
            </span>
            <span className="text-gray-500 text-sm ">
              Followed by {followers ? followers.length : 0}{" "}
              {followers.length === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="indicator  absolute end-5">
            {profile.avatar ? (
              <img
                src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full  avatar"
              />
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-16">
                  <span className="text-lg">
                    {profile.username
                      ? profile.username.charAt(0).toUpperCase()
                      : ""}
                  </span>
                </div>
              </div>
            )}

            {profile.validVerified ? (
              <img
                src={verified}
                className="w-5 h-5 absolute bottom-0  left-0
            rounded-full
             
            "
              />
            ) : (
              ""
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-row gap-5 w-[42vw] mt-5">
            {user.user === api.authStore.model.id ? (
              <>
                <button
                  className="bg-[#121212] w-full btn btn-sm   text-white rounded-md  "
                  onClick={() => {
                    document.getElementById("editprofile").showModal();
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
                  onClick={() => {
                    navigator.share({
                      title: `Follow ${profile.username} on Postr!`,
                      text: profile.bio,
                      url: window.location.href,
                    });
                  }}
                >
                  Share
                </button>
              </>
            ) : (
              <>
                {profile.Isprivate && !isFollow ? (
                  <>
                    <button
                      className={`${
                        hasRequested
                          ? "text-[#12121212] btn-ghost border-slate-400"
                          : "bg-[#121212] text-white"
                      } w-full btn btn-sm   rounded-md  `}
                      onClick={() => {
                        alert("Request sent!");
                      }}
                    >
                      {hasRequested ? "Requested" : "Request Access"}
                    </button>
                    <button
                      className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
                      onClick={() => {
                        window.newpost.showModal();
                        document.getElementById(
                          "post"
                        ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}"> @${profile.username}<a/>`;
                      }}
                    >
                      Mention
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${
                        isFollow
                          ? "text-[#121212] btn-ghost border-slate-400"
                          : "bg-[#121212] text-white"
                      } w-full btn btn-sm   rounded-md  `}
                      onClick={debounce(Follow, 1000)}
                    >
                      {isFollow ? "Unfollow" : "Follow"}
                    </button>
                    <button
                      className="btn btn-sm btn-ghost w-full border-slate-400 text-[#121212] rounded-md "
                      onClick={() => {
                        window.newpost.showModal();
                        document.getElementById(
                          "post"
                        ).innerHTML = `<a class="text-sky-500" href="#/profile/${profile.id}"> @${profile.username}<a/>`;
                      }}
                    >
                      Mention
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className=" mt-6 flex flex-row justify-evenly">
          <a 
          id="posts"
          className={`tab w-full tab-bordered
          ease-out  
          ${pageSelected === "posts" ? "ease-in tab-active" : ""}
          
          `}
            onClick={()=>{
                setPageSelected("posts")
            }}
          
          >Postrs</a>
          <a className={`tab w-full tab-bordered
           ease-out
            ${pageSelected === "saved" ? "ease-in tab-active" : ""}
        `  
        }
        onClick={()=>{
            setPageSelected("saved")
        }}
          id="reposts"
          >Saved</a>
          <a className={`tab w-full tab-bordered
          ease-out
          
            ${pageSelected === "media" ? "ease-in tab-active" : ""}
            
          `}
            onClick={()=>{
                setPageSelected("media")
            }}

          id="media"
          > Media</a>
        </div>

        <div className="flex flex-col gap-5 mt-12">
          {posts.length < 1 || (profile.Isprivate && !isFollow) ? (
            <div className="flex flex-col justify-center  items-center mx-auto mt-8 gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>

              <h1 className="text-xl mt-2">
                {profile && profile.Isprivate && !isFollow
                  ? "This account is private"
                  : "No posts yet"}
              </h1>
            </div>
          ) : (
            <div>
              {posts.map((p) => {
                let id = Math.random() * 100000000000000000;

                return (
                  <div key={id} className="mb-16">
                    <Post
                      content={p.content}
                      author={p.expand.author}
                      file={p.file}
                      likes={p.likes}
                      id={p.id}
                      created={p.created}
                      pinned={p.pinned}
                      repostedBy={p.expand.repostedBy}
                      OriginalAuthor={p.expand.OriginalAuthor}
                      ondelete={() => {
                        window["delete" + id].showModal();
                      }}
                      comments={p.comments}
                    />
                    <Modal id={"delete" + id} height="h-96">
                      <button className="flex justify-center mx-auto focus:outline-none">
                        <div className="divider  text-slate-400  w-12   mt-0"></div>
                      </button>
                      <div className="flex-col text-sm mt-8 flex">
                        <div className="form-control w-full ">
                          <label className="label flex text-lg flex-row">
                            Please confirm that you want to delete this post -
                            this action cannot be undone.
                          </label>
                        </div>
                        <div className="flex flex-row gap-5 mt-5">
                          <a
                            onClick={() => {
                              document.getElementById("delete" + id).close();
                            }}
                            className="absolute bottom-5 cursor-pointer text-sky-500 text-sm left-5 "
                          >
                            Cancel
                          </a>
                          <></>
                          <a
                            onClick={debounce(() => {
                              api.collection("posts").delete(p.id);
                              let index = posts.indexOf(p);
                              posts.splice(index, 1);
                              setPosts([...posts]);
                              document.getElementById("delete" + id).close();
                            }, 1000)}
                            className="absolute bottom-5 text-sky-500 cursor-pointer text-sm end-5 "
                          >
                            Delete
                          </a>
                        </div>
                      </div>
                    </Modal>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Modal id="editprofile" height="h-screen">
        <button className="flex justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400  w-12   mt-0"></div>
        </button>
        <div className="flex-col text-sm mt-8 flex">
          <div className="form-control w-full ">
            <label className="label flex flex-row">
              <span className="label-text font-bold text-sm">Name</span>
              <label htmlFor="profileinput">
                <img
                  src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`}
                  id="profilepicin"
                  className="rounded-full w-12 h-12 absolute end-5 "
                  alt="Avatar"
                />
              </label>

              <input
                type="file"
                className="hidden"
                id="profileinput"
                accept="image/*"
                onChange={(e) => {
                  debounce(() => {
                    let file = e.target.files[0];
                    let form = new FormData();

                    form.append("avatar", file);
                    api
                      .collection("users")
                      .update(profile.id, form)
                      .then((res) => {
                        document.getElementById(
                          "profilepicin"
                        ).src = `https://postrapi.pockethost.io/api/files/_pb_users_auth_/${profile.id}/${res.avatar}`;
                      });
                  }, 1000);
                }}
              />
            </label>
            <input
              type="text"
              placeholder={profile.username}
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300   focus:outline-none focus:ring-0"
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
              }}
              name="username"
            />
            <label className="label mt-5">
              <span className="label-text font-bold text-sm">Bio</span>
            </label>
            <input
              type="text"
              placeholder="Owner of this app :}"
              className="border-t-0 p-2 border-r-0 border-l-0 border-b-2 border-slate-300   focus:outline-none focus:ring-0"
              onChange={(e) => {
                setProfile({ ...profile, bio: e.target.value });
              }}
            />
            <div className="form-control   mt-5">
              <label className="label cursor-pointer">
                <span className="label-text">Private Profile</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={profile.Isprivate ? true : false}
                  onChange={(e) => {
                    setProfile({ ...profile, Isprivate: e.target.checked });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-5 mt-5">
            <a
              onClick={debounce(() => {
                api.collection("users").update(profile.id, {
                  username: profile.username,
                  bio: profile.bio,
                  Isprivate: profile.Isprivate,
                });
                document.getElementById("editprofile").close();
              }, 1000)}
              className="absolute bottom-5 text-sky-500 text-sm end-5 "
            >
              Done
            </a>
          </div>
        </div>
      </Modal>
      <div className="mt-8">
        <Bottomnav />
      </div>
    </>
  );
};
