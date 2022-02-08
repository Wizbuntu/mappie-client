// useSwr
import useSWR from "swr";

// axios
import axios from '../config/axios.config'


// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)



// init useSingleMetaData
const useSingleMetaData = (metadataId) => {

    // fetch single metadata
    const { data, error } = useSWR(metadataId ? `${process.env.API_ROOT}/metadata/${metadataId}` : null, fetcher)

    // return 
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}



// const useSingleCategory = (categoryId) => {

//       // fetch single metadata
//       const { data, error } = useSWR(, fetcher)

//       // return 
//       return {
//           data: data,
//           isLoading: !error && !data,
//           isError: error
//       }
// }




// export useCategories
export default useSingleMetaData