import models = require('../../models/path');
import {IFeed, IFeedRepo} from '../../interface/feed.interface';
import { objId, substitution,feedCreationType, substitutionRsponse } from '../../types/types';
import { IEvent } from '../../interface/event.interface';
import { PlayerRepo } from './player.repo';

export class FeedRepo implements IFeedRepo {
    playerRepo:PlayerRepo;

    constructor(){
        this.playerRepo = new PlayerRepo();
    }
    
    getFeeds = async(gameWeek: number,managersId:objId[]): Promise<IFeed[]>  => {        
        const event: IEvent = await models.eventModel.findOne({generalId:gameWeek.toString()});        
        const feeds: IFeed[] = await models.feed_model.find(
            {
                event:event._id,
                managerId:{$in:managersId}
            });        
        return feeds;
    }

    convertSubs = async(subs: substitution[]): Promise<substitutionRsponse[]|null> => {
        let result:substitutionRsponse[] = [];
        if(subs===null) {
            return [];
        }

        for(let sub of subs) {
            let data:substitutionRsponse = {
                in: (await this.playerRepo.getPlayerById(sub.in)).web_name,
                out : (await this.playerRepo.getPlayerById(sub.out)).web_name
            };
            result.push(data);
        }
        console.log(result);
        return result;
    }

    addSub = async(managerId: objId, sub: substitution, event:objId): Promise<void> => {
        await models.feed_model.findOneAndUpdate({managerId:managerId,event:event},
            {
                $push:{substitutions:{sub}}
            });        
    }

    async createFeed(managerId:objId): Promise<void> {
        for(let i=1;i<=38;i++) {
            const event:IEvent = await models.eventModel.findOne({generalId:i.toString()});
            const data:feedCreationType = {
                managerId:managerId,
                points:0,
                substitutions:null,
                event:event._id
            };
            await models.feed_model.create(data);
        }
    };
};
