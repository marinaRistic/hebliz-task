import axios from 'axios';


export class GeoIpfyService {

    static geoipfyEndpointUrl = "https://geo.ipify.org/api/v1";
    static apiKey = 'at_eXjXUyplLFGTdGt1LHOeYQ3iHxiKR'

    public async getIpAddressInfo(ipAddress: string) {
       
        let response;
        try{
            response = await axios.get(GeoIpfyService.geoipfyEndpointUrl, {
                params: {
                    'apiKey': GeoIpfyService.apiKey,
                    'ipAddress': ipAddress
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
