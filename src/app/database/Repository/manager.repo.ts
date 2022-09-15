import models = require("../../models/path");
import { IPick, ITeam } from "../../Interface/team.interface";
import { IManagerRepo, IManager } from "../../Interface/manager.interface";
import {objId, managerSignUpType } from "../../Types/types";

class ManagerRepo implements IManagerRepo {
  
  getManagerById = async (managerId: objId): Promise<IManager> => {
    const manager = await models.managerModel.findById(managerId);
    return manager;
  };
  
  //where is this used?
  getTeamByManagerId = async (managerId: objId): Promise<Array<IPick>> => {
    const manager = await models.managerModel
    .findById(managerId)
    .populate("teamId")
    .exec();
    return manager.teamId.picks;
  };
  
  //where is this used?
  getTeamDetailByManagerId = async (managerId: objId): Promise<object> => {
    const team = await models.managerModel
    .findById(managerId)
    .populate(["teamId", { path: "teamId", populate: "picks.player" }])
    .exec();
    return team;
  };
  
  updateManagerBudgetById = async (managerId: objId,budget: number): Promise<void> => {
    await models.managerModel.updateOne(
      { _id: managerId },
      { $set: { budget: budget } }
      );
    };
    
    updateTeamById = async (teamId: objId, data: objId | null, index: number): Promise<void> => {
    //maybe team repo needed
    await models.teamModel.findByIdAndUpdate(teamId, {
      $set: {
        [`picks.${index}.player`]: data,
      },
    });
  };
  
  createManager = async(managerData:managerSignUpType):Promise<IManager> => {
    const manager:IManager = await models.managerModel.create(managerData);
    return manager;
  };
  
  findManager = async(username: string): Promise<IManager|null> => {
    const manager:IManager = await models.managerModel.findOne({username:username});
    return manager;
  };

  createTeam = async():Promise<objId> => {
    let picks = [];
    for (let i = 0; i < 15; i++) {
      await picks.push({
        player_id: null,index:i
      });
    }
    const team = await models.teamModel.create({
      picks: picks,
    });
    return team._id;
  };
  
};

export {ManagerRepo};
