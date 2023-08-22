import { vhtml } from "vaderjs"

const bottomupmodal = (html) => {
    return vhtml`
    <dialog id="bottomupmodal" class="modal max-h-screen h-full modal-bottom sm:modal-middle">
    <form method="dialog" class="modal-box">
       ${vhtml`${html}`}
    </form>
  </dialog>
    `
}
export default bottomupmodal