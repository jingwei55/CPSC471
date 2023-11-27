import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const register = (req, res) => {
//   //CHECK EXISTING USER
//   const q = "SELECT * FROM members WHERE email = ? OR username = ?";

//   db.query(q, [req.body.email, req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");

//     //Hash the password and create a user
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(req.body.password, salt);

//     const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
//     const values = [req.body.username, req.body.email, hash];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("User has been created.");
//     });
//   });
// };

export const register = (req, res) => {
  const { username, email, password, role } = req.body;

  // Check existing user in the appropriate table based on role
  const checkUserQuery =
    role === "employee"
      ? "SELECT * FROM employees WHERE email = ? OR username = ?"
      : "SELECT * FROM members WHERE email = ? OR username = ?";

  db.query(checkUserQuery, [email, username], (err, data) => {
    // check username & pw from database
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert the user into the appropriate table based on role
    const insertUserQuery =
      role === "employee"
        ? "INSERT INTO employees(`username`, `email`, `password`) VALUES (?)"
        : "INSERT INTO members(`username`, `email`, `password`) VALUES (?)";

    const values = [username, email, hash];

    db.query(insertUserQuery, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

// export const login = (req, res) => {
//   //CHECK USER

//   const q = "SELECT * FROM users WHERE username = ?";

//   db.query(q, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length === 0) return res.status(404).json("User not found!");

//     //Check password
//     const isPasswordCorrect = bcrypt.compareSync(
//       req.body.password,
//       data[0].password
//     );

//     if (!isPasswordCorrect)
//       return res.status(400).json("Wrong username or password!");

//     const token = jwt.sign({ id: data[0].id }, "jwtkey");
//     const { password, ...other } = data[0];

//     res
//       .cookie("access_token", token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json(other);
//   });
// };

export const login = (req, res) => {
  const { username, password, role } = req.body;

  // Choose the appropriate table based on the role
  const tableName = role === "employee" ? "employees" : "members";

  // Check user in the selected table
  const checkUserQuery = `SELECT * FROM ${tableName} WHERE username = ?`;

  db.query(checkUserQuery, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    // Generate JWT token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    // Exclude password from the response
    const { password, ...other } = data[0];

    // Set the token as a cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
