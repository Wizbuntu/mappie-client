import { useState, useEffect } from 'react'

// AuthHoc
import AuthHoc from '../../hoc/authHoc'

// react hot toast
import { Toaster, toast } from 'react-hot-toast'

// useCategory
import useCategory from '../../hooks/useCategory'

// useMetaData
import useMetaData from '../../hooks/useMetaData'



// init Dashboard Home
const DashboardHome = () => {


    // invoke useCategory hook
    const { categories, isLoading:isCategoryLoading, isError } = useCategory()

    // invoke useMeta hook
    const { metadata, isMetaLoading, isMetaError } = useMetaData()


    // init useEffect
    useEffect(() => {

        // check if error
        if (isError || isMetaError) {
            return toast.error("Oops! an error has occurred")
        }

    }, [])


    console.log("Categories", categories)
    console.log("Metadata", metadata)


    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">

                    <h1 className="h3 mb-3"><strong>Welcome</strong></h1>

                    <div className="row">
                        <div className="col-xl-6 col-xxl-5 d-flex">
                            <div className="w-100">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="card">
                                            <div className="card-body">
                                                {isCategoryLoading ? <div className="text-center py-4"><p>Loading...</p></div> :
                                                    <>
                                                        <div className="row">
                                                            <div className="col mt-0">
                                                                <h5 className="card-title">Categories</h5>
                                                            </div>


                                                        </div>
                                                        <h1 className="mt-1 mb-3">{categories && categories.data && [...categories.data].length}</h1>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-md-6">
                                        <div className="card">
                                            <div className="card-body">
                                                {isMetaLoading ? <div className="text-center py-4"><p>Loading...</p></div> :
                                                    <>
                                                        <div className="row">
                                                            <div className="col mt-0">
                                                                <h5 className="card-title">Metadata</h5>
                                                            </div>


                                                        </div>

                                                        <h1 className="mt-1 mb-3">{metadata && metadata.data && [...metadata.data].length}</h1>
                                                    </>
                                                }
                                            </div>
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

export default AuthHoc(DashboardHome)
