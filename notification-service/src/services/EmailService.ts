import { Service } from "typedi";
import { SendMailDTO } from "../dto/sendmail.dto";

@Service()
export default class EmailService {
    // private readonly logger: Logger;
    constructor(
    ) {
        // this.logger = new Logger(AuthService.name);
    }

    public async registerUser(req: SendMailDTO){
        // const { email, password } = req;

    }

}