"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faHeart } from "@fortawesome/free-solid-svg-icons";
import { TriggerIcon } from "./TriggerIcon";

type Event = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  trigger_type: string;
  level_of_reaction: string;
  description: string;
  location: string;
};

type Health = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  description: string;
};

type Note = {
  id: number;
  created_at: string;
  user_id: string;
  date: string;
  note_content: string;
};

type Day = {
  date: string;
  health: Health[];
  notes: Note[];
  triggers: Event[];
};

export default function ClientJournalDisplay({ days }: { days: Day[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  };

  // Icon for notes
  const getNoteIcon = () => {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faPencil} className="w-5 h-5 text-gray-500" />
      </div>
    );
  };

  // Icon for health
  const getHealthIcon = () => {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-green-500" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {days.length === 0 ? (
        <p className="text-gray-500">
          No journal entries found for this client.
        </p>
      ) : (
        <div className="grid gap-6">
          {days.map((day) => (
            <Card key={day.date} className="overflow-hidden shadow-sm">
              <CardHeader className="bg-gray-50 py-4 px-6">
                <CardTitle className="text-xl font-bold">
                  {formatDate(day.date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {day.notes.length > 0 && (
                  <div className="border-b">
                    {day.notes.map((note) => (
                      <div key={note.id} className="flex items-start p-4">
                        {getNoteIcon()}
                        <div className="ml-3">
                          <div className="font-semibold">
                            {note.note_content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {day.health.length > 0 && (
                  <div className="border-b">
                    {day.health.map((item) => (
                      <div key={item.id} className="flex items-start p-4">
                        {getHealthIcon()}
                        <div className="ml-3">
                          <div className="font-semibold">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {day.triggers.length > 0 && (
                  <div>
                    <div className="grid grid-cols-3 text-sm text-gray-500 font-medium py-2 px-4 border-b">
                      <div>Location</div>
                      <div>Trigger</div>
                      <div>Description</div>
                    </div>
                    {day.triggers.map((trigger, index) => (
                      <div
                        key={trigger.id}
                        className="p-4 flex items-start border-b last:border-b-0"
                      >
                        <div className="grid grid-cols-3 w-full">
                          <div className="text-sm">{trigger.location}</div>
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-md`}
                            >
                              <TriggerIcon
                                triggerType={trigger.trigger_type}
                                reactionLevel={trigger.level_of_reaction}
                                size={24}
                              />
                            </div>
                          </div>
                          <div className="text-sm">{trigger.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
