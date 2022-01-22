import { useState, useEffect } from 'react'

// AuthHoc
import AuthHoc from '../../../hoc/authHoc'

// router
import { useRouter } from 'next/router'

// Toaster
import { Toaster, toast } from 'react-hot-toast'

// useSingleCategory
import useSingleCategory from '../../../hooks/useSingleCategory'

// slugify
import slugify from 'slugify'

// axios
import axios from '../../../config/axios.config'






// init category Details
const CategoryDetails = () => {

    // init router
    const router = useRouter()

    // get categoryId
    const categoryId = router.query.id

    // invoke useSingleCategory
    const { data, isError, isLoading } = useSingleCategory(categoryId)

    // init categoryTitle
    const [categoryTitle, setCategoryTitle] = useState("")

    // init categorySlug
    const [categorySlug, setCategorySlug] = useState()

    // init formSchema state 
    const [formSchema, setFormSchema] = useState([])

    // init isBtnLoading
    const [isBtnLoading, setIsBtnLoading] = useState(false)


    // init useEffect
    useEffect(() => {

        // check if error
        if (isError) {
            return toast.error("Oops! An error has occurred")
        }

        // check if data is false
        if (data && !data.success) {
            return router.replace({ pathname: '/dashboard/category' })
        }

        // update categoryTitle
        setCategoryTitle(`${data && data.data && data.data.title}`)

        // update categorySlug
        setCategorySlug(`${data && data.data && data.data.slug}`)

        // update formSchema 
        setFormSchema(data && data.data && [...data.data.formSchema])

    }, [data])

    console.log(data)




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

            // update isBtnloading state
            setIsBtnLoading(true)

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


            // show nameError
            if (nameError) {
                // update isBtnloading state
                setIsBtnLoading(false)
                return toast.error("Field name is required")
            }

            // show labelError
            if (labelError) {
                // update isBtnloading state
                setIsBtnLoading(false)
                return toast.error("Field label is required")
            }

            // show typeError
            if (typeError) {
                // update isBtnloading state
                setIsBtnLoading(false)
                return toast.error("Please select field type")
            }

            // show elementError
            if (elementError) {
                // update isBtnloading state
                setIsBtnLoading(false)
                return toast.error("Please select field element")
            }


            // init categoryData
            const categoryData = {
                title: categoryTitle,
                slug: categorySlug,
                formSchema: _formSchema
            }


            console.log(categoryData)


            // make post request to update category data
            const response = await axios.put(`${process.env.API_ROOT}/update/category/${categoryId}`, categoryData)

            // check if not success
            if (!response.data.success) {
                // update isBtnloading state
                setIsBtnLoading(false)
                return toast.error(response.data.message)
            }

            // show success
            toast.success(response.data.message)


            // reload page 
            return router.reload()


        } catch (error) {
            // update isBtnloading state
            setIsBtnLoading(false)
            console.log(error)
            return toast.error("Oops! Could not update Category", { style: { maxWidth: 500 } })
        }
    }

    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-auto">
                            {isLoading ? <div className="container"><p>Loading...</p></div> : <div className="mb-3">
                                <h1 className="fw-bold h3 d-inline align-middle">{data.data && data.data.title}</h1>
                            </div>
                            }
                        </div>

                        <div className="col-auto ms-auto">
                            <div className="mb-3">
                                {isBtnLoading ? <button type="button" className="btn btn-secondary me-2" disabled>Updating...</button> :
                                    <button type="button" className="btn btn-secondary me-2" onClick={() => handleSubmit()}>Update form schema</button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 col-xl-12">
                            <div className="card">
                                {isLoading ? <div className="container py-5 text-center"><p>Loading...</p></div> :
                                    <>
                                        <div className="card-header">

                                            <h5 className="card-title mb-0">Edit Category</h5>
                                        </div>
                                        <div className="card-body h-100">

                                            {/* Display category form */}
                                            <form>

                                                {/* Title */}
                                                <input type="text" className="form-control mb-3" placeholder="Cateogry Title" onChange={(event) => onChangeTitleAndSlug(event)} value={categoryTitle} />

                                                {/* Slug */}
                                                <input type="text" className="form-control mb-3" placeholder="Cateogry Slug" onChange={(event) => setCategorySlug(event.target.value)} value={categorySlug} />

                                            </form>

                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Form Schema */}
                    <div className="row">
                        <div className="col-md-12 col-xl-12">
                            <div className="card">
                                {isLoading ? <div className="container py-5 text-center"><p>Loading...</p></div> :
                                    <>
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-auto">
                                                    <h5 className="card-title mb-0">Edit Dynamic Form Schema</h5>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="card-body h-100">

                                            {/* Display category form schema */}
                                            <form>
                                                {formSchema && formSchema.length > 0 && formSchema.map((schema, index) => {
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

                                            <div className="row">
                                                <div className="col-auto ms-auto">
                                                    {isBtnLoading ? <button type="button" className="btn btn-secondary me-2" disabled>Updating...</button> :
                                                        <button type="button" className="btn btn-secondary me-2" onClick={() => handleSubmit()}>Update form schema</button>
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </main>

        </>
    )
}




// export category Details
export default AuthHoc(CategoryDetails)
