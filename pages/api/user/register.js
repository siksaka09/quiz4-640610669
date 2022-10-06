import { readUsersDB, writeUsersDB } from "../../../backendLibs/dbLib";
import bcrypt from "bcrypt";
import { checkToken } from "../../../backendLibs/checkToken";

export default function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //check authentication
    if (isAdmin) {
      const user = checkToken(req);
      if (!user || !user.isAdmin) {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to create account",
        });
      }
    }
    //return res.status(403).json({ok: false,message: "You do not have permission to create account",});

    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const users = readUsersDB();
    const foundUser = users.find((x) => x.username === username);
    if (foundUser)
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });
    //return res.status(400).json({ ok: false, message: "Username is already taken" });

    //create new user and add in db
    const newUser = {
      username,
      password: bcrypt.hashSync(password, 12),
      isAdmin,
      money: null,
    };

    if (newUser.isAdmin == true) {
      newUser.money = null;
    } else if (newUser.isAdmin == false) {
      newUser.money = 0;
    }

    users.push(newUser);
    writeUsersDB(users);

    //return response
    return res.json({ ok: true, username, isAdmin });
  }
}
