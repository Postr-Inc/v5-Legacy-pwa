import { api } from "..";
import React, { useState } from "react";
import verified from "../icons/verified.png";
import { Modal } from "./modal";
export function Post(props) {
  const [likes, setLikes] = useState(props.likes);
  let [hidden, setHidden] = useState(false);
  let [isPinned, setIsPinned] = useState(props.pinned);
  function likepost() {
    if (likes.includes(api.authStore.model.id)) {
      let index = likes.indexOf(api.authStore.model.id);
      likes.splice(index, 1);
      setLikes([...likes]);
      api.collection("posts").update(props.id, {
        likes: likes,
      });
    } else {
      setLikes([...likes, api.authStore.model.id]);
      api.collection("posts").update(props.id, {
        likes: [...likes, api.authStore.model.id],
      });
    }
  }
  function repost() {
    if (props.author.id === api.authStore.model.id) {
      return;
    }
  }
   
  function debounce(fn, time) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, time);
    };
  }

  return hidden ? (
    <div className="alert bg-[#f3f6f4] flex flex-row">
      <span>This Post is hidden</span>
      <button
        onClick={() => {
          setHidden(false);
        }}
        className="btn-close  text-[#adadad] font-bold ml-auto"
      >
        Undo
      </button>
    </div>
  ) : (
    <div className="flex flex-col text-sm mb-[35px]  ">
      <div className="flex flex-row ">
        {props.author.avatar ? (
          <img
            src={`https://postr.pockethost.io/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`}
            className="w-8 h-8 rounded-full object-cover"
            alt="post image"
          />
        ) : (
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-8">
              <span className="text-xs">
                {props.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <span
          className="mx-2 font-bold  cursor-pointer "
          style={{ marginLeft: ".8rem", marginRight: ".2rem" }}
          onClick={() => {
            window.location.hash = `#/profile/${props.author.id}`;
          }}
        >
          {props.author.username}
        </span>
        {props.author.validVerified ? (
          <img
            src={verified}
            className="mt-1"
            style={{ width: "14px", height: "14px" }}
          />
        ) : (
          <></>
        )}
        <div className="dropdown dropdown-left absolute end-5 ">
          <div className="flex text-sm flex-row gap-5">
            <span className="text-gray-500 text-sm">
              {parseDate(props.created)}
            </span>
            <label tabIndex="0" className="flex text-gray-500   cursor-pointer">
              •••
            </label>
          </div>
          <ul
            tabIndex="0"
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <span
                onClick={() => {
                  navigator.share({
                    title: `View ${props.author.username}'s post on Postr!`,
                    text: props.content,
                    url: window.location.href,
                  });
                }}
                className="cursor-pointer"
              >
                Share
              </span>
            </li>
            <li>
              <a>Report</a>
            </li>
            <li>
              <a
                onClick={() => {
                  setHidden(true);
                }}
              >
                Hide
              </a>
            </li>
            {props.author.id === api.authStore.model.id ? (
              <li>
                <a
                  onClick={() => {
                    props.ondelete();
                  }}
                >
                  Delete
                </a>
              </li>
            ) : (
              <></>
            )}
         
              {
                window.location.hash === "#/home" ? (
                    <li>
                    <a
                    onClick={() => {
                      document.getElementById("moreinfo" + props.id).showModal();
                    }}
                  >
                    Why am I seeing this?
                  </a>
                    </li>
                ) : (
                    <></>
                    )
              }
           
           
          </ul>
        </div>
      </div>
      <p
        className="mt-6 text-sm"
        ref={(el) => {
          if (el) {
            el.innerHTML = props.content;
          }
        }}
      ></p>
      {props.file ? (
        <img
          src={`https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
          className="w-full h-96 object-cover rounded-md mt-5 cursor-pointer"
          alt="post image"
          onClick={() => {
            document.getElementById("modal" + props.id).showModal();
          }}
        />
      ) : (
        <></>
      )}
      {props.file ? (
        <Modal id={"modal" + props.id} height="h-screen">
          <button className="flex justify-center mx-auto focus:outline-none">
            <div className="divider  text-slate-400  w-12   mt-0"></div>
          </button>
          <img
            src={`https://postr.pockethost.io/api/files/w5qr8xrcpxalcx6/${props.id}/${props.file}`}
            className="w-full p-2 h-full object-cover rounded  "
            alt="post image"
          />
        </Modal>
      ) : (
        ""
      )}
      <Modal id={"moreinfo" + props.id} height="h-75">
        <button className="flex justify-center mx-auto focus:outline-none">
          <div className="divider  text-slate-400  w-12   mt-0"></div>
        </button>
        <h1 className="text-md justify-center flex mx-auto font-bold">
          Why You're Seeing This Post
        </h1>
        <span className="text-md justify-center mt-5 flex mx-auto ">
            There are various reasons why you may see content on your feed. Postr shows posts based on who you follow.
        </span>
        <div className="flex mt-6  gap-5 items-center">
          <div class="avatar placeholder">
            <div class=" ring-2 ring-slate-200 rounded-full w-12 h-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
</svg>

            </div>
          </div> 
          <p className="text-sm ">
            This post was made by {props.author.username} and was posted on{" "}
            {new Date(props.created).toDateString()}.
          </p>
        </div>

        {props.author.followers.includes(api.authStore.model.id) ? (
          <div className="flex gap-5 items-center">
            {
                props.author.avatar ? (
                    <img
                    src={`https://postr.pockethost.io/api/files/_pb_users_auth_/${props.author.id}/${props.author.avatar}`}
                    className="w-12 h-12 rounded-full object-cover mt-5"
                  />
                ) : (
                    <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-12 h-12">
                      <span className="text-xs">
                        {props.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    </div>
                )
            }
            <p className="text-lg mt-5">
              You are following {props.author.username}.
            </p>
          </div>
        ) : (
           <></>
        )}
      </Modal>
      <div className="flex flex-row gap-5 mt-6">
        {
          /**
           * @Icon
           * @name:  like
           * @description:  like icon
           * @function: likes_{props.id}
           */ ""
        }
        <svg
          onClick={debounce(likepost, 1000)}
          xmlns="http://www.w3.org/2000/svg"
          fill={likes.includes(api.authStore.model.id) ? "#F13B38" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke={
            likes.includes(api.authStore.model.id) ? "#F13B38" : "currentColor"
          }
          className="w-6 h-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>

        {
          /**
           * @Icon
           * @name: comment
           * @description:  comment icon
           */ ""
        }

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
          />
        </svg>

        {
          /**
           * @Icon
           * @name: repost
           * @description: repost icon
           */ ""
        }

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          onClick={repost}
        >
          <path
            fillRule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="mt-5">
        <span>
          {" "}
          {likes.length > 1 ? likes.length + " likes" : likes.length + " like"}
        </span>
      </div>
    </div>
  );
}

function parseDate(data) {
  const date = new Date(data);
  const now = new Date();
  const diff = now - date;
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30.44; // An average month length in days
  const years = months / 12;

  if (seconds < 60) {
    return "just now";
  }
  if (minutes < 60) {
    return Math.round(minutes) + "m";
  }
  if (hours < 24) {
    return Math.round(hours) + "h";
  }
  if (days < 7) {
    return Math.round(days) + "d";
  }
  if (weeks < 4) {
    return Math.round(weeks) + "w";
  }
  if (months < 12) {
    return Math.round(months) + "m";
  }
  if (years >= 1) {
    return Math.round(years) + "y";
  }
}
