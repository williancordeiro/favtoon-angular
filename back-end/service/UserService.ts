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

    async checkUsernameAvailability(username: string, currentUserId?: string) {
        try {
            // Se não há username, considere como disponível
            if (!username || username.trim() === '') {
                return true;
            }

            const filter = currentUserId 
                ? `username="${username}" && id!="${currentUserId}"`
                : `username="${username}"`;
            
            const result = await pb.collection('users').getList(1, 1, { filter });
            
            return result.totalItems === 0; // true se disponível, false se já existe
        } catch (error: any) {
            console.error('Error checking username availability:', error);
            // Em caso de erro, assumir que não está disponível por segurança
            return false;
        }
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