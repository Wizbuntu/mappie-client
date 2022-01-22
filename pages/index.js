import { useEffect, useState } from 'react'

// toast
import { Toaster, toast } from 'react-hot-toast'

// validator
import isEmail from 'validator/lib/isEmail'

// axios
import axios from 'axios'

// cookieJs
import cookieJs from "js-cookie"

// router
import { useRouter } from 'next/router'



// init Home component
const Home = () => {

  // init router
  const router = useRouter()

  // init email
  const [email, setEmail] = useState("")

  // init password
  const [password, setPassword] = useState("")

  // init isLoading
  const [isLoading, setIsLoading] = useState(false)



  // init handleSubmit
  const handleSubmit = async () => {
    try {

      // init isLoading
      setIsLoading(true)

      // init loginData
      const loginData = {
        email: email,
        password: password
      }

      // validate 
      if (!loginData.email) {
        // init isLoading
        setIsLoading(false)

        return toast.error("Email address is required")
      }

      if (!isEmail(loginData.email)) {
        // init isLoading
        setIsLoading(false)

        return toast.error("Please enter a valid email")
      }

      if (!loginData.password) {
        // init isLoading
        setIsLoading(false)

        return toast.error("Password is required")
      }


      // make reques to login user
      const response = await axios.post(`${process.env.API_ROOT}/login`, loginData)

      // check if success
      if (!response.data.success) {
        // init isLoading
        setIsLoading(false)

        return toast.error(response.data.message)
      }


      // save token to cooke 
      cookieJs.set('BT_Auth_Token', response.data.data)

      // return to dashboard
      return router.replace({ pathname: '/dashboard' })



    } catch (error) {
      // init isLoading
      setIsLoading(false)

      console.log(error)
      return toast.error("Oops! Login failed")
    }
  }




  return (
    <>
      <Toaster />
      <main className="d-flex w-100">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">

                <div className="text-center mt-4">
                  <h1 className="h2">Bitke</h1>

                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-4">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input className="form-control form-control-lg" type="email" name="email" onChange={(event) => setEmail(event.target.value)} value={email} placeholder="Enter your email" />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <input className="form-control form-control-lg" type="password" name="password" onChange={(event) => setPassword(event.target.value)} value={password} placeholder="Enter your password" />

                        </div>

                        <div className="text-center mt-3">
                          {isLoading ?  <button type="button" className="btn btn-lg btn-primary" disabled>Loading...</button> : 
                           <button type="button" className="btn btn-lg btn-primary" onClick={() => handleSubmit()}>Login</button>
                          }
                         
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}



// export Home component
export default Home
