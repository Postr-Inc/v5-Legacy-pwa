import  Pocketbase from './pb.js'
 
const pb = new Pocketbase('https://postr.pockethost.io')
pb.autoCancellation(false)
window.pb = pb

if(!pb.authStore.isValid){
    localStorage.removeItem('pocketbase_auth')
    window.location.href = '#/login'
}


 function appIsInstalled() {
    if ('getInstalledRelatedApps' in navigator) {
        navigator.getInstalledRelatedApps().then((installedApps) => {
            console.log(installedApps);
            if (installedApps.length > 0) {
                console.log('PWA is installed.');
            } else {
                console.log('PWA is not installed.');
            }
        }).catch((error) => {
            console.error('Error checking installed apps:', error);
        });
    } else {
        console.log('The getInstalledRelatedApps method is not supported.');
    }
}

appIsInstalled();
