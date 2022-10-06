import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function balanceRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to check balance",
      });
    }
    // return res.status(403).json({ok: false,message: "You do not have permission to check balance",});

    const users = readUsersDB();
    const foundUser = users.find((x) => user.username === x.username).money;
    if (foundUser) return res.status(200).json({ ok: true, money: foundUser });
    //find user in DB and get their money value

    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
