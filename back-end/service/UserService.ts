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
            throw error;
        }
    }

    getCurrentUser() {
        return pb.collection('users').getOne(pb.authStore.model?.id || '');
    }

    getUserByEmail(email: string) {
        return pb.collection('users').getList(1, 10, { filter: `email="${email}"` });
    }

    async checkUsernameAvailability(username: string, currentUserId?: string): Promise<boolean> {
        try {
            if (!username?.trim()) {
                return true;
            }

            username = username.trim().toLowerCase();

            const conditions = [`username="${username}"`];
            if (currentUserId) {
                conditions.push(`id!="${currentUserId}"`);
            }

            const filter = conditions.join(' && ');

            await pb.collection('users').getFirstListItem(
                conditions.join(' && '),
                { requestKey: `username_check_${username}` }
            );

            return false;

        } catch (error: any) {
            if (error?.status === 404) {
                return true;
            }

            return false;
        }
    }

    async changeUserPassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        const currentUser = pb.authStore.model;
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        return pb.collection('users').update(currentUser['id'], {
            email: currentUser['email'],
            name: currentUser['name'],
            username: currentUser['username'],
            oldPassword: currentPassword,
            password: newPassword,
            passwordConfirm: confirmPassword
        });
    }

    updateUserIcon(userId: string, file: File) {
        return pb.collection('users').update(userId, {
            avatar: file
        });
    }

    verifyCurrentPassword(email: string, password: string) {
        return pb.collection('users').authWithPassword(email, password);
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