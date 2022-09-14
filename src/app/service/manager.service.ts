import { Types } from "mongoose";
import { ManagerRepo } from "../database/repository/manager.repo";
import { TeamRepo } from "../database/repository/team.repo";
import { IManager } from "../Interface/manager.interface";
import { IPick, ITeam } from "../Interface/team.interface";
import models = require("../models/path");
import objId = require("../types/types");

export class ManagerService {
  managerRepo: ManagerRepo;
  teamRepo: TeamRepo;

  constructor() {
    this.managerRepo = new ManagerRepo();
    this.teamRepo = new TeamRepo();
  }

  public async getTeamPlayerIdsByManagerId(id: Types.ObjectId) {
    let manager: IManager = await this.managerRepo.getManagerById(id);
    let team: ITeam = await this.teamRepo.getTeamById(manager.teamId!);
    let picks: IPick[] = team.picks;
    let pickIds: objId[] = [];
    await picks.map((element: IPick) => {
      if (element.player) {
        pickIds.push(element.player._id);
      }
    });
    return pickIds;
  }
}
