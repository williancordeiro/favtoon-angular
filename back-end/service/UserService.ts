import { pb } from './PocketBaseService';

export class UserService {

    createUser = async (email: string, password: string, passwordConfirm: string, name: string, username: string) => {
        try {
            const user = await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                name,
                username
            });
            return user;
        } catch (error: any) {
            console.error('Error creating user:', error.response?.data || error);
            throw error;
        }
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