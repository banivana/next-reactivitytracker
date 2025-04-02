"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <div className="space-y-6 p-6">
      {days.length === 0 ? (
        <p className="text-gray-500">
          No journal entries found for this client.
        </p>
      ) : (
        <div className="space-y-8">
          {days.map((day) => (
            <div key={day.date} className="space-y-4">
              <h2 className="ml-4 text-lg font-semibold">
                {formatDate(day.date)}
              </h2>

              {/* Notes Section */}
              {day.notes.length > 0 && (
                <div className="space-y-2">
                  {day.notes.map((note) => (
                    <div key={note.id} className="flex items-start gap-2 pl-6">
                      <FontAwesomeIcon
                        icon={faNoteSticky}
                        className="w-4 h-4 text-gray-400 mt-1"
                      />
                      <p className="text-sm text-gray-600">
                        {note.note_content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Health Section */}
              {day.health.length > 0 && (
                <div className="space-y-2">
                  {day.health.map((health) => (
                    <div
                      key={health.id}
                      className="flex items-start gap-2 pl-6"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="w-4 h-4 text-rose-400 mt-1"
                      />
                      <p className="text-sm text-gray-600">
                        {health.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Triggers Section */}
              {day.triggers.length > 0 && (
                <div className="pl-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-sm font-normal text-gray-400 pb-2 pr-4 w-[30%]">
                          Location
                        </th>
                        <th className="text-left text-sm font-normal text-gray-400 pb-2 px-4 w-[10%]">
                          Trigger
                        </th>
                        <th className="text-left text-sm font-normal text-gray-400 pb-2 pl-4">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-8 divide-transparent">
                      {day.triggers.map((trigger) => (
                        <tr key={trigger.id}>
                          <td className="text-sm text-gray-500 truncate pr-4 py-2">
                            {trigger.location}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center">
                              <TriggerIcon
                                triggerType={trigger.trigger_type}
                                reactionLevel={trigger.level_of_reaction}
                                size={20}
                              />
                            </div>
                          </td>
                          <td className="text-sm text-gray-500 pl-4 py-2">
                            {trigger.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
