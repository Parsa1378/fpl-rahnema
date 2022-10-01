import mongoose from 'mongoose';
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
    getFeed(gameWeek: number, managerIds: mongoose.Types.ObjectId[]): Promise<IFeed[]> {
        throw new Error('Method not implemented.');
    }
    
    getFeeds = async(gameWeek: number,managersId:objId[]): Promise<IFeed[]>  => {
        const event: IEvent = await models.eventModel.findOne({generalId:gameWeek.toString});
        const feeds: IFeed[] = await models.feed_model.find(
            {
                event:event._id,
                managerId:{"$in":managersId}
            });
        return feeds;
    }

    convertSubs = async(subs: substitution[]): Promise<substitutionRsponse[]|null> => {
        let result:Array<substitutionRsponse> = [];

        if(subs.length===0) {
            return null;
        }

        for(let sub of subs) {
            let data:substitutionRsponse = {
                in: (await this.playerRepo.getPlayerById(sub.in)).web_name,
                out : (await this.playerRepo.getPlayerById(sub.out)).web_name
            };
            result.push(data);
        }
        return result;
    }

    addSub(managerId: objId, sub: substitution): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addLike(managerId: objId, liker: objId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeLike(managerId: objId, liker: objId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updatePoints(managerId: objId, points: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async createFeed(managerId:objId): Promise<void> {
        for(let i=1;i<=38;i++) {
            const event:IEvent = await models.eventModel.findOne({generalId:i.toString()});
            const data:feedCreationType = {
                managerId:managerId,
                points:0,
                substitutions:null,
                likers:null,
                event:event._id
            };
            await models.feed_model.create(data);
        }
    };
};
