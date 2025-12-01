import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';


const users: User[] = [
    {
        userId: '1',
        userName: 'Alice',
        password: '123'
    },
    {
        userId: '2',
        userName: 'Pet',
        password: '456'
    }
]



@Injectable()
export class UserService {
    async findUserByName(userName: String): Promise<User |undefined>{
        return users.find((user) => user.userName === userName);
    }

}
