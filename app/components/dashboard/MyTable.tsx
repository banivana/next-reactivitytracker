"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

export default function MyTable({ events }: { events: any }) {
  console.log(events);
  return (
    <div className="m-8">
      <Table>
        <TableHeader>
          <TableColumn className="min-w-[200px]">Date</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Trigger</TableColumn>
          <TableColumn>Reaction</TableColumn>
          <TableColumn>Description</TableColumn>
        </TableHeader>
        <TableBody>
          {events.map((event: any) => (
            <TableRow key={event.key}>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.trigger_type}</TableCell>
              <TableCell>{event.level_of_reaction}</TableCell>
              <TableCell>{event.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
