export const Error = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Error</h1>
            <p className="text-lg font-semibold">Something went wrong</p>
            <span className="loading-dots mt-5"></span>
            <a href="#/home" className="btn btn-ghost hover:bg-transparent focus:bg-transparent mt-5"> Retry </a>
        </div>
    )
}