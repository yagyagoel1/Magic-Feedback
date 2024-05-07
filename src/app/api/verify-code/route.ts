import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const codeCheck = verifySchema.safeParse({ username, code });
    if (!codeCheck.success) {
      return Response.json(
        {
          success: false,
          message: "enter a valid username and code",
        },
        {
          status: 400,
        }
      );
    }
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user does not exist",
        },
        {
          status: 400,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "code is expired ,please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
    } else
      return Response.json(
        {
          success: false,
          message: "code is incorrect",
        },
        {
          status: 400,
        }
      );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
