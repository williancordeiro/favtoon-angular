import { pb } from './PocketBaseService';

export class SerieService {
    
    createSerie(serie: any) {
        return pb.collection('series').create(serie);
    }

    getSerieById(id: string) {
        return pb.collection('series').getOne(id);
    }

    getSeriesByUserId(userId: string) {
        return pb.collection('series').getList(1, 10, {
            filter: `user_id = "${userId}"`
        });
    }

    updateSerie(id: string, serieData: any) {
        return pb.collection('series').update(id, serieData);
    }

    deleteSerie(id: string) {
        return pb.collection('series').delete(id);
    }
}