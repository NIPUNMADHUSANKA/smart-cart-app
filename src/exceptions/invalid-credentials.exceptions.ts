import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsExcpetions extends HttpException{
    constructor(){
        super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

}