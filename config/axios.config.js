// axios
import axios from 'axios'

// cookieJs
import cookieJs from 'js-cookie'



// get token
const token = cookieJs.get('BT_Auth_Token')



// axios intercept
axios.interceptors.request.use((config) => {

    // get token
    if (token) {

        // config 
        config.headers.authorization = token
    }


    return config
})







// export
export default axios