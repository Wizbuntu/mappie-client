// useSwr
import useSWRImmutable from "swr/immutable";

// axios
import axios from '../config/axios.config'


// init fetcher
const fetcher = url => axios.get(url).then(res => res.data)



// init useReporting
const useReporting = () => {

    // fetch metadata
    const { data, error } = useSWRImmutable(`${process.env.API_ROOT}/all/reporting`, fetcher)

    // return 
    return {
        reporting: data,
        isLoading: !error && !data,
        isError: error
    }
}





// export useReporting
export default useReporting