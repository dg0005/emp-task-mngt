import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import _ from 'lodash'
import bcrypt from 'bcrypt';
import { Users } from '../models/User'
import { ErrorObject } from "../utils/constant";

export const registerController = async (req: Request, res: Response) => {
  try {

    const { body } = req;
    //check if the user exists
    const isUserExist = await Users.findOne({ username: body.username });

    if (isUserExist) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "User already exists",
      });
    }
    else {
      const hashedPassword = await bcrypt.hash(body.password, 10)  ;
      const user = await Users.create({ ...body, password: hashedPassword });

      if (!_.isEmpty(user)) {
        return res.status(200).send({
          status: 'success',
          statusCode: 200,
          message: 'User register successful',
        });
      }
    }

    res.status(500).send({
      status: 'failed',
      statusCode: 500,
      message: 'Registration failed',
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send(ErrorObject);
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).send({
        status: "failed",
        statusCode: 404,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        status: "failed",
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    // Generate token AFTER password match
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    ///cookie setting for token storage,
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    //   maxAge: 60 * 60 * 1000 // 1 hour
    // });

    if (token) {
      return res.status(200).send({
        status: "success",
        statusCode: 200,
        message: "Login successful",
        token: `Bearer ${token}`
      });
    }
    res.status(500).send({
      status: 'failed',
      statusCode: 500,
      message: 'Login failed',
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send(ErrorObject);
  }
}

