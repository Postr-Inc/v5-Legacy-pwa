import React, { useState, useEffect } from "react";
import { api } from "..";
import back from "../icons/backarrow.svg";
import { Bottomnav } from "../components/bottomnav";

export const Search = () => {
  let [search, setSearch] = useState("");
  let [users, setUsers] = useState([]);
  let [isFollow, setIsFollow] = useState(false);
  
  function loadUsers() {
    api
      .collection("users")
      .getList(1, 10, {
        filter: `id != "${api.authStore.model.id}"`,
      })
      .then((res) => {
        setUsers(res.items);
      });
  }
 
  useEffect(() => {
    if (search) {
        console.log(search)
      api.collection('users').getFirstListItem(`username ~ "${search}"`).then((res)=>{
        setUsers([res])
      }).catch((err)=>{
        setUsers([])
      })
    }
  }, [search]);
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div className=" p-5 flex flex-col ">
      <span className="text-2xl font-bold">Search</span>
      <div class="form-control mt-2">
        <div class="input-group aliggn-">
          <button class=" border-r-0 input-group-xs border  focus:bg-transparent hover:bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mx-2 h-4 w-4 border-l-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            onChange={(e) => {
                setSearch(e.target.value);
            }}
            placeholder="Search…"
            class="
    w-screen
    input
     border-l-0
     focus:outline-none
    border-slate-200 input-sm  "
          />
        </div>

        {users.map((u) => {
            
          return (
            <div className="flex flex-col mt-6 gap-2">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row">
                  {u.avatar ? (
                    <img
                      src={`https://postrapi.pockethost.io/api/files/_pb_users_auth_/${u.id}/${u.avatar}`}
                      className="w-8  h-8 rounded-full"
                    />
                  ) : (
                    <img src="https://postrapi.pockethost.io/api/files/_pb_users_auth_/default/default.png" />
                  )}
                  <div className="flex flex-col">
                    <span className="mx-2 text-sm cursor-pointer"
                    onClick={ ()=>{
                        window.location.href = `#/profile/${u.id}`
                    }}
                    >{u.username}</span>
                    <span className="mx-2 text-sm text-slate-400">{u.bio}</span>
                  </div>
                  <button
  className="btn-ghost rounded btn-sm w-24 end-5 absolute border-slate-200 hover:text-white focus:ring-0 hover:ring-0 hover:bg-transparent focus:bg-transparent"
  onClick={() => {
    const updatedFollowers = u.followers.includes(api.authStore.model.id)
      ? u.followers.filter(id => id !== api.authStore.model.id)
      : [...u.followers, api.authStore.model.id];

    api.collection("users")
      .update(u.id, {
        followers: updatedFollowers,
      })
      .then(() => {
        u.followers = updatedFollowers;
        setIsFollow(!isFollow); // Toggle the isFollow state
      })
      .catch(error => {
        console.error("Error updating followers:", error);
      });
  }}
>
  {u.followers.includes(api.authStore.model.id) ? "Unfollow" : "Follow"}
</button>

                </div>
              </div>

              <div className="divider  rounded h-1"></div>
            </div>
          );
        })}
      </div>
      <div className="mt-12">
        <Bottomnav />
      </div>
    </div>
  );
};
