// useSwr
import useSWRImmutable from "swr/immutable";

// axios
import axios from '../config/axios.config'


// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)



// init useCategory
const useCategory = () => {
    // fetch categories
    const { data, error } = useSWRImmutable(`${process.env.API_ROOT}/all/categories`, fetcher)

    // return 
    return {
        categories: data,
        isLoading: !error && !data,
        isError: error
    }
}





// export useCategories
export default useCategory