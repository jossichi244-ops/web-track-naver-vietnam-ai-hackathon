// import { Progress } from "@radix-ui/react-progress";

interface Group {
  group_id: string;
  group_name: string;
  task_count: number;
  role: string;
}

interface Props {
  groups: Group[];
}

export default function GroupProgress({ groups }: Props) {
  return (
    <div className="space-y-4">
      {groups.map((g) => {
        const completed = Math.floor(Math.random() * g.task_count); // mock
        const percent = g.task_count ? (completed / g.task_count) * 100 : 0;
        return (
          <div key={g.group_id}>
            <p className="font-medium">{g.group_name}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${percent}%` }}></div>
            </div>
            <p className="text-xs text-gray-500">
              {completed} / {g.task_count} tasks done
            </p>
          </div>
        );
      })}
    </div>
  );
}
