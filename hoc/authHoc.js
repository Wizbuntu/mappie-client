import { useEffect, useState } from 'react'

// Footer
import Footer from '../components/Footer'

// axios
import axios from '../config/axios.config'

// useRouter
import { useRouter } from 'next/router'



// init AuthHoc component
const AuthHoc = (Component) => {
    return (props) => {

        // init router
        const router = useRouter()

        // init useState
        const [authData, setAuthData] = useState({})

        // init isLoading
        const [isLoading, setIsLoading] = useState(true)



        // init useEffect
        useEffect(() => {
            (async () => {
                try {

                    // make reques to verify user
                    const response = await axios.get(`${process.env.API_ROOT}/verify/auth/user`)

                    console.log(response.data)
                    
                    // if not success
                    if (!response.data.success) {

                        // return to login
                        return router.replace({ pathname: '/' })

                    }

                    // update isLoading
                    setIsLoading(false)

                    //update authData
                    setAuthData(response.data.data)

                } catch (error) {
                    console.log(error)
                    return router.replace({ pathname: '/' })
                }
            })()
        }, [])



        return (
            <>
                {isLoading ? <>
                    <div className="container py-4">
                        <p className="fw-normal">Loading...</p>
                    </div>
                </> : <>
                    <Component {...props} authData={authData} />
                    <Footer />
                </>}

            </>
        )
    }
}




// export AuthHoc
export default AuthHoc
