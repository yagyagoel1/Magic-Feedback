import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "invalid query parameter",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "usernaem is already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message: "usernaem is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("error checking username ", error);
    return Response.json(
      {
        success: false,
        message: "error while checking username",
      },
      {
        status: 500,
      }
    );
  }
}
