import { pb } from './PocketBaseService';

export class UserService {

    createUser(user: any) {
        return pb.collection('users').create(user);
    }

    getUserById(id: string) {
        return pb.collection('users').getOne(id);
    }

    getUserByEmail(email: string) {
        return pb.collection('users').getList(1, 10, { filter: `email="${email}"` });
    }

    login(email: string, password: string) {
        return pb.collection('users').authWithPassword(email, password);
    }
}