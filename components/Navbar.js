import { useEffect } from 'react'

// cookieJs
import cookieJs from "js-cookie"

// useRouter
import { useRouter } from 'next/router'


// init Navbar component
const Navbar = () => {

    // init router
    const router  = useRouter()


    
    // init logout 
    const logout = () => {

        //clear cooke 
        cookieJs.remove('BT_Auth_Token')

        // return to login
        return router.replace({ pathname: '/' })

    }

    return (
        <>
            <nav className="navbar navbar-expand navbar-light navbar-bg">
                <a className="sidebar-toggle js-sidebar-toggle">
                    <i className="hamburger align-self-center"></i>
                </a>

                <div className="navbar-collapse collapse">
                    <ul className="navbar-nav navbar-align">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor text-dark"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path
                                        fillRule="evenodd"
                                        d="M0 8a8 8 0 1116 0A8 8 0 010 8zm8-7a7 7 0 00-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 008 1z"
                                    ></path>
                                </svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a onClick={() => logout()} className="dropdown-item">Log out</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

        </>
    )
}



// export Navbar component
export default Navbar
