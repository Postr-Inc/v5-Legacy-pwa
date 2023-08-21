import { vhtml } from "vaderjs"

const bottomupmodal = () => {
    return vhtml`
    <dialog id="bottomupmodal" class="modal max-h-screen h-full modal-bottom sm:modal-middle">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Hello!</h3>
      <p class="py-4">Press ESC key or click the button below to close</p>
      <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </div>
    </form>
  </dialog>
    `
}
export default bottomupmodal