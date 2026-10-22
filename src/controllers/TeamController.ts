import type { Response, Request } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    //Find user
    const user = await User.findOne({ email }).select("id email name");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    res.json(user);
  };

  static getProjecTeam = async (req: Request, res: Response) => {
    const project= await (await Project.findById(req.project._id)).populate({
        path: 'team',
        select : 'id name email'
    })
    res.json(project.team)
  }


  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;
    //Find user
    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (
      req.project.team.some((team) => team.toString() === user._id.toString())
    ) {
      const error = new Error("Usuario ya existe en el proyecto");
      return res.status(409).json({ error: error.message });
    }
    req.project.team.push(user._id);
    await req.project.save();
    res.send("Usuario agregado correctamente");
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (
      !req.project.team.some((team) => team.toString() === userId)
    ) {
      const error = new Error("Usuario No existe en el proyecto");
      return res.status(409).json({ error: error.message });
    }

    req.project.team = req.project.team.filter(
      (teamMember) => TeamMemberController.toString() === userId,
    );

    await req.project.save();
    res.send("Usuario Eliminado correctamente");
  };
}
