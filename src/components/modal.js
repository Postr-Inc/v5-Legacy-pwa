export const Modal = (props) => {
    return (
        <>
            <dialog id={props.id} className="modal  w-screen  modal-bottom sm:modal-middle">
                <form method="dialog" class="modal-box bg-white h-[100vh] w-screen
                overflow-y-none overflow-auto
                ">
               
                 {props.children}
                </form>
            </dialog>
        </>
    )
}