// useSwr
import useSWRImmutable from "swr/immutable";

// axios
import axios from '../config/axios.config'


// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)



// init useMetaData
const useMetaData = () => {

    // fetch metadata
    const { data, error } = useSWRImmutable(`${process.env.API_ROOT}/all/metadata`, fetcher)

    // return 
    return {
        metadata: data,
        isMetaLoading: !error && !data,
        isMetaError: error
    }
}





// export useCategories
export default useMetaData