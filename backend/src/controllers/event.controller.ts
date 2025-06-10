import dotenv from "dotenv";
import Event from "../models/event.model";
dotenv.config();
export const addEvent = async (req: any, res: any) => {
  const { title, description, start, end, allDay } = req.body;
  const userId = req.userId;
  try {
    await Event.create({
      title,
      description,
      start,
      end,
      allDay,
      createdBy: userId,
    });
    res.json("Event added successfully");
  } catch (e) {
    res.json("some error occured" + e);
  }
};

export const updateEvent = async (req: any, res: any) => {
  const { title, description, start, end, allDay } = req.body;
  const { eventId } = req.params;
  try {
    const event = await Event.findOneAndUpdate(
      { _id: eventId },
      {
        title,
        description,
        start,
        end,
        allDay,
      }
    );
    res.json("Event updated successfully");
  } catch (e) {
    res.json("some error occured" + e);
  }
};

export const deleteEvent = async (req: any, res: any) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOneAndDelete({ _id: eventId });
    res.json("Event deleted successfully");
  } catch (e) {
    res.json("some error occured" + e);
  }
};
