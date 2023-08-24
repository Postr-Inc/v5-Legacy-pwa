import { Modal } from "./modal";
import React, { useState, useRef, useEffect } from "react";
import { api } from "..";
export const Bottomnav = () => {
  let maxchar = 280;
  let [chars, setChar] = useState(0);
  let [image, setImage] = useState("");
  let [pContent, setPContent] = useState("");
  let [modalisOpen, setModalisOpen] = useState(false);
  let pRef = useRef();
  useEffect(()=>{
    if(pContent == ''){
      setChar(0)
    }
    
  }, [pContent])

  function createPost() {
    const data = {
        "author": api.authStore.model.id,
        "content":  pContent,
        "type":  "text",
        "likes":  JSON.stringify([]),
        "shares": JSON.stringify([]),
    };

    api.collection('posts').create(data).then((res)=>{
        window.location.reload()
        pRef.current.innerHTML = ''
        setChar(0)
        setImage('')
    })
  }  
  return (
    <div className=" fixed  bottom-[-1px]  left-0 ">
      <div className="  bg-white w-screen p-5">
        <div className="flex flex-row gap-5 justify-between   ">
          {window.location.hash === "#/" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill=""
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          )}

          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          {modalisOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
              onClick={() => {
                document.getElementById("newpost").showModal();
                setModalisOpen(true);
              }}
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          ) : (
            <svg
              onClick={() => {
                document.getElementById("newpost").showModal();
                setModalisOpen(true);
              }}
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}
          {window.location.hash === "#/notifications" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
              onClick={() => {
                window.location.hash = "#/";
              }}
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                window.location.hash = "#/notifications";
              }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      </div>
      <Modal id="newpost">
        <button
          className="flex justify-center mx-auto focus:outline-none"
          onClick={() => {
            setModalisOpen(false);
          }}
        >
          <div className="divider  text-slate-400  w-12   mt-0"></div>
        </button>
        <div className={`flex gap-5   mt-2 flex-col  overflow-hidden h-5/6`}>
          <div className="flex flex-row gap-4 w-full">
            <img
              src={`https://postr.pockethost.io/api/files/_pb_users_auth_/${api.authStore.model.id}/${api.authStore.model.avatar}`}
              className="rounded-full w-12 h-12"
              alt={api.authStore.model.username + "'s avatar"}
            />
            <h1>@{api.authStore.model.username}</h1>
          </div>
          <p
            contentEditable
            className={`w-full font-mono focus:outline-none resize-none overflow-hidden text-slate-900 placeholder-slate-300
        before:text-slate-300
        max-h-[5rem] overflow-y-auto`}
            placeholder="What's on your mind?"
            ref={pRef}
            onInput={(e) => {
                let text = e.target.innerHTML;
                let charCount = text.length;
            
                if (charCount > maxchar) {
                    e.target.innerText = text.slice(0, maxchar); // Truncate text
                    charCount = maxchar;
                } 
                
                let sanitized = Sanitization(e.target.innerHTML) 
                sanitized = new DOMParser().parseFromString(sanitized, 'text/html').querySelector('body').innerText
                setPContent(sanitized);
               
                 
                setChar(charCount);
            }}
         
            
            
            
            onBlur={(e) => {
              let text = e.target.innerHTML;
              let charCount = text.length;

              if (charCount > maxchar) {
                e.target.innerText = text.slice(0, maxchar); // Truncate text
                charCount = maxchar;
              }
           
                let sanatized = Sanitization(e.target.innerHTML)
                let emojis = handleEmojis(sanatized)
                setPContent(emojis.replace(/<br>/g, ''));
              
                setChar(charCount);
                pRef.current.innerHTML = emojis.replace(/<br>/g, '');
            }}
           
          ></p>

          {image ? (
            <img
              src={image}
              className="w-full h-full object-cover rounded-md  "
              alt="post image"
            />
          ) : (
            <></>
          )}
          {!image ? (
            <label htmlFor="file">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mb-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
          ) : (
            <></>
          )}
          <input
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              let file = e.target.files[0];
              let url = URL.createObjectURL(file);
              setImage(url);
              e.target.value = "";
            }}
          />
        </div>

        <div
          className=" absolute  w-full flex flex-row justify-between 
                left-0
                p-5

                     
                    "
        >
          <span
            className={`
                         ${
                           chars === maxchar ? "text-red-500" : "text-slate-500"
                         } text-sm
                        `}
          >
            {chars}/{maxchar}
          </span>
          {image ? (
            <span
              className="text-sky-500 text-sm"
              onClick={() => {
                setImage("");
              }}
            >
              Clear Image
            </span>
          ) : (
            <></>
          )}
          <span className="text-sky-500 text-sm"
          onClick={createPost}
          >Post</span>
        </div>
      </Modal>
    </div>
  );
};

function Sanitization(data) {
    let parser = new DOMParser();
    if (window.Sanitizer) {
    
       let doc = parser.parseFromString(data, 'text/html');
        
       let defaultConfig = {
          allowElements: [
            'div',
            'span',
            'p',
            'em',
            'b',
            'strong',
            'i',
            'h1'
          ],
          blockElements: [
            'script',
            'style',
            'iframe',
            'embed',
            'a',
            'img'
          ],
          dropElements: [],
          allowAttributes: {},
          dropAttributes: {},
          allowCustomElements: true,
          allowComments: true
       };
       let combinedConfig =  defaultConfig;
       
       let sanitizer = new window.Sanitizer(combinedConfig);
       let unsanitized_string = data;
       // replace &lt; and &gt; with < and >
       unsanitized_string = unsanitized_string.replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>');
  
       unsanitized_string = handleEmojis(unsanitized_string);
       doc.body.setHTML(unsanitized_string, { sanitizer });
     
       return doc.body.innerText
    } else if(!window.Sanitizer){
       console.warn('User does not have access to the Sanitizer API likely unsupported at this time');
       return data;
    }else{
       return data;
    }
  }
  function handleEmojis(html){
    let parser = new DOMParser();
    let defaults = {
       ":thumbsup:": "👍",
       ":thumbsdown:": "👎",
       ":heart:": "❤️",
       ":broken_heart:": "💔",
       ":star:": "⭐",
       ":star2:": "🌟",
       ":exclamation:": "❗",
       ":question:": "❓",
       ":warning:": "⚠️",
       ":poop:": "💩",
       ":clap:": "👏",
       ":muscle:": "💪",
       ":pray:": "🙏",
       ":smile:": "😄",
       ":smiley:": "😃",
       ":grin:": "😀",
       ":laughing:": "😆",
       ":sweat_smile:": "😅",
       ":joy:": "😂",
       ":rofl:": "🤣",
       ":relaxed:": "☺️",
       ":ok_hand:": "👌",
       ":100:": "💯",
    }
     
    let emojis =  defaults;
    
    let doc = parser.parseFromString(html, 'text/html');
    let c = doc.body;
    let h = c.innerHTML;
    for (const emoji in emojis) {
       if(!emoji.startsWith(':') || !emoji.endsWith(':')){
          throw new Error('Emoji must be in the format :emoji:')
 
       }
       if (Object.hasOwnProperty.call(emojis, emoji)) {
         let value = emojis[emoji];
           // set to an img element if a path
           if(value.startsWith('http') || value.startsWith('www') || value.startsWith('./')){
             value = `<img src="${value}" width="32px" height="32px" />`
           }
          h = h.replaceAll(emoji, value);
       }
    }
    c.innerHTML = h;
    return doc.documentElement.innerHTML;
 }
