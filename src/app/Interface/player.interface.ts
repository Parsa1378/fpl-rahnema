import mongoose from "mongoose";

interface IPlayerFunctions {
  paginatePlayers(
    filter: string,
    page: Number,
    limit: Number,
    pickIds: mongoose.Types.ObjectId[]
  ): Promise<playerPaginateResponse>;

  getPlayerByName(
    filter: string,
    page: Number,
    limit: Number,
    web_name: string,
    pickIds: mongoose.Types.ObjectId[]
  ): Promise<playerPaginateResponse>;
}

interface IPlayer {
  generalId: Number;
  positionId: Number;
  news: String;
  in_dreamteam: Boolean;
  event_points: Number;
  first_name: String;
  form: Number;
  now_cost: Number;
  points_per_game: Number;
  second_name: String;
  special: Boolean;
  status: String;
  teamId: Number;
  value_form: Number;
  value_season: Number;
  web_name: String;
  minutes: Number;
  goals_scored: Number;
  assists: Number;
  clean_sheets: Number;
  goals_conceded: Number;
  own_goals: Number;
  penalties_saved: Number;
  penalties_missed: Number;
  yellow_cards: Number;
  red_cards: Number;
  saves: Number;
  bonus: Number;
}

type playerPaginateResponse = {
  docs: IPlayer[];
  total: Number;
  limit: Number;
  page: Number;
  pages: Number;
};

export { IPlayer, IPlayerFunctions, playerPaginateResponse };