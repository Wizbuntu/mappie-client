// useSwr
import useSWR from "swr";

// axios
import axios from '../config/axios.config'


// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)



// init useSingleCategory
const useSingleCategory = (categoryId) => {

    // fetch single category
    const { data, error } = useSWR(categoryId ? `${process.env.API_ROOT}/category/${categoryId}` : null, fetcher)

    // return 
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}





// export useCategories
export default useSingleCategory