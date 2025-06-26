import { pb } from './PocketBaseService';

export class UserService {

    createUser(user: any) {
        return pb.collection('users').create(user);
    }

    getCurrentUser() {
        return pb.collection('users').getOne(pb.authStore.model?.id || '');
    }

    getUserByEmail(email: string) {
        return pb.collection('users').getList(1, 10, { filter: `email="${email}"` });
    }

    getUserIcon(user: any) {
        return pb.files.getURL(user, user.avatar);
    }

    login(email: string, password: string) {
        return pb.collection('users').authWithPassword(email, password);
    }

    logout() {
        return pb.authStore.clear();
    }

    updateUser(id: string, data: any) {
        return pb.collection('users').update(id, data);
    }
}