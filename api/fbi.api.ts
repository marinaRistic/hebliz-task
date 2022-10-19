import axios from 'axios';


export class FBIAPIService {

    static FBIEndpointUrl = "https://api.fbi.gov/wanted/v1/list";

    public async getWantedList(name: string) {
       
        let response;
        try{
            response = await axios.get(FBIAPIService.FBIEndpointUrl, {
                headers: {
                    'User-Agent': 'request'
                },
                params: {
                    'title': name
                }
            });
            // console.log(response.headers)
        }catch(error) {
            console.log(error);
            return null
        }

        return response.data;
         
    }   

}
