import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user not accepting the messages",
        },
        {
          status: 401,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message send successfully",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.error("error adding messages : ", error);
    return Response.json(
      {
        success: false,
        message: "an unexpected error occured",
      },
      {
        status: 500,
      }
    );
  }
}
