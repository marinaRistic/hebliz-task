import express, { Request, Response } from 'express';
import { Service } from './api/api-functions';

const checkerService: Service = new Service();


const app = express();
app.use(express.json());

app.post('/witnessreport', async (req: Request, res: Response) => {
    const body = req.body;
    const response = await checkerService.checker(body.name, body.phoneNumber, req.socket.remoteAddress);
    if (response instanceof Error) {
        res.status(400);
        res.send(response?.message);
    }
    else {
        //always returns pdf file
        res.status(200);
        res.set('Content-Type', 'application/pdf');
        res.send(response);
    }
})

app.listen(3000, () => console.log(`Express server running on port 3000`));