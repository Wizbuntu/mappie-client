import { useState, useEffect } from 'react'

// AuthHoc
import AuthHoc from '../../../hoc/authHoc'

// react hot toast
import { Toaster, toast } from 'react-hot-toast'

// date fns
import { format } from 'date-fns'

// Pure modal
import PureModal from 'react-pure-modal'
import 'react-pure-modal/dist/react-pure-modal.min.css';

// axios
import axios from '../../../config/axios.config'

// slugify
import slugify from 'slugify'

// Link
import Link from 'next/link'

// router
import { useRouter } from 'next/router'

// useCategory
import useCategory from '../../../hooks/useCategory'






// init Category component
const Category = () => {

    // init router
    const router = useRouter()

    // invoke useCategory
    const { categories:categoryList, isLoading, isError } = useCategory()

    console.log(categoryList)

    // init categories state 
    const [categories, setCategories] = useState({})




    // init useEffect
    useEffect(() => {

        // check if isError
        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

        // update categories
        setCategories(categoryList)

    }, [categoryList])




    // init categoryTitle state
    const [categoryTitle, setCategoryTitle] = useState("")

    // init categorySlug state
    const [categorySlug, setCategorySlug] = useState("")

    // init formSchema state 
    const [formSchema, setFormSchema] = useState([{
        name: "",
        label: "",
        type: "",
        element: ""
    }])

    // init addModal
    const [addModal, setAddModal] = useState(false)

    // init deleteModal
    const [deleteModal, setDeleteModal] = useState(false)

    // init addCategoryLoading
    const [addCategoryLoading, setAddCategoryLoading] = useState(false)

    // init deleteCategoryLoading
    const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false)

    // init selectedCategoryId state
    const [selectedCategoryId, setSelectedCategoryId] = useState("")


    // init searchText state
    const [searchText, setSearchText] = useState("")





    // init onChangeTitle
    const onChangeTitleAndSlug = (event) => {

        // update category title state 
        setCategoryTitle(event.target.value)

        // update slug state
        setCategorySlug(slugify(event.target.value, { lower: true }))

    }




    // init handleChange 
    const handleChange = (index, event) => {

        // copy formSchema
        let newFormSchema = [...formSchema]

        // update object in newFormSchema
        newFormSchema[index][event.target.name] = event.target.value

        // update formSchema State 
        setFormSchema(newFormSchema)
    }




    // init handAddField
    const handleAddField = () => {

        // copy formSchema
        const _formSchema = [...formSchema]

        // init newFormSchema
        const newFormSchema = { name: "", label: "", type: "", element: "" }

        // push to copied formSchema
        _formSchema.push(newFormSchema)

        // update formSchema State
        setFormSchema(_formSchema)

    }


    // init handleDeleteField
    const handleDeleteField = (index) => {

        // copy formSchema
        const _formSchema = [...formSchema]

        // check if the elements in formSchema is 1 
        if (_formSchema.length === 1) {
            return toast.error("Minimum of 1 field is required")
        }

        // init newFormSchema
        _formSchema.splice(index, 1)

        // update formSchema
        setFormSchema(_formSchema)
    }





    // init handleSubmit 
    const handleSubmit = async () => {
        try {

            // upate addCategoryLoading state 
            setAddCategoryLoading(true)

            // copy formSchema
            const _formSchema = [...formSchema]


            // validate name field
            const nameError = _formSchema.find((schema) => !schema.name)

            // validate label field
            const labelError = _formSchema.find((schema) => !schema.label)

            // validate type field
            const typeError = _formSchema.find((schema) => !schema.type)

            // validate element field 
            const elementError = _formSchema.find((schema) => !schema.element)


            // validate category title 
            if (!categoryTitle) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Title is required")
            }

            // validate category title 
            if (!categorySlug) {

                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Slug is required")

            }

            // show nameError
            if (nameError) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Field name is required")
            }

            // show labelError
            if (labelError) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Field label is required")
            }

            // show typeError
            if (typeError) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Please select field type")
            }

            // show elementError
            if (elementError) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)
                return toast.error("Please select field element")
            }


            // init categoryData
            const categoryData = {
                title: categoryTitle,
                slug: categorySlug,
                formSchema: _formSchema
            }


            console.log(categoryData)


            // make post request to create category
            const response = await axios.post(`${process.env.API_ROOT}/create/category`, categoryData)

            // check if not success
            if (!response.data.success) {
                // update addCategoryLoading state
                setAddCategoryLoading(false)

                return toast.error(response.data.message)
            }


            // show success
            toast.success(response.data.message)


            // reload page 
            return router.reload()


        } catch (error) {
            // update addCategoryLoading state
            setAddCategoryLoading(false)
            console.log(error)
            return toast.error("Oops! Could not create Category", { style: { maxWidth: 500 } })
        }
    }





    // init handleOpenDeleteModal function
    const handleOpenDeleteModal = (categoryId) => {

        // update selectedCateogoryId
        setSelectedCategoryId(categoryId)

        // update deleteModal
        setDeleteModal(true)

    }



    // init handleDeleteCategory function
    const handleDeleteCategory = async () => {
        try {

            // update deleteCateogoryLoading 
            setDeleteCategoryLoading(true)

            // get categoryId
            const categoryId = selectedCategoryId

            console.log(categoryId)


            // make request to delete category
            const response = await axios.delete(`${process.env.API_ROOT}/delete/category/${categoryId}`)


            // check if not success
            if (!response.data.success) {

                // update deleteCateogoryLoading 
                setDeleteCategoryLoading(false)

                return toast.error(response.data.message)
            }


            // show success
            toast.success("Category deleted successfully")


            // reload page 
            return router.reload()


        } catch (error) {
            // update deleteCateogoryLoading 
            setDeleteCategoryLoading(false)
            console.log(error)
            return toast.error("Oops! failed to delete category")
        }
    }



    // init handleSearch function
    const handleSearch = async () => {
        try {

            // check if searchText
            if(searchText) {

                // make request to search category
                const response = await axios.get(`${process.env.API_ROOT}/search/category?search=${searchText}`)

                // update category 
                setCategories(response.data)

            } else {

                // make request to fetch all categories
                const response = await axios.get(`${process.env.API_ROOT}/all/categories`)

                // update category 
                setCategories(response.data)

            }
        } catch (error) {
            console.log(error)
            return toast.error("Oops! failed to search category")
        }
    }




    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">
                    <h1 className="h3 mb-3"><strong>Category</strong></h1>

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
                                                <div className="col-auto">
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" placeholder="Search" onChange={(event) => setSearchText(event.target.value)} />
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleSearch()}>Search</button>
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
                                                    </svg> Add Category</button>
                                                </div>
                                            </div>

                                        </div>
                                        {categories && categories.data && [...categories.data].length > 0 ? <table className="table table-hover my-0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Slug</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories && [...categories.data].map((category, index) => {
                                                    return <tr key={index}>
                                                        <td>{category._id}</td>
                                                        <td>{category.title}</td>
                                                        <td>{category.slug}</td>
                                                        <td>{format(new Date(category.createdAt), 'yyyy-MM-dd')}</td>
                                                        <td><Link href={`/dashboard/category/${category._id}`}><a className="btn btn-sm me-2 btn-secondary"><svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-pencil-square"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"></path>
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
                                                            ></path>
                                                        </svg></a></Link>
                                                            <a className="btn btn-sm btn-danger" onClick={() => handleOpenDeleteModal(category._id)}><svg
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
                                                    <p className="fw-bold">No category yet</p>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                            </div>
                        </>
                    }



                    {/* Add cateogory modal */}
                    <PureModal
                        header="Create Category"
                        width="50vw"

                        footer={
                            <div className="text-end pe-0">
                                {addCategoryLoading ? <button className="btn btn-secondary" disabled>Creating...</button> :
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

                            {/* Title */}
                            <input type="text" className="form-control mb-3" placeholder="Cateogry Title" onChange={(event) => onChangeTitleAndSlug(event)} value={categoryTitle} />

                            {/* Slug */}
                            <input type="text" className="form-control mb-3" placeholder="Cateogry Slug" onChange={(event) => setCategorySlug(event.target.value)} value={categorySlug} />

                            <hr className="mt-4" />

                            <h5 className="text-dark mb-3 mt-4 fw-bold">Add Dynamic Form Schema</h5>
                            {/* iterate formSchema */}
                            {formSchema.map((schema, index) => {
                                return <div key={index}>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="mb-3">
                                                <label>Field Name</label>
                                                <input type="text" name="name" className="form-control" value={schema.name || ""} onChange={(event) => handleChange(index, event)} />
                                                <small>Note: spaces, numbers and special characters are not allowed</small>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="mb-3">
                                                <label>Field Label</label>
                                                <input type="text" name="label" className="form-control mb-3" value={schema.label || ""} onChange={(event) => handleChange(index, event)} />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-auto">
                                            <div className="mb-3">
                                                <label>Field Type</label>
                                                <select className="form-select" name="type" value={schema.type || ""} onChange={(event) => handleChange(index, event)}>
                                                    <option value="">Select Type</option>
                                                    <option value="text">text</option>
                                                    <option value="number">number</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="mb-4">
                                                <label>Field Element</label>
                                                <select className="form-select" name="element" value={schema.element || ""} onChange={(event) => handleChange(index, event)}>
                                                    <option value="">Select Element</option>
                                                    <option value="input">input</option>
                                                    <option value="textarea">textarea</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-auto" style={{ paddingTop: 21 }}>
                                            {/* add field */}
                                            {index === formSchema.length - 1 &&
                                                <button type="button" className="btn btn-secondary me-2" onClick={() => handleAddField()}><svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-plus-lg mb-1"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"
                                                    ></path>
                                                </svg> </button>}

                                            {/* delete */}
                                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteField(index)}><svg
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
                                            </svg></button>

                                        </div>
                                    </div>

                                    <hr className="mb-4" />


                                </div>
                            })}
                        </form>

                    </PureModal>










                    {/* Add delete modal */}
                    <PureModal
                        header="Delete Category"
                        footer={
                            <div className="text-end pe-0">
                                <button className="btn btn-secondary me-3" onClick={() => setDeleteModal(false)}>No, Dismiss</button>
                                {deleteCategoryLoading ? <button className="btn btn-danger" disabled>Deleting...</button> :
                                    <button className="btn btn-danger" onClick={() => handleDeleteCategory()}>Yes, Delete</button>
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

                        Do you want to delete this category?

                    </PureModal>

                </div>
            </main>

        </>
    )
}


// export Category
export default AuthHoc(Category)
