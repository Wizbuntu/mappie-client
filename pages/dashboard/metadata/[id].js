import { useState, useEffect } from 'react';

// AuthHoc
import AuthHoc from '../../../hoc/authHoc'

// Toaster
import { Toaster, toast } from 'react-hot-toast'

// axios
import axios from '../../../config/axios.config'

// useMetaData
import useSingleMetaData from '../../../hooks/useSingleMetaData'

// useSingleCategory
import useSingleCategory from '../../../hooks/useSingleCategory';

// useRouter
import { useRouter } from 'next/router';


// init metadata Details
const MetadataDetails = () => {

    // init router
    const router = useRouter()

    // get id from router
    const metadataId = router.query.id

    // invoke useSingleMetaData 
    const { data, isLoading, isError } = useSingleMetaData(metadataId)

    // invoke useSingleCateogry hook
    const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useSingleCategory(data && data.data.categoryId)



    // init metataData state
    const [metaData, setMetaData] = useState({})

    // init formSchema
    const [formSchema, setFormSchema] = useState([])

    // init btnLoading state 
    const [isBtnLoading, setIsBtnLoading] = useState(false)



    // int useEffect
    useEffect(() => {

        // check if error
        if (isError) {
            return toast.error("Oops! an error has occurred")
        }

        // check if categoryError
        if (categoryError) {
            return toast.error("Oops! an error has occurred")
        }

        // check if data
        if (data && data.success) {

            // update metadata state
            setMetaData(data.data.data)

            // update setFormSchema
            setFormSchema(categoryData && categoryData.data.formSchema)

            console.log("categoryData", categoryData && categoryData.data.formSchema)
            console.log("metadata", data.data.data)

        }


    }, [isError, data, categoryData])




    // init handleChange 
    const handleChange = (data) => (event) => {
        setMetaData({...metaData, [data]: event.target.value})
    }



    // init handleSubmit
    const handleSubmit = async() => {
        try {

            // update isBtnLoading
            setIsBtnLoading(true)

            // get metaData
            const _metaData = {...metaData}
            
            // make axios request to update metadata
            const response = await axios.put(`${process.env.API_ROOT}/update/metadata/${metadataId}`, _metaData)

            // check if not success
            if(!response.data.success) {
                // update isBtnLoading
                setIsBtnLoading(false)

                return toast.error("Failed to update metadata")
            }

            // show success 
            toast.success("Metadata updated successfully")

            // reload page 
            return router.reload()

        }catch(error) {
            setIsBtnLoading(false)
            console.log(error)
            return toast.error("Failed to update metadata")
        }
    }


    return (
        <>
            <Toaster />
            <main className="content">
                <div className="container-fluid p-0">
                    <h1 className="h3 mb-3"><strong>Update Metadata</strong></h1>
                    {isLoading && categoryLoading ? <div className="row">
                        <div className="col-12 mx-auto">
                            <p>Loading...</p>
                        </div>

                    </div> : 
                    <div className="row">
                        <div className="col-8 mx-auto">
                        <form>
                            <div className="row">
                                {formSchema && formSchema.length > 0 && formSchema.map((schema, index) => {
                                    return  <div key={index} className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor={schema.name} className="form-label">{schema.label}</label>
                                        {schema.element === "input" ? <input type={schema.type} className="form-control" onChange={handleChange(schema.name)} id={schema.name} value={metaData[schema.name]} /> : 
                                        <textarea type="text" className="form-control" onChange={handleChange(schema.name)} id={schema.name} value={metaData[schema.name]}  />
                                        }
                                    </div>
                            </div>
                                })}
                              
                            </div>
                            {isBtnLoading ? <button type="button" className="btn btn-primary" disabled>Loading...</button> : 
                            <button type="button" onClick={() => handleSubmit()} className="btn btn-primary">Submit</button>
                            }
                            
                            </form>
                        </div>
                    </div>
                    }
                </div>
            </main>




        </>
    )
};





// export metadata Details
export default AuthHoc(MetadataDetails)
