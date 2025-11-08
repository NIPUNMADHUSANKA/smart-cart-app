import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';


const users: User[] = [
    {
        userId: '1',
        username: 'Alice',
        password: '123'
    },
    {
        userId: '2',
        username: 'Pet',
        password: '456'
    }
]



@Injectable()
export class UserService {
    async findUserByName(username: String): Promise<User |undefined>{
        return users.find((user) => user.username === username);
    }

}
