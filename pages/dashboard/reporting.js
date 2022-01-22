import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../hoc/authHoc';

// useReporting
import useReporting from '../../hooks/useReporting'

// react hotToast
import { Toaster, toast } from 'react-hot-toast';

// date fns 
import { format } from 'date-fns'

// Pure modal
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css';

// axios
import axios from '../../config/axios.config'


// Router
import { useRouter } from 'next/router';




// init Reporting
const Reporting = () => {

    // init router
    const router = useRouter()

    // invoke useReporting
    const { reporting, isLoading, isError } = useReporting()

    console.log(reporting)


    // init useEffect
    useEffect(() => {

        // check if isError
        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

    }, [])

    // init deleteLoading
    const [deleteLoading, setDeleteLoading] = useState(false)

    // init selectedReport state
    const [selectedReport, setSelectedReport] = useState({})

    // init selectedReportId
    const [selectedReportId, setSelectedReportId] = useState("")

    // init deleteModal
    const [deleteModal, setDeleteModal] = useState(false)

    // init viewModal
    const [viewModal, setViewModal] = useState(false)

    // init updateModal
    const [updateModal, setUpdateModal] = useState(false)





    // init handleOpenViewModal function
    const handleOpenViewModal = (reportData) => {

        // update selectedReport state 
        setSelectedReport(reportData)


        // update viewModal
        setViewModal(true)

    }





    // init handleOpenDeleteModal
    const handleOpenDeleteModal = (report_id) => {

        // update selectedReportId
        setSelectedReportId(report_id)

        // update deleteModal 
        setDeleteModal(true)

    }





    // init deleteReporting
    const deleteReporting = async () => {
        try {

            // init deleteLoading
            setDeleteLoading(true)

            // get selectedReportId
            const reportId = selectedReportId

            // check if id
            if (reportId) {

                // make axios reques to delete reporting
                const response = await axios.delete(`${process.env.API_ROOT}/delete/reporting/${reportId}`)

                // check if success
                if (!response.data.success) {

                    // show error toast
                    return toast.error(response.data.message)

                }


                // show success
                toast.success("Reporting deleted successfully")


                // reload page 
                return router.reload()

            }

        } catch (error) {
            // init deleteLoading
            setDeleteLoading(false)
            console.log(error)
            return toast.error("Oops! Failed to delete report")
        }
    }




    // init publishReport
    const publishReport = async(reportId) => {
        try {

            // init updateData
            const updateData = {
                isPending: false
            }


            // make request to publish report
            const response = await axios.put(`${process.env.API_ROOT}/update/reporting/${reportId}`, updateData)

            // check if not success
            if(!response.data.success) {
                return toast.error("Oops! failed to publish report")
            }

            // show success
            toast.success("Report published successfully")

            // reload page 
            return router.reload()

        }catch(error) {
            console.log(error)
            return toast.error("Oops! Failed to publish report")
        }
    }



    // init ReportPending
    const pendReport = async(reportId) => {
        try {

            // init updateData
            const updateData = {
                isPending: true
            }


            // make request to publish report
            const response = await axios.put(`${process.env.API_ROOT}/update/reporting/${reportId}`, updateData)

            // check if not success
            if(!response.data.success) {
                return toast.error("Oops! failed to mark report as pending")
            }

            // show success
            toast.success("Report marked as pending")

            // reload page 
            return router.reload()

        }catch(error) {
            console.log(error)
            return toast.error("Oops! Failed to mark report as pending")
        }
    }



    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">
                    <h1 className="h3 mb-3"><strong>Reporting</strong></h1>

                    {isLoading ? <>
                        <div className="container pt-5 text-center">
                            <p className="fw-bold">Loading...</p>
                        </div></>

                        :


                        <>
                            <div className="row">
                                <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                                    <div className="card flex-fill">
                                        <div className="card-header">
                                            <div className="row">
                                                {/* <div className="col-auto">
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" placeholder="Search" onChange={(event) => setSearchText(event.target.value)} />
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleSearch()}>Search</button>
                                                    </div>
                                                </div> */}
                                            </div>

                                        </div>
                                        {reporting && reporting.data && [...reporting.data].length > 0 ? <table className="table table-hover my-0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Country</th>
                                                    <th>Title</th>
                                                    <th>Author</th>
                                                    <th>Status</th>
                                                    <th>CreatedAt</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reporting && [...reporting.data].map((report, index) => {
                                                    return <tr key={index}>
                                                        <td>{report._id}</td>
                                                        <td>{report.country}</td>
                                                        <td>{report.title}</td>
                                                        <td>{report.fullName}</td>
                                                        <td>{report.isPending ? <span className="badge bg-warning">Pending</span> : <span className="badge bg-success">Published</span>}</td>
                                                        <td>{format(new Date(report.createdAt), 'yyyy-MM-dd')}</td>
                                                        <td><a className="btn btn-sm me-2 btn-secondary" onClick={() => handleOpenViewModal(report)}><svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-eye"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 011.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0114.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 011.172 8z"></path>
                                                            <path d="M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4.5 8a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"></path>
                                                        </svg></a>
                                                            <a className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(report._id)}><svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                className="bi bi-trash"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"></path>
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                ></path>
                                                            </svg></a></td>

                                                    </tr>

                                                })}

                                            </tbody>
                                        </table>
                                            :
                                            <>
                                                <div className="container">
                                                    <p className="fw-bold">No Reporting yet</p>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                            </div>
                        </>
                    }












                    {/* Add delete modal */}
                    <PureModal
                        header="Delete Reporting"
                        footer={
                            <div className="text-end pe-0">
                                <button className="btn btn-secondary me-3" onClick={() => setDeleteModal(false)}>No, Dismiss</button>
                                {deleteLoading ? <button className="btn btn-danger" disabled>Deleting...</button> :
                                    <button className="btn btn-danger" onClick={() => deleteReporting()}>Yes, Delete</button>
                                }

                            </div>
                        }
                        isOpen={deleteModal}
                        closeButton="X"
                        closeButtonPosition="header"
                        onClose={() => {
                            setDeleteModal(false);
                            return true;
                        }}
                    >

                        Do you want to delete this report?

                    </PureModal>






                    {/* View Reporting */}
                    <PureModal
                        header="View Reporting"
                        width={"50%"}
                        footer={
                            <div className="text-end pe-0">
                                <button className="btn btn-secondary me-3" onClick={() => setViewModal(false)}>Close</button>
                            </div>
                        }
                        isOpen={viewModal}
                        closeButton="X"
                        closeButtonPosition="header"
                        onClose={() => {
                            setViewModal(false);
                            return true;
                        }}
                    >

                        <div className="card" style={{ boxShadow: "none" }}>
                            <div className="card-body ">
                                <h5 className="fs-4 card-title mb-3">{selectedReport.title}</h5>
                                <h6 className="card-subtitle mb-3 text-muted">{selectedReport.fullName} </h6>
                                <h6 className="card-subtitle mb-3 text-muted"><span className="badge bg-light text-dark">{selectedReport.country}</span> <span className="badge bg-light text-dark">{selectedReport.latitude}</span>  <span className="badge bg-light text-dark">{selectedReport.longitude}</span></h6>
                                <p className="card-text">{selectedReport.description}</p>
                                <hr />
                                <div className="container">
                                    <div className="row">
                                        <div className="col-auto">
                                            <a className="card-link text-success fw-bold" onClick={() => publishReport(selectedReport._id)}>Mark as publish</a>

                                        </div>

                                        <div className="col-auto ms-auto">
                                            <a className="card-link ms-auto text-warning fw-bold" onClick={() => pendReport(selectedReport._id)}>Mark as pending</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </PureModal>

                </div>
            </main>


        </>
    )
};




// export Reporting
export default AuthHoc(Reporting)
