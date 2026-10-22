import mongoose, { Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";
export interface IProjet extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}
declare const Project: mongoose.Model<IProjet, {}, {}, {}, Document<unknown, {}, IProjet, {}, mongoose.DefaultSchemaOptions> & IProjet & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjet>;
export default Project;
