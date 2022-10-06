import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
import { checkToken } from "../../backendLibs/checkToken";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Permission denied",
      });
    }
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const users = readUsersDB();
    let numAdmin = 0,
      numUser = 0,
      sumMoney = 0;
    for (let user in users) {
      if (users[user].isAdmin) {
        numAdmin++;
      } else {
        numUser++;
        sumMoney += users[user].money;
      }
    }
    return res.status(403).json({
      ok: true,
      userCount: numAdmin,
      adminCount: numUser,
      totalMoney: sumMoney,
    });
    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
