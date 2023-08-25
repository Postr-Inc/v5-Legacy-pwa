const Download = () => {
    let device = navigator.userAgent.toLowerCase()
    let isAndroid = device.indexOf("android") > -1
    let isIOS = device.indexOf("iphone") > -1 || device.indexOf("ipad") > -1
    let isMac = device.indexOf("macintosh") > -1
    let isWindows = device.indexOf("windows") > -1
    let isLinux = device.indexOf("linux") > -1
    let isChrome = device.indexOf("chrome") > -1
    let isFirefox = device.indexOf("firefox") > -1
    let isSafari = device.indexOf("safari") > -1
    let isOpera = device.indexOf("opera") > -1

    return(
        <div>
            
        </div>
    )
}