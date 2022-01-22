import { useEffect } from 'react'

// Link
import Link from 'next/link'

// router
import { useRouter } from 'next/router'

// cookie Js
import cookieJs from 'js-cookie'


// init Sidebar component
const Sidebar = () => {

    // init router
    const router = useRouter()


    // init logout 
    const logout = () => {

        //clear cooke 
        cookieJs.remove('BT_Auth_Token')

        // return to login
        return router.replace({pathname: '/'})

    }


    return (
        <>
            <nav id="sidebar" className="sidebar js-sidebar">
                <div className="sidebar-content">
                    <a className="sidebar-brand">
                        <span className="align-middle">Bitke</span>
                    </a>

                    <ul className="sidebar-nav">
                        <Link href="/dashboard"><li className={`sidebar-item ${router.pathname === '/dashboard' && 'active'}`}>
                            <a className="sidebar-link">
                                <span className="align-middle ms-3">Dashboard</span>
                            </a>
                        </li></Link>

                        <Link href="/dashboard/category"><li className={`sidebar-item ${router.pathname === '/dashboard/category' && 'active'}`}>
                            <a className="sidebar-link">
                                <span className="align-middle ms-3">Category</span>
                            </a>
                        </li></Link>

                        <Link href="/dashboard/metadata"><li className={`sidebar-item ${router.pathname === '/dashboard/metadata' && 'active'}`}>
                            <a className="sidebar-link">
                                <span className="align-middle ms-3">Metadata</span>
                            </a>
                        </li></Link>

                        <Link href="/dashboard/reporting"><li className={`sidebar-item ${router.pathname === '/dashboard/reporting' && 'active'}`}>
                            <a className="sidebar-link">
                                <span className="align-middle ms-3">Reporting</span>
                            </a>
                        </li></Link>

                        <li className={`sidebar-item`}>
                            <a className="sidebar-link" onClick={() => logout()}>
                                <span className="align-middle ms-3">Logout</span>
                            </a>
                        </li>


                    </ul>

                </div>
            </nav>

        </>
    )
}


// export Sidebar component
export default Sidebar
