
import { FBIAPIService } from './fbi.api';
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';


import { jsPDF } from "jspdf";
import { GeoIpfyService } from './geoipfy.api';



export class Service {


    fbiAPIService: FBIAPIService;
    geoipfyService: GeoIpfyService;

    constructor() {
        this.fbiAPIService = new FBIAPIService();
        this.geoipfyService = new GeoIpfyService();
    }    
  
    async checker(name: string, phoneNumber: string, ip?: string) {

        if (!name) {
            return new Error('Name missing in request body.');
        }
        if (!phoneNumber) {
            return new Error('Phone number missing in request body.');
        }
       
        try{
            //get data from fbi api 
            const allData = await this.fbiAPIService.getWantedList(name); //add name;

            //check phone validity
            const valid = isValidPhoneNumber(phoneNumber);

            let country;
            const asYouType = new AsYouType();
            asYouType.input(phoneNumber);
            if (valid) {
                country = asYouType.getNumber()?.country;
            }
            if (!country) {
                //get country code from ip address
                if(ip) {
                    const ipInfo = await this.geoipfyService.getIpAddressInfo(ip);
                    country = ipInfo.location.country;
                }
            }

            if (!country || country == 'ZZ') {
                // If no ip or phone number extracted country code, force user to enter phone number in e.164 format
                // throw new Error(`Phone number must be in E. 164 format: [+][country code][subscriber number including area code] `);
                country = 'No country extracted from phone number or IP address';
            } 

            //iso aplha 2 country code can be converted to string 
 

            let pdf: jsPDF;
            if (allData.items && allData.items.length > 0) {
                //use only data ids for report
                const data = allData.items.map((el: any) => el.uid);
                pdf = await this.createPDF(data, name, phoneNumber, country, valid)     
               
            } else {
                //empty pdf
                pdf = await this.createPDF([], name, phoneNumber, country, valid);
            }

            return pdf.output();

        } catch(error) {
            console.log("error in checker function");
            console.log(error);
            throw new Error("Error occured while checking requested data.");
        }    
    }   

    async createPDF(data: string[], name: string, phoneNumber: string, country: string, valid: boolean) {

        const doc = new jsPDF();

        let margin = 10;
        doc.setFontSize(20)
        doc.text('FBI Witness report', 70, margin);

        doc.setFontSize(13);
        margin+=10;
        doc.text('Search parameter:', 20, margin);
        margin+=8;
        doc.text(`name: ${name}`, 40, margin);
        margin+=10;

        doc.text(`Contact details:`, 20, margin);
        margin+=8;
        doc.text(`Phone number: ${phoneNumber}`, 40, margin);
        margin+=8;
        doc.text('Phone number status: ' + (valid ? 'valid' : 'not valid'), 40, margin);
        margin+=8;
        doc.text(`Client's country code:  ${country}`, 40, margin);    
        margin+=20;

        if (data.length == 0) {
            doc.text("No cases found for requested search parameters:", 20, margin);
        }
        else {
            doc.text("Case IDs found for requested title.", 20, margin);
            margin+=8
            for (const dataobj of data) {
                doc.text(dataobj, 40, margin);
                margin+=8;
            }
        }
        return doc;
    }

}
