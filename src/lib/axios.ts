import type { AxiosError } from 'axios';

import Axios from 'axios';
import config from 'utils/config';

export default Axios.create({
    baseURL: config.API_ANIMETHEMES,
});

export function handleAxiosError(error: AxiosError<{ message?: string }>) {
    if (error.response) {
        // AnimeThemes API returned an error, so we read the error message from the response body
        return error.response.data.message ?? 'Unknown API error.';
    }

    // Something bad happened before we could reach the API
    return error.message;
}