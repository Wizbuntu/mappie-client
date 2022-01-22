
import { useState, useEffect, useCallback } from 'react'

// AuthHoc
import AuthHoc from '../../../hoc/authHoc'

// react hot toast
import { Toaster, toast } from 'react-hot-toast'

// date fns
import { format } from 'date-fns'

// Pure modal
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css';

// country finder
import countryFinder from 'country-finder'

// axios
import axios from '../../../config/axios.config'

// Link
import Link from 'next/link'

// router
import { useRouter } from 'next/router'

// useCategory
import useCategory from '../../../hooks/useCategory'

// useMetaData
import useMetaData from '../../../hooks/useMetaData'








// init MetaData component
const MetaData = () => {

    // init router
    const router = useRouter()

    // init modal state
    const [addModal, setAddModal] = useState(false)

    // init viewModal state
    const [viewModal, setViewModal] = useState(false)

    // init deleteModal state 
    const [deleteModal, setDeleteModal] = useState(false)

    // init addMetaDataLoading state
    const [addMetaDataLoading, setAddMetaDataLoading] = useState(false)

    // init formSchema state 
    const [formSchema, setFormSchema] = useState([])

    // init metaData state
    const [metaData, setMetaData] = useState({})

    // init selectedCategory state 
    const [selectedCategory, setSelectedCategory] = useState({ id: "", title: "" })

    // init selectedMetaData
    const [selectedMetaData, setSelectedMetaData] = useState({})

    // init selectedMetaId state 
    const [selectedMetaId, setSelectedMetaId] = useState("")

    // init searchMetaText state 
    const [searchMetaText, setSearchMetaText] = useState("")

    // init isMetaDeleteLoading
    const [isMetaDeleteLoading, setIsMetaDeleteLoading] = useState(false)

    // get africaCountries
    const africanCountries = countryFinder.byContinent("Africa");

    // init selectedAfricanCountry state 
    const [selectedAfricaCountry, setSelectedAfricanCountry] = useState({ countryName: "", lat: "", long: "" })

    // invoke useCategory
    const { categories, isLoading, isError } = useCategory()



    // invoke useMetaData
    const { metadata: metaDataList, isMetaLoading, isMetaError } = useMetaData()



    console.log("Categories", categories)
    console.log("African Countries", africanCountries)
    console.log("MetaData", metaDataList)

    // init metaDatas state
    const [metadata, setMetadata] = useState(null)


    // init useEffect
    useEffect(() => {

        // check if isError
        if (isError) {
            return toast.error("Oops! An error has occurred")
        }


        // update metadata state
        setMetadata(metaDataList)

    }, [metaDataList])







    // init handleSelectCategory
    const handleSelectCategory = (category) => {

        // init _category
        const _category = JSON.parse(category)

        // init _formSchema
        const _formSchema = [..._category.formSchema]

        // init _metadata
        let _metadata = {}

        // iterate formSchema and get name
        _formSchema.forEach((schema) => _metadata[schema.name] = "")


        // update formSchema state
        setFormSchema(_category.formSchema)

        // update metaData state 
        setMetaData(_metadata)

        // update selectedCategory 
        setSelectedCategory({ ...selectedCategory, id: _category._id, title: _category.title })


        console.log(_metadata)

        console.log(_category)

    }



    // init handleSelectCountry
    const handleSelectCountry = useCallback((country) => {

        // parse country
        const _country = JSON.parse(country)

        console.log(_country)

        // update selectedAfricanCountry
        setSelectedAfricanCountry({ ...selectedAfricaCountry, countryName: _country.name, lat: _country.lat, long: _country.long })
    }, [])



    // init handleChange 
    const handleChange = (data) => (event) => {

        // update metData state
        setMetaData({ ...metaData, [data]: event.target.value })


    }


    // init handleViewMetaData
    const handleViewMetaData = (_metadata) => {

        // update selectedMetaData
        setSelectedMetaData(_metadata)

        // update viewMetaData
        setViewModal(true)

    }



    // init handleSubmit
    const handleSubmit = async () => {
        try {

            // update addMetaDataLoading
            setAddMetaDataLoading(true)

            // init _metaData
            const _metaData = {
                categoryId: selectedCategory.id,
                categoryName: selectedCategory.title,
                country: selectedAfricaCountry.countryName,
                latitude: Number(selectedAfricaCountry.lat),
                longitude: Number(selectedAfricaCountry.long),
                data: { ...metaData }
            }

            // validate required data
            if (!_metaData.categoryId) {

                // update addMetaDataLoading
                setAddMetaDataLoading(false)

                return toast.error("Category is required")
            }

            if (!_metaData.categoryName) {

                // update addMetaDataLoading
                setAddMetaDataLoading(false)

                return toast.error("Category is required")
            }

            if (!_metaData.country) {

                // update addMetaDataLoading
                setAddMetaDataLoading(false)

                return toast.error("Please select a country")
            }


            // init api request to create metadata
            const response = await axios.post(`${process.env.API_ROOT}/create/metadata`, _metaData)

            // check if not success
            if (!response.data.success) {

                // update addMetaDataLoading
                setAddMetaDataLoading(false)

                return toast.error("Oops! Could not create metadata")
            }

            // show success toast
            toast.success("Metadata created successfully")

            // reload page 
            return router.reload()


        } catch (error) {
            console.log(error)
            return toast.error("Oops! An error has occurred")
        }
    }



    // init handleOpenDeleteModal function
    const handleOpenDeleteModal = (meta_id) => {

        // update selectedMetaData state 
        setSelectedMetaId(meta_id)


        // update deleteModal state 
        setDeleteModal(true)

    }



    // init handleDelete function
    const handleDelete = async () => {
        try {

            // check if selectedMetaId
            if (selectedMetaId) {

                // update isMetaDeleteLoading
                setIsMetaDeleteLoading(true)

                // make api request to delete metadata
                const response = await axios.delete(`${process.env.API_ROOT}/delete/metadata/${selectedMetaId}`)


                // if not success
                if (!response.data.success) {

                    // update isMetaDeleteLoading
                    setIsMetaDeleteLoading(false)

                    return toast.error(response.data.message)
                }


                // show success
                toast.success("Metadata deleted successfully")

                // reload page 
                return router.reload()

            }

        } catch (error) {
            console.log(error)
            // update isMetaDeleteLoading
            setIsMetaDeleteLoading(false)
            return toast.error("Oops! Failed to delete meta data")
        }
    }





    // init handleSearchMetaData
    const handleSearchMetaData = async () => {
        try {

            // check if searchMetaText
            if (searchMetaText) {

                // make api request to search metadata
                const response = await axios.get(`${process.env.API_ROOT}/search/metadata?search=${searchMetaText}`)

                // update metadata state
                setMetadata(response.data)

            } else {

                // make api request to search metadata
                const response = await axios.get(`${process.env.API_ROOT}/all/metadata`)

                // update metadata state
                setMetadata(response.data)
            }

        } catch (error) {
            console.log(error)
            return toast.error("Oops! Failed to search meta data")
        }
    }




    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">
                    <h1 className="h3 mb-3"><strong>Metadata</strong></h1>
                    {isMetaLoading ? <>
                        <div className="container pt-5 text-center">
                            <p className="fw-bold">Loading...</p>
                        </div></>

                        :

                        <div className="row">
                            <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                                <div className="card flex-fill">
                                    <div className="card-header">

                                        <div className="row">
                                            <div className="col-auto">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Search" onChange={(event) => setSearchMetaText(event.target.value)}/>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleSearchMetaData()}>Search</button>
                                                </div>
                                            </div>

                                            <div className="col-auto ms-auto">
                                                <button className="btn btn-secondary" onClick={() => setAddModal(true)}><svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-plus-lg"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"
                                                    ></path>
                                                </svg> Add Metadata</button>
                                            </div>
                                        </div>

                                    </div>

                                    {categories && [...categories.data].length > 0 ? <table className="table table-hover my-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Category</th>
                                                <th>Country</th>
                                                <th>Longitude</th>
                                                <th>Latitude</th>
                                                <th>CreatedAt</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metadata && metadata.data && [...metadata.data].map((data, index) => {
                                                return <tr key={index}>
                                                    <td>{data._id}</td>
                                                    <td>{data.categoryName}</td>
                                                    <td>{data.country}</td>
                                                    <td>{data.latitude}</td>
                                                    <td>{data.longitude}</td>
                                                    <td>{format(new Date(data.createdAt), 'yyyy-MM-dd')}</td>
                                                    <td><a className="btn btn-sm me-2 btn-secondary" onClick={() => handleViewMetaData(data)}> <svg
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
                                                        <a className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(data._id)}><svg
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
                                                <p className="fw-bold">No Meta Data yet</p>
                                            </div>
                                        </>
                                    }



                                </div>
                            </div>
                        </div>

                    }


                </div>



                {/* Add metadata modal */}
                <PureModal
                    header="Create Metadata"
                    width="50vw"

                    footer={
                        <div className="text-end pe-0">
                            {addMetaDataLoading ? <button className="btn btn-secondary" disabled>Creating...</button> :
                                <button className="btn btn-secondary" onClick={() => handleSubmit()}>Submit</button>
                            }

                        </div>
                    }
                    isOpen={addModal}
                    closeButton="X"
                    closeButtonPosition="header"
                    onClose={() => {
                        setAddModal(false);
                        return true;
                    }}
                >
                    <form>

                        {/* Country */}
                        <div className="mb-3">
                            <label htmlFor="country">Country</label>
                            <select className="form-select" onChange={(event) => handleSelectCountry(event.target.value)} aria-label="Default select example">
                                <option value="">Select Country</option>
                                {africanCountries && [...africanCountries].map((country, index) => {
                                    return <option key={index} value={JSON.stringify(country)}>{country.name}</option>
                                })}
                            </select>
                        </div>


                        {/* Category */}
                        <div className="mb-3">
                            <label htmlFor="category">Category</label>

                            <select className="form-select" onChange={(event) => handleSelectCategory(event.target.value)} id="category">
                                <option value="">Select Category</option>
                                {categories && categories.data && [...categories.data].map((category, index) => {
                                    return <option key={index} value={JSON.stringify(category)}>{category.title}</option>
                                })}

                            </select>
                        </div>


                        {/* Show forms */}
                        {formSchema.length > 0 && formSchema.map((schema, index) => {

                            return <div key={index} className="mb-3">

                                {schema.element === "input" ? <div className="mb-3">
                                    <label htmlFor={schema.name} className="form-label">{schema.label}</label>
                                    <input type={schema.type} name={schema.name} className="form-control" id={schema.name} placeholder={schema.label} onChange={handleChange(schema.name)} value={metaData[`${schema.name}`]} />
                                </div> :
                                    <div className="mb-3">
                                        <label htmlFor={schema.name} className="form-label">{schema.label}</label>
                                        <textarea type={schema.type} name={schema.name} className="form-control" id={schema.name} placeholder={schema.label} onChange={handleChange(schema.name)} value={metaData[`${schema.name}`]} />
                                    </div>
                                }

                            </div>

                        })}

                    </form>

                </PureModal>









                {/* View Modal */}
                <PureModal
                    header="View Metadata"
                    width="50vw"

                    footer={
                        <div className="text-end pe-0">
                            <button className="btn btn-secondary" onClick={() => setViewModal(false)}>Close</button>
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

                    <table className="table table-hover">
                        <tbody>
                            {selectedMetaData && selectedMetaData.data && Object.entries((selectedMetaData.data)).map((data, index) => {
                                return <tr key={index}>
                                    <th scope="row">{data[0]}</th>
                                    <td>{data[1]}</td>
                                </tr>

                            })}




                        </tbody>
                    </table>

                </PureModal>







                {/* Delete Modal */}
                <PureModal
                    header="Delete Metadata"
                    width="50vw"

                    footer={
                        <div className="text-end pe-0">
                            <button className="btn btn-secondary me-2" onClick={() => setDeleteModal(false)}>No, Dismiss</button>
                            {isMetaDeleteLoading ? <button className="btn btn-danger" disabled>Deleting...</button> :
                                <button className="btn btn-danger" onClick={() => handleDelete()}>Yes, Delete</button>
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
                    Do you want to delete ?

                </PureModal>


            </main>

        </>
    )
}





// export MetaData component
export default AuthHoc(MetaData)
